import React, { useEffect, useState } from "react";
import Confetti from "react-confetti";
import "./assets/prompt.css";

const Prompt = ({data, counter}) => {
    const [promptContent, setPromptContent] = useState("");
    const [showConfetti, setShowConfetti] = useState(false);
    const [cashierPrompt, setCashierPrompt] = useState(false);
    console.log(data, counter);

    const promptBank = {
        counter_one: "Yay! You found 1 out of the 3 items on Grandma's list! You still have more items to go.",
        counter_two: "Way to go! You now have 2 out of the 3 items on Grandma's list. One more to go!",
        counter_three: "Congratulations! You found all of the items on Grandma's gorcery list. Please press '5' on the keypad to let the next grocery shopper in.",
    }

    useEffect(() => {
        if (counter === 1) {
            setPromptContent(promptBank.counter_one);
        } else if (counter === 2 ) {
            setPromptContent(promptBank.counter_two);
        } else if (counter >= 3) {
            setPromptContent(promptBank.counter_three);
            setShowConfetti(true);
            document.onkeydown = (e) => {
                if (e.key === "5") {
                    window.location.reload();
                    return;
                } else {
                    window.location.reload();
                }
            }
        }

        if (data === "CASHIER") {
            setCashierPrompt(true);
        } else if (data !== "CASHIER" || counter === 3) {
            setCashierPrompt(false);
        }
    }, [promptContent]);

    return (
        <>
            {showConfetti === true ? <Confetti width={window.innerWidth} height={window.innerHeight} /> : null}
            <div id="prompt-container">
                <div id="prompt-details-container">
                    <div id="line" />
                </div>
                <p>
                    {promptContent}
                </p>
                {cashierPrompt === true ? 
                    <p>
                       Mr. Bradshaw says:
                       <br/>
                       “Good Evening, Miss Sivakamy told me she sent you to pick up some items for her. Your shopping list is:
                       <br/>
                       <br/>
                       1 Tin of Milo
                       <br/>
                       1 Bag of Rice
                       <br/>
                       1 Package of Horlicks
                       <br/>
                       <br />
                       Use 8,4,6,2 to navigate through the store and find each item.” 
                    </p>

                    : null
                }
            </div>
        </>
    )
}

export default Prompt;