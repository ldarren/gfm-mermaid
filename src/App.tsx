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
  const width = svgElement.width.baseVal.value
  const height = svgElement.height.baseVal.value

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height

  const context = canvas.getContext('2d')
  if (!context) return

  // Create a new Image object and load SVG as data URL
  const image = new Image()
  const svgData = new XMLSerializer().serializeToString(svgElement)
  const svgUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgData)}`

  image.onload = () => {
    // Draw the loaded SVG image onto the canvas
    context.clearRect(0, 0, width, height)
    context.drawImage(image, 0, 0, width, height)

    // Convert canvas to PNG data URL
    const pngDataUrl = canvas.toDataURL('image/png')

    // Invoke the callback function with the PNG data URL
    const link = document.createElement('a')
    link.href = pngDataUrl
    link.download = `talkgpteal_chart_${svgElement.id}.png`
    document.body.appendChild(link)
    link.click();
    document.body.removeChild(link)
  };

  image.src = svgUrl
}

const downloadImage: MouseEventHandler<HTMLElement> = (evt) => {
  const parent = evt.currentTarget.parentElement
  if (!parent) return
  const svgElement = parent.querySelector('svg'); // Replace with your SVG's ID or selector
  if (!svgElement) return
  convertSvgToPng(svgElement); // Provide a desired filename
}

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

function App() {
  const [markdown, setMarkdown] = useState<string>('# type something')
  const textRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const mermaids = document.querySelectorAll('.mermaid')
    rerender(mermaids)
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

  const insertClassChart = () => {
    setMarkdown(markdown + `
