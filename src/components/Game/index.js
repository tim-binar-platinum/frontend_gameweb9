import React, { useState } from "react";
import { Title } from "./Title";
import { Round } from "./Round";
import { Playground } from "./Playground";
import { Profile } from "./Profile";
import { User } from "./User";
import { Choice } from "./Choice";
import { Computer } from "./Computer";
import { Score } from "./Score";
import { Message } from "./Message";
import { Reset } from "./Reset";
import { settings } from "./configs/game";
import rock from "../Game/assets/image/batu.png";
import paper from "../Game/assets/image/kertas.png";
import scissors from "../Game/assets/image/gunting.png";
import "../Game/assets/css/styles.css";
import axios from "axios";

export default function GameDetailPages() {
  let [game, setGame] = useState({
    userSelection: "",
    botSelection: "",
    round: 0,
    userScore: 0,
    botScore: 0,
    message: "",
  });

  const reset = () => {
    setGame({
      ...game,
      userSelection: "",
      botSelection: "",
      round: 0,
      userScore: 0,
      botScore: 0,
      message: "",
    });
  };

  const { winMessage, tieMessage, lostMessage, winTarget } = settings;
  const { botScore, userScore } = game;
  const token = sessionStorage.getItem("accessToken")
  console.log(token);
  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };
  const play = async (e) => {
    if (botScore < winTarget) {
      const userSelection = e.target.parentNode.getAttribute("value");
      const botSelection = ["Rock", "Paper", "Scissors"][
        Math.floor(Math.random() * 3)
      ];

      userSelection === botSelection
        ? setGame({
            ...(game.message = tieMessage),
            ...(await axios.post( 
              'http://103.181.143.76:4000/game',
              {status: 'tie'},
              config
            )),
          })
        : (userSelection === "Rock" && botSelection === "Scissors") ||
          (userSelection === "Paper" && botSelection === "Rock") ||
          (userSelection === "Scissors" && botSelection === "Paper")
        ? setGame({
            ...(game.userScore += 1),
            ...(game.message = winMessage),
            ...(await axios.post( 
              'https://api.thelasofgame.xyz/game',
              {status: 'win'},
              config
            )),
          })
        : setGame({
            ...(game.botScore += 1),
            ...(game.message = lostMessage),
            ...(await axios.post( 
              'https://api.thelastofgame.xyz/game',
              {status: 'lose'},
              config
            )),
          });

      setGame({
        ...game,
        round: (game.round += 1),
        userSelection,
        botSelection,
      });
    }
  };

  return (
    <div id="suit" className="GameDetailPages">
      <Title />
      <Round {...game} />
      <Playground>
        <Profile>
          <User {...game}>
            <Choice {...game} value="Rock" onClick={play} choiceIcon={rock} />
            <Choice {...game} value="Paper" onClick={play} choiceIcon={paper} />
            <Choice
              {...game}
              value="Scissors"
              onClick={play}
              choiceIcon={scissors}
            />
          </User>
          <Score score={userScore} />
        </Profile>
        <Message {...game} />
        <Profile>
          <Computer
            {...game}
            rockIcon={rock}
            paperIcon={paper}
            scissorsIcon={scissors}
          />
          <Score score={botScore} />
        </Profile>
      </Playground>
      <Reset {...game} onClick={reset} />
    </div>
  );
}
