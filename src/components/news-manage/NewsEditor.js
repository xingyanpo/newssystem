import React, { useEffect, useState } from 'react'
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';

export default function NewsEditor(props) {
  useEffect(()=>{
    const html = props.content;
    if(html === undefined) return
    const contentBlock = htmlToDraft(html);
    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
      const editorState = EditorState.createWithContent(contentState);
      setEditorState (editorState)
    }
  }, [props.content])
  const [editorState,setEditorState] = useState('')
  return (
    <div>
      <Editor
        editorState={editorState}
        toolbarClassName="toolbarClassName"
        wrapperClassName="wrapperClassName"
        editorClassName="editorClassName"
        onEditorStateChange={(editorState)=> setEditorState(editorState)}
        onBlur={()=> {
          const value = draftToHtml(convertToRaw(editorState.getCurrentContent()))
          props.getContent(value)
        }}
      />
    </div>
  )
}
