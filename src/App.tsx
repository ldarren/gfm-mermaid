import { useState, useEffect, ChangeEvent, useRef } from 'react'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import mermaid from 'mermaid'
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter'
import {dark} from 'react-syntax-highlighter/dist/esm/styles/prism'
import { Button, Flex, Input, Space } from 'antd'
import './github-markdown.css'
import './App.css'

mermaid.initialize({
  startOnLoad: false
})
const { TextArea } = Input

function App() {
  const [markdown, setMarkdown] = useState<string>('# type something')
  const textRef = useRef<HTMLTextAreaElement>(null)

  const rerender = async (text: string, ele: Element | null) => {
    if (!ele) return
    const step = ele.getAttribute('data-step')
    if (step) return
    ele.setAttribute('data-step', '1')
    try {
      const id = 'buf' + Math.random().toString(36).slice(2)
      const {svg} = await mermaid.mermaidAPI.render(id, text, ele)
      ele.innerHTML = svg
    } catch (ex) {
      console.error(ex)
    }
    ele.setAttribute('data-step', '2')
  }

  useEffect(() => {
    const mermaids = document.querySelectorAll('.mermaid')
    for (const ele of mermaids) {
     rerender(ele.textContent ?? '', ele)
    }
  }, [markdown])

  const onChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    e.preventDefault()
    setMarkdown(e.target.value)
  }

  const insertCode = () => {
    setMarkdown(markdown + `
\`\`\`js
    const a = 1
\`\`\``)
  }

  const insertTable = () => {
    setMarkdown(markdown + `
| foo | bar |
| - | - |
| baz | bim |
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
            if (!match) return  <code {...rest} className={className}>{children}</code>
            if (match[1] === 'mermaid'){
              return <div className="mermaid">{children}</div>
            }
            return <SyntaxHighlighter
              {...rest}
              children={String(children).replace(/\n$/, '')}
              style={dark}
              language={match[1]}
              PreTag="div"
            />
          }
        }}
      />
    </Flex>
  </Flex>
}

export default App
