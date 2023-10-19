import { useState, useEffect, useRef, ChangeEvent } from 'react'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import mermaid from 'mermaid'
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter'
import {dark} from 'react-syntax-highlighter/dist/esm/styles/prism'
import { Flex, Input } from 'antd'
import './App.css'

mermaid.initialize({
  startOnLoad: false
})
const { TextArea } = Input

const test = `
\`\`\`mermaid
graph LR;
A-->B;
B-->C;
B-->D[plop lanflz eknlzeknfz];
\`\`\`
      `

function App() {
  const [markdown, setMarkdown] = useState<string>(test)
  const [chart, setChart] = useState<string>('')
  const mdRef = useRef<HTMLDivElement | null>(null)

  const rerender = async (md: string, ele: HTMLDivElement | null) => {
    if (!ele || ele.dataset.wip) return
    ele.dataset.wip = "1"
    try {
      const {svg} = await mermaid.mermaidAPI.render('id0', md, ele)
      ele.innerHTML = svg
    } catch (ex) {
      console.error(ex)
    }
    ele.dataset.wip = ""
  }

  useEffect(() => {
    if (!mdRef.current) return
    rerender(chart,  mdRef.current)
  }, [chart, mdRef.current])

  const onChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    e.preventDefault()
    setMarkdown(e.target.value)
  }
  return <Flex vertical={false} className="frame">
      <TextArea
        showCount
        maxLength={4098}
        onChange={onChange}
        placeholder="Markdown with mermaid.js support"
        defaultValue={test}
      />
      <Flex vertical={true}>
        <Markdown
          children={markdown}
          remarkPlugins={[remarkGfm]}
          components={{
            code({children, className, node, ...rest}) {
              const match = /language-(\w+)/.exec(className || '')
              if (!match) return  <code {...rest} className={className}>{children}</code>
              if (match[1] === 'mermaid'){
                setChart(children?.toString() ?? '')
                return <div ref={mdRef} />
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
