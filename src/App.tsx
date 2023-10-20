import { useState, useEffect, ChangeEvent, useRef, MouseEventHandler } from 'react'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import mermaid from 'mermaid'
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter'
import {oneDark} from 'react-syntax-highlighter/dist/esm/styles/prism'
import { Button, Flex, Input, Space } from 'antd'
import { CopyOutlined, DownloadOutlined } from '@ant-design/icons'
import './github-markdown.css'
import './App.css'

mermaid.initialize({
  startOnLoad: false
})
const { TextArea } = Input
const randId = (prefix = 'id') => prefix + Math.random().toString(36).slice(2)

function App() {
  const [markdown, setMarkdown] = useState<string>('# type something')
  const textRef = useRef<HTMLTextAreaElement>(null)

  const render = async (text: string, ele: Element | null) => {
    if (!ele) return
    try {
      const {svg} = await mermaid.mermaidAPI.render(randId('buf'), text, ele)
      ele.innerHTML = svg
    } catch (ex) {
      console.error(ex)
    }
  }

  const rerender = async (mermaids: NodeListOf<Element>) => {
    for (const ele of mermaids) {
      await render(ele.textContent ?? '', ele)
     }
   }

  useEffect(() => {
    const mermaids = document.querySelectorAll('.mermaid')
    rerender(mermaids)
  }, [markdown])

  const onChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    e.preventDefault()
    setMarkdown(e.target.value)
  }

  const copyToClipboard: MouseEventHandler<HTMLElement>  = (evt) => {
    const text = evt.currentTarget.getAttribute('data-value') ?? ''
    navigator.clipboard.writeText(text)
      .then(() => {
        console.log('Text copied to clipboard');
      })
      .catch((err) => {
        console.error('Failed to copy text to clipboard:', err);
      })
  }

  // Function to convert SVG to PNG
  const convertSvgToPng = (svgElement: SVGSVGElement) => {
    const width = svgElement.width.baseVal.value;
    const height = svgElement.height.baseVal.value;

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext('2d');
    if (!context) return

    // Create a new Image object and load SVG as data URL
    const image = new Image();
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const svgUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgData)}`;

    image.onload = () => {
      // Draw the loaded SVG image onto the canvas
      context.clearRect(0, 0, width, height);
      context.drawImage(image, 0, 0, width, height);

      // Convert canvas to PNG data URL
      const pngDataUrl = canvas.toDataURL('image/png');

      // Invoke the callback function with the PNG data URL
      const link = document.createElement('a');
      link.href = pngDataUrl;
      link.download = `talkgpteal_chart_${svgElement.id}.png`
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);;
    };

    image.src = svgUrl;
  };

  const downloadImage: MouseEventHandler<HTMLElement> = (evt) => {
    const parent = evt.currentTarget.parentElement
    if (!parent) return
    const svgElement = parent.querySelector('svg'); // Replace with your SVG's ID or selector
    if (!svgElement) return
    convertSvgToPng(svgElement); // Provide a desired filename
  }

  const insertCode = () => {
    setMarkdown(markdown + `
\`\`\`js
  const a = 1
\`\`\``)
  }

  const insertTable = () => {
    setMarkdown(markdown + `
| Caso                  | Status | Respuesta                                          |
| --------------------- | ------ | -------------------------------------------------- |
| Success               | 200    | {payload}                                          |
| Bad Request           | 400    | { "status": 400, "message": "Bad Request" }        |
| Invalid Credentials   | 401    | { "status": 401,"message": "Invalid redentials"}   |
| Not Found Exception   | 404    | { "status": 404,"message": "Resource not Found"}   |
| Method Not Allowed    | 405    | { "status": 405, "message": "Method Not Allowed" } |
| Conflict Exception    | 409    | { "status": 409, "message": Conflict Exception" }  |
| Internar Server Error | 500    | { "status": 500,"message": Internar Server Error"} |
`)
  }

  const insertPieChart = () => {
    setMarkdown(markdown + `
\`\`\`mermaid
pie title NETFLIX
  "Time spent looking for movie" : 90
  "Time spent watching it" : 10
\`\`\``)
  }

  const insertSeqChart = () => {
    setMarkdown(markdown + `
\`\`\`mermaid
sequenceDiagram
  Alice ->> Bob: Hello Bob, how are you?
  Bob-->>John: How about you John?
  Bob--x Alice: I am good thanks!
  Bob-x John: I am good thanks!
  Note right of John: Bob thinks a long<br/>long time, so long<br/>that the text does<br/>not fit on a row.

  Bob-->Alice: Checking with John...
  Alice->John: Yes... John, how are you?
\`\`\``)

  }

  const insertFlowChart = () => {
    setMarkdown(markdown + `
\`\`\`mermaid
graph LR
  A[Square Rect] -- Link text --> B((Circle))
  A --> C(Round Rect)
  B --> D{Rhombus}
  C --> D
\`\`\``)
  }

  const insertCommitChart = () => {
    setMarkdown(markdown + `
\`\`\`mermaid
gitGraph:
  commit "Ashish"
  branch newbranch
  checkout newbranch
  commit id:"1111"
  commit tag:"test"
  checkout main
  commit type: HIGHLIGHT
  commit
  merge newbranch
  commit
  branch b2
  commit
\`\`\``)
  }

  return <Flex className="frame" vertical={false} justify="space-between">
    <Flex className="editor" vertical={true}>
      <Space.Compact className="toolbar" direction='horizontal'>
        <Button onClick={insertCode}>Code</Button>
        <Button onClick={insertTable}>Table</Button>
        <Button onClick={insertPieChart}>Pie</Button>
        <Button onClick={insertSeqChart}>Sequence</Button>
        <Button onClick={insertFlowChart}>Flowchart</Button>
        <Button onClick={insertCommitChart}>Commit</Button>
      </Space.Compact>
      <TextArea
        className="textarea"
        ref={textRef}
        showCount
        maxLength={4098}
        onChange={onChange}
        placeholder="Markdown with mermaid.js support"
        value={markdown}
      />
    </Flex>
    <Flex className="view" vertical={true}>
      <Markdown
        className="markdown-body"
        children={markdown}
        remarkPlugins={[remarkGfm]}
        components={{
          code({children, className, node, ...rest}) {
            const match = /language-(\w+)/.exec(className || '')
            if (!match) return <>
              <code {...rest} className={className}>{children}</code>
              <Button className="btn-overlay" icon={<CopyOutlined/>} type="link" onClick={copyToClipboard} data-value={children}/>
            </>
            if (match[1] === 'mermaid'){
              return <>
                <div className="mermaid">{children}</div>
                <Button className="btn-overlay" icon={<DownloadOutlined />} type="link" onClick={downloadImage}/>
              </>
            }
            return <>
              <SyntaxHighlighter
                children={String(children).replace(/\n$/, '')}
                style={oneDark}
                language={match[1]}
                PreTag="div"
              />
              <Button className="btn-overlay" icon={<CopyOutlined />} type="link" onClick={copyToClipboard} data-value={children}/>
            </>
          }
        }}
      />
    </Flex>
  </Flex>
}

export default App
