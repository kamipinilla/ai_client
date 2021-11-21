import { ReactP5Wrapper } from "react-p5-wrapper";
import sketch from './p5/sketch'

const App: React.FC = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="flex-col space-y-3">
        <ReactP5Wrapper sketch={sketch} />
      </div>
    </div>
  )
}

export default App