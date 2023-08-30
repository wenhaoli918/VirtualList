import React from 'react'

export default function Item(props) {
  let {style,key,id,content} = props
  return (
    <div style={style} id={id} key={key}>{content}</div>
  )
}
