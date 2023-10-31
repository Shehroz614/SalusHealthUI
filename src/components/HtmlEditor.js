import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { ContentState, convertFromHTML, convertToRaw, EditorState } from "draft-js";
import draftToHtml from "draftjs-to-html";
import React, { useEffect, useState } from "react";
import { Editor } from "react-draft-wysiwyg";
import { Eye, EyeOff } from "react-feather";

const CustomOption = ({ showPreview, setShowPreview }) => {
  return (
    <>
      {
        showPreview ?
        <>
        <Eye
            onClick={() => setShowPreview(!showPreview)}
            size={18}
            id="eye"
        />
        </>
        :
        <>
        <EyeOff
            onClick={() => setShowPreview(!showPreview)}
            size={18}
            id="eye"
        />
        </>
      }
    </>
  );
};

const HtmlEditorAssembleWysiwyg = ({ onChange, style, maxLength, initialValue, placeholder, onBlur, defaultValue }) => {

  //#region States
  const [showPreview, setShowPreview] = useState(false);
  const blocksFromHTML = convertFromHTML(initialValue);
  const content = ContentState.createFromBlockArray(blocksFromHTML.contentBlocks, blocksFromHTML.entityMap);
  const [editorState, seteditorState] = useState(EditorState.createWithContent(content));
  const [__html, set__html] = useState(initialValue);
  //#endregion

  //#region UseEffects
  useEffect(() => {
    try {
      set__html(draftToHtml(convertToRaw(editorState.getCurrentContent())));
    } catch {}
  }, [editorState]);

  useEffect(() => {
    if(!defaultValue) return;
    const blocksFromHTML = convertFromHTML(defaultValue);
    const content = ContentState.createFromBlockArray(blocksFromHTML.contentBlocks, blocksFromHTML.entityMap);
    seteditorState(EditorState.createWithContent(content));
  }, [defaultValue]);
  //#endregion

  return (
    <React.Fragment>
      <Editor
        placeholder={placeholder}
        editorState={editorState}
        wrapperClassName="AssembleWysiwyg-wrapper"
        editorClassName="AssembleWysiwyg-editor"
        onEditorStateChange={state => {
          const _ = draftToHtml(convertToRaw(state.getCurrentContent()));
          seteditorState(state);
          onChange(_);
        }}
        editorStyle={{ border: "1px solid #1e25b6", minHeight: "200px", maxHeight: "200px" }}
        max
        toolbarCustomButtons={[<CustomOption showPreview={showPreview} setShowPreview={setShowPreview} />]}
        onBlur={onBlur}
      />
      {showPreview && __html.length > 8 && (
        <div className="row">
          <h1>Preview</h1>
          <div className="preview-container" dangerouslySetInnerHTML={{ __html }} />
        </div>
      )}
    </React.Fragment>
  );
};

export default HtmlEditorAssembleWysiwyg;
