import React, { useState, useEffect } from 'react'
import { ContentState, convertFromHTML, convertToRaw, EditorState } from "draft-js";
import draftToHtml from "draftjs-to-html";

function HtmlViewer({
    value
}) {

  //#region States
  const blocksFromHTML = convertFromHTML(value || "");
  const content = ContentState.createFromBlockArray(blocksFromHTML.contentBlocks, blocksFromHTML.entityMap);
  const [editorState, seteditorState] = useState(EditorState.createWithContent(content));
  const [__html, set__html] = useState(value || "");
  //#endregion

  //#region UseEffects
  useEffect(() => {
    try {
      set__html(draftToHtml(convertToRaw(editorState.getCurrentContent())));
    } catch {}
  }, [editorState]);
  //#endregion

  return (
    <>
        {
          __html.length > 8 && (
            <div dangerouslySetInnerHTML={{ __html }} />
          )
        }
    </>
  )
}

export default HtmlViewer