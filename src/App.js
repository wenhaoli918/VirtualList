import logo from './logo.svg';
import './App.css';
import ReactDOM from 'react-dom';
import VirtualList from './virtualList';
import Mock from 'mockjs'

//手写状态setState（原理是闭包）,注意要写在App外面，这样每次render不会重新加载
let values = []
let currentIndex = 0
const useState = (initialValue) => {
  if(typeof values[currentIndex] === 'undefined'){values[currentIndex] = initialValue}
  let hookIndex = currentIndex
  function setState (newValue){
    values[hookIndex] = newValue
    ReactDOM.render(<App/>,document.getElementById('root'))
  }
  let state = values[hookIndex]
  currentIndex ++
  return [state,setState]
}

//虚拟列表原始数据
let arr = [] 
    for(let i = 0; i < 100; i++){
      arr.push({
        id: i,
        content: Mock.mock('@csentence(40, 100)')
      })
    }

function App() {
  currentIndex = 0
  const [name,setName] = useState('')
  const [age,setAge] = useState('')
  return (
    <div className="App">
      <h1>姓名: {name}</h1>
      <input onChange={(e) => {setName(e.target.value)}} />
      <h1>年龄: {age}</h1>
      <input onChange={(e) => {setAge(e.target.value)}} />
      <div style={{height:50}}></div>
      <VirtualList nums={arr} containerHeight={700} itemHeight={60}></VirtualList>
    </div>
  );
}

export default App;
