import React from 'react'
import { useState, useRef, useMemo, useEffect } from 'react'
import Item from './Item'
import { throttle } from './util'

export default function VirtualList(props) {
  let {containerHeight,nums,itemHeight} = props
  const [scrollTop, setScrollTop] = useState(0)
  const [rowHeight,setRowHeight] = useState(60)
  const [positionList,setPositionList] = useState(() => {
    return nums.map(() => {return {height:0,top:0}})
  })

  let containerRef = useRef()
  let listRef = useRef()
  let total = Math.ceil(containerHeight / itemHeight)

  //判断起始位置
  let startIndex = useMemo(() => {
    let index = 0
    for(let i = 0;i<positionList.length;i++){
      if(scrollTop <= positionList[i].top){
        index = i
        break
      }
    }
    return index
  },[positionList, scrollTop])

  const limit = useMemo(() => {
    return 13
  },[containerHeight, positionList, startIndex])

  //判断终点位置
  let endIndex = useMemo(() => {
    return startIndex + limit
  },[limit, startIndex])

  //渲染的item列表
  let RenderItems = () => {
    if(startIndex - 1 >= 0){
      startIndex = startIndex - 1
    }
    let renderList = nums.slice(startIndex,endIndex).map((item) => {
      let style = {
        position: 'absolute',
        top: positionList[item.id].top === 0 ? item.id * rowHeight : positionList[item.id].top,
        width:'100%',
        backgroundColor: 'white',
        borderTop: '2px solid red',
      }
      return {style,content: item.content,id:item.id}
    })
    return renderList.map((item) => {
      return (
        <Item
          style={item.style}
          key={item.id}
          id={item.id}
          content={item.content}
        ></Item>
      )
    })
  }

  useEffect(() => {
    containerRef.current.addEventListener('scroll',throttle((e) => {
      setScrollTop(e.target.scrollTop)
    },50))
  },[])

  useEffect(() => {
    let childNodes = listRef.current.childNodes
    childNodes.forEach((item) => {
      let curIndex = Number(item.getAttribute('id'))
      let curHeight = item.getBoundingClientRect().height
      if(curIndex === 0){
        positionList[curIndex].height = curHeight
        positionList[curIndex].top = 0
      }
       else {
        positionList[curIndex].height = curHeight
        positionList[curIndex].top = positionList[curIndex - 1].top + positionList[curIndex - 1].height
      }
      setPositionList([...positionList])
    })
  },[startIndex])

  return (
    <div style={{width: '500px', height: containerHeight, overflow:'auto', background:'pink'}} ref = {containerRef}>
      <div style={{position:'relative'}} ref = {listRef}>
        {RenderItems()}
      </div>
    </div>
  );
}
