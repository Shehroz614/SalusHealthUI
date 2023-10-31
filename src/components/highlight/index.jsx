import Highlighter from "react-highlight-words";

const HighlightComponent = ({ keyword = "", value = "" }) => {
  
  return (
    <Highlighter
      highlightClassName="YourHighlightClass"
      searchWords={
        !!keyword && typeof keyword === "string" ? keyword.split(" ") : []
      }
      autoEscape={true}
      textToHighlight={value}
    />
  );
};

export default HighlightComponent;
