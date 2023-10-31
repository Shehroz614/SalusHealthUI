import exercise from "../assets/images/cat/exercise.png";
import nutrition from "../assets/images/cat/nutrition.png";
import therapy from "../assets/images/cat/therapy.png";
import mental from "../assets/images/cat/mental wellness.jpg";
import cardio from "../assets/images/cat/cardio.jpg";
import yoga from "../assets/images/cat/yoga.png";

export default function getImageUrl(word) {
    console.log("the word: ", word)
  let imageUrl = "";
  switch (word?.toLowerCase()) {
    case "exercise":
      imageUrl = exercise;
      break;
    case "nutrition":
      imageUrl = nutrition;
      break;
    case "therapy":
      imageUrl = therapy;
      break;
    case "mental":
      imageUrl = mental;
      break;
    case "cardio":
      imageUrl = cardio;
      break;
    case "yoga":
      imageUrl = yoga;
      break;
    default:
      imageUrl = "https://picsum.photos/300/300";
  }
  return imageUrl;
}


