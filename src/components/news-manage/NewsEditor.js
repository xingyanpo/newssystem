import React, { useState } from 'react'
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { EditorState, convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';

export default function NewsEditor(porps) {
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
          porps.getContent(value)
        }}
      />
    </div>
  )
}