\`\`\`mermaid
---
title: Animal example
---
classDiagram
    note "From Duck till Zebra"
    Animal <|-- Duck
    note for Duck "can fly\ncan swim\ncan dive\ncan help in debugging"
    Animal <|-- Fish
    Animal <|-- Zebra
    Animal : +int age
    Animal : +String gender
    Animal: +isMammal()
    Animal: +mate()
    class Duck{
        +String beakColor
        +swim()
        +quack()
    }
    class Fish{
        -int sizeInFeet
        -canEat()
    }
    class Zebra{
        +bool is_wild
        +run()
    }
\`\`\``)
  }

  const insertStateChart = () => {
    setMarkdown(markdown + `
\`\`\`mermaid
---
title: Simple sample
---
stateDiagram-v2
    [*] --> Still
    Still --> [*]

    Still --> Moving
    Moving --> Still
    Moving --> Crash
    Crash --> [*]
\`\`\``)
  }

  const insertERChart = () => {
    setMarkdown(markdown + `
\`\`\`mermaid
---
title: Order example
---
erDiagram
    CUSTOMER ||--o{ ORDER : places
    ORDER ||--|{ LINE-ITEM : contains
    CUSTOMER }|..|{ DELIVERY-ADDRESS : uses
\`\`\``)
  }

  const insertUJChart = () => {
    setMarkdown(markdown + `
\`\`\`mermaid
journey
    title My working day
    section Go to work
      Make tea: 5: Me
      Go upstairs: 3: Me
      Do work: 1: Me, Cat
    section Go home
      Go downstairs: 5: Me
      Sit down: 5: Me
\`\`\``)
  }

  const insertGanttChart = () => {
    setMarkdown(markdown + `
\`\`\`mermaid
gantt
    title A Gantt Diagram
    dateFormat YYYY-MM-DD
    section Section
        A task          :a1, 2014-01-01, 30d
        Another task    :after a1, 20d
    section Another
        Task in Another :2014-01-12, 12d
        another task    :24d
\`\`\``)
  }

  const insertPieChart = () => {
    setMarkdown(markdown + `
\`\`\`mermaid
pie title NETFLIX
  "Time spent looking for movie" : 90
  "Time spent watching it" : 10
\`\`\``)
  }

  const insertQChart = () => {
    setMarkdown(markdown + `
\`\`\`mermaid
quadrantChart
    title Reach and engagement of campaigns
    x-axis Low Reach --> High Reach
    y-axis Low Engagement --> High Engagement
    quadrant-1 We should expand
    quadrant-2 Need to promote
    quadrant-3 Re-evaluate
    quadrant-4 May be improved
    Campaign A: [0.3, 0.6]
    Campaign B: [0.45, 0.23]
    Campaign C: [0.57, 0.69]
    Campaign D: [0.78, 0.34]
    Campaign E: [0.40, 0.34]
    Campaign F: [0.35, 0.78]
\`\`\``)
  }

  const insertRChart = () => {
    setMarkdown(markdown + `
\`\`\`mermaid
requirementDiagram

requirement test_req {
id: 1
text: the test text.
risk: high
verifymethod: test
}

element test_entity {
type: simulation
}

test_entity - satisfies -> test_req
\`\`\``)
  }

  const insertGitChart = () => {
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

  const insertC4Chart = () => {
    setMarkdown(markdown + `
\`\`\`mermaid
C4Context
title System Context diagram for Internet Banking System
Enterprise_Boundary(b0, "BankBoundary0") {
  Person(customerA, "Banking Customer A", "A customer of the bank, with personal bank accounts.")
  Person(customerB, "Banking Customer B")
  Person_Ext(customerC, "Banking Customer C", "desc")

  Person(customerD, "Banking Customer D", "A customer of the bank, <br/> with personal bank accounts.")

  System(SystemAA, "Internet Banking System", "Allows customers to view information about their bank accounts, and make payments.")

  Enterprise_Boundary(b1, "BankBoundary") {

    SystemDb_Ext(SystemE, "Mainframe Banking System", "Stores all of the core banking information about customers, accounts, transactions, etc.")

    System_Boundary(b2, "BankBoundary2") {
      System(SystemA, "Banking System A")
      System(SystemB, "Banking System B", "A system of the bank, with personal bank accounts. next line.")
    }

    System_Ext(SystemC, "E-mail system", "The internal Microsoft Exchange e-mail system.")
    SystemDb(SystemD, "Banking System D Database", "A system of the bank, with personal bank accounts.")

    Boundary(b3, "BankBoundary3", "boundary") {
      SystemQueue(SystemF, "Banking System F Queue", "A system of the bank.")
      SystemQueue_Ext(SystemG, "Banking System G Queue", "A system of the bank, with personal bank accounts.")
    }
  }
}

BiRel(customerA, SystemAA, "Uses")
BiRel(SystemAA, SystemE, "Uses")
Rel(SystemAA, SystemC, "Sends e-mails", "SMTP")
Rel(SystemC, customerA, "Sends e-mails to")

UpdateElementStyle(customerA, $fontColor="red", $bgColor="grey", $borderColor="red")
UpdateRelStyle(customerA, SystemAA, $textColor="blue", $lineColor="blue", $offsetX="5")
UpdateRelStyle(SystemAA, SystemE, $textColor="blue", $lineColor="blue", $offsetY="-10")
UpdateRelStyle(SystemAA, SystemC, $textColor="blue", $lineColor="blue", $offsetY="-40", $offsetX="-50")
UpdateRelStyle(SystemC, customerA, $textColor="red", $lineColor="red", $offsetX="-50", $offsetY="20")

UpdateLayoutConfig($c4ShapeInRow="3", $c4BoundaryInRow="1")
\`\`\``)
  }

  const insertMMChart = () => {
    setMarkdown(markdown + `
\`\`\`mermaid
mindmap
  root((mindmap))
    Origins
      Long history
      ::icon(fa fa-book)
      Popularisation
        British popular psychology author Tony Buzan
    Research
      On effectiveness<br/>and features
      On Automatic creation
        Uses
            Creative techniques
            Strategic planning
            Argument mapping
    Tools
      Pen and paper
      Mermaid
\`\`\``)
  }

  const insertTChart = () => {
    setMarkdown(markdown + `
\`\`\`mermaid
timeline
    title History of Social Media Platform
    2002 : LinkedIn
    2004 : Facebook
         : Google
    2005 : Youtube
    2006 : Twitter
\`\`\``)
  }

  const insertSanChart = () => {
    setMarkdown(markdown + `
\`\`\`mermaid
sankey-beta

%% source,target,value
Electricity grid,Over generation / exports,104.453
Electricity grid,Heating and cooling - homes,113.726
Electricity grid,H2 conversion,27.14
\`\`\``)
  }

  return <Flex className="frame" vertical={false} justify="space-between">
    <Flex className="editor" vertical={true}>
      <Space.Compact className="toolbar" direction='horizontal'>
        <Button onClick={insertCode}>Code</Button>
        <Button onClick={insertTable}>Table</Button>
        <Button onClick={insertFlowChart}>Flow</Button>
        <Button onClick={insertSeqChart}>Sequence</Button>
        <Button onClick={insertClassChart}>Class</Button>
        <Button onClick={insertStateChart}>State</Button>
        <Button onClick={insertERChart}>ER</Button>
        <Button onClick={insertUJChart}>Journey</Button>
        <Button onClick={insertGanttChart}>Gantt</Button>
        <Button onClick={insertPieChart}>Pie</Button>
        <Button onClick={insertQChart}>Quadrant</Button>
        <Button onClick={insertRChart}>Requirement</Button>
        <Button onClick={insertGitChart}>Git</Button>
        <Button onClick={insertC4Chart}>C4</Button>
        <Button onClick={insertMMChart}>Mindmaps</Button>
        <Button onClick={insertTChart}>Timeline</Button>
        <Button onClick={insertSanChart}>Sankey</Button>
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
          code({className, children, node, ...rest}) {
            if (node?.position?.start?.line === node?.position?.end?.line) return <code {...rest} className={className}>{children}</code>
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
