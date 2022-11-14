import { useEffect, useRef, useState } from "react";
import Cell from "./Cell";
import styles from '../styles/Home.module.css';
import slurpy from '../public/resources/slurpy.mp3';
import buzz from '../public/resources/buzz.mp3';
import clipper from '../public/resources/clipper.mp3';
import draw from '../public/resources/draw.mp3';
import shame from '../public/resources/draw.mp3';

import {useRouter} from 'next/router'

const TwoPlayer = ({curr, sound, starts, mode}) => {

    const [board, setBoard] = useState({});
    const [arrLen, setArrLen] = useState(0);
    const [modeVar, setModeVar] = useState({});
    const [playSounds, setPlaySounds] = useState(false);
    const [playerStarts, setPlayerStarts] = useState(0);
    const [currentPlayer, setCurrentPlayer] = useState(-99);
    const [currentPlayerValue, setCurrentPlayerValue] = useState("");
    const [winner, setWinner] = useState("");
    const [grid, setGrid] = useState("");

    const router = useRouter()

    const cellRef = useRef();

    useEffect(()=> {
        setBoard(curr);
        setPlaySounds(sound);
        setPlayerStarts(starts);
        setModeVar(mode);
    }, [curr, sound, starts, mode])

    useEffect(() => {
        if(playerStarts == 1) {
            setCurrentPlayer(0)
            setCurrentPlayerValue(true)
        }

        if(playerStarts == 2) {
            setCurrentPlayer(1)
            setCurrentPlayerValue(false)
        }
    }, [playerStarts])

    useEffect(() => {
        if (board !== null || board !== undefined) {
            setArrLen(Math.sqrt(Object?.keys(board || {}).length))
        }
    }, [board])

    useEffect(()=> {
        var temp = "1fr";

        for (let i = 1; i < arrLen; i++){
            temp += " 1fr"
        }

        setGrid(temp)

    }, [arrLen])

    const handlePlayCellSound = () => {
        if (playSounds) {
            var slurpy = document.getElementById("slurpy");
            slurpy?.play();
        }
    }

    const handlePlayBuzzSound = () => {
        if (playSounds) {
            var buzz = document.getElementById("buzz");
            buzz?.play();
        }
    }

    const handleGetWinner = () => {
        if (currentPlayer%2 == 0){
            return 2
        } else {
            return 1
        }
    }

    // const handlePlayWinSound = () => {
    //     if (playSounds) {
    //         var clipper = document.getElementById("clipper");
    //         clipper?.play();
    //     }
    // }

    const handlePlayTurnHuman = async (key, value) => {
        try {   

            if (value !== "—") {
                handlePlayBuzzSound();

            } else {

                if (currentPlayerValue) {
                    var human_value = "X";
                } else {
                    var human_value = "O";
                }

                const temp = {"pos":[`${parseInt(key[1])}`,`${parseInt(key[3])}`],"value": human_value}

                // console.log("kdjvvknnf", key, temp)

                const res = await fetch(`${process.env.API}/human-play`, 
                {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(temp),
                datatpe: "json"
                })
            
                const response = await res.json()
                setBoard(response['play_state'])
                setWinner(response['win'])
                setCurrentPlayer(currentPlayer + 1)
                handlePlayCellSound();
            }

        } catch (err) {
            console.log("ERR", err);
            handlePlayBuzzSound();
        }
    }

    const handlePlayTurnHuman2 = async (key, value) => {
        try {   

            if (value !== "—") {
                handlePlayBuzzSound();

            } else {

                if (currentPlayerValue) {
                    var human_value2 = "O";
                } else {
                    var human_value2 = "X";
                }

                const temp2 = {"pos":[`${parseInt(key[1])}`,`${parseInt(key[3])}`],"value": human_value2}

                // console.log("kdjvvknnf", key, temp)

                const res2 = await fetch(`${process.env.API}/human-play`, 
                {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(temp2),
                datatpe: "json"
                })
            
                const response2 = await res2.json()
                setBoard(response2['play_state'])
                setWinner(response2['win'])
                setCurrentPlayer(currentPlayer + 1)
                handlePlayCellSound();
            }

        } catch (err) {
            console.log("ERR", err);
            handlePlayBuzzSound();
        }
    }

    useEffect(() => {
        handleGame()
    }, [currentPlayer])

    const handleGame = async (key, value) => {
        if (currentPlayer % 2 == 0 && currentPlayer <= arrLen*arrLen && winner != true) {
            await handlePlayTurnHuman(key, value);
        }

        if (currentPlayer % 2 == 1 && currentPlayer <= arrLen*arrLen && winner != true){
            await sleep(10)
            await handlePlayTurnHuman2(key, value);
        }
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    const renderBoard = board && Object.entries(board).map(([key, value]) => (
        <div ref={cellRef} key={key} className={styles.cell}
            style={{
                textShadow: `1px 2px ${value == "X"  ? ("gray") : (value == "O" ? ("gray") : ("gray"))}`,
                color:`${value == "X"  ? ("black") : (value == "O" ? ("white") : ("black"))}`,
                backgroundColor:`${value == "X"  ? ("#F0FFF0") : (value == "O" ? ("#282C35") : ("lightgray"))}`,
            }}
            onClick={() => {handleGame(key, value)}}
        >
            <Cell pos={value}/>
        </div>
    ))

    const handleRematch = () => {
        router.reload();
    }

    const handleQuitGame = () => {
        if (confirm("Are you sure you want to quit?")) {
            router.push('https://google.com')
        }
    }

    // const getWidth = () => {
    //     if (arrLen == 3) {
    //         return "50%"
    //     } 
    // }

    return(
        <>
        {/* {currentPlayer} */}
            {winner == false && (
                <>
                    <div style={{ height:"5%", display:"flex", justifyContent:"center"}}>
                        {currentPlayer % 2 == 0 ? (<h2 style={{textShadow:`${modeVar['win-t-s']}`, color:`${modeVar['win-t']}`, padding:"0px", margin:"0px", marginLeft:"0px", marginTop:"15px"}}>Player 1 to Play</h2>) : (<h2 style={{textShadow:`${modeVar['win-t-s']}`, color:`${modeVar['win-t']}`, padding:"0px", margin:"0px", marginLeft:"0px", marginTop:"15px"}}>Player 2 to Play</h2>)}
                        {/* {currentPlayer} */}
                    </div>
                    <div 
                        className={styles.cell_grid}
                        style={{
                            display:"grid",
                            gridTemplateColumns: grid,
                            gridTemplateRows: grid,
                            // width: getWidth(),
                            gridGap: "3px",
                            margin:"auto",
                        }}
                    >
                        {renderBoard}
                        <audio id="slurpy">
                            <source src={slurpy} type="audio/mpeg"></source>
                        </audio>
                        <audio id="buzz">
                            <source src={buzz} type="audio/mpeg"></source>
                        </audio>
                        {/* {JSON.stringify(winner)} */}
                        {/* {JSON.stringify(board['curr'], null, 4)} */}
                    </div>
                </>
            )}
            { winner == "Draw" && (
                    <>
                        <audio id="draw" autoPlay>
                            <source src={draw} type="audio/mpeg"></source>
                        </audio>
                        <div style={{margin:"auto", width:"300px", height:"70%", boxShadow:"1px 1px 10px lightgray", textAlign:"center", background:"white"}}>
                            <div style={{height:"15%"}}></div>
                            <h1 style={{textShadow:`${modeVar['mdl-t-s']}`, color:`${modeVar['mdl-t']}`, fontSize:"40px"}}>It's a draw!</h1>
                            <br/>
                            <button style={{background:`${modeVar['btn-bg']}`, fontWeight:`${modeVar['btn-f-w']}`, border:`${modeVar['btn-b']}`, borderRadius:`${modeVar['btn-b-r']}`, color:`${modeVar['btn-t']}`, textShadow:`${modeVar['btn-t-s']}`, fontFamily:"Roboto", fontSize:"16px", padding:"7px", width:"55%", cursor:"pointer"}} onClick={handleRematch}>Rematch</button>
                            <br/><br/>
                            <button style={{background:`${modeVar['btn-bg']}`, fontWeight:`${modeVar['btn-f-w']}`, border:`${modeVar['btn-b']}`, borderRadius:`${modeVar['btn-b-r']}`, color:`${modeVar['btn-t']}`, textShadow:`${modeVar['btn-t-s']}`, fontFamily:"Roboto", fontSize:"16px", padding:"7px", width:"55%", cursor:"pointer"}} onClick={handleQuitGame}>Quit</button>
                        </div>
                    </>
                )}
                { winner == true && (
                    <>
                        {currentPlayer % 2 == 1 ? (
                            <>
                                <audio id="clipper" autoPlay>
                                    <source src={clipper} type="audio/mpeg"></source>
                                </audio>
                            </>
                        ):(
                            <>
                                <audio id="shame" autoPlay>
                                    <source src={shame} type="audio/mpeg"></source>
                                </audio>
                            </>
                        )}

                        <div style={{margin:"auto", width:"300px", height:"70%", boxShadow:"1px 1px 10px lightgray", textAlign:"center", background:`${modeVar['modal']}`}}>
                            <div style={{height:"15%"}}></div>
                            <h1 style={{textShadow:`${mode['mdl-t-s']}`, color:`${mode['mdl-t']}`, fontSize:"40px"}}>Player {handleGetWinner()} Wins!</h1>
                            <br/>
                            <button style={{background:`${modeVar['btn-bg']}`, fontWeight:`${modeVar['btn-f-w']}`, border:`${modeVar['btn-b']}`, borderRadius:`${modeVar['btn-b-r']}`, color:`${modeVar['btn-t']}`, textShadow:`${modeVar['btn-t-s']}`, fontFamily:"Roboto", fontSize:"16px", padding:"7px", width:"55%", cursor:"pointer"}} onClick={handleRematch}>Rematch</button>
                            <br/><br/>
                            <button style={{background:`${modeVar['btn-bg']}`, fontWeight:`${modeVar['btn-f-w']}`, border:`${modeVar['btn-b']}`, borderRadius:`${modeVar['btn-b-r']}`, color:`${modeVar['btn-t']}`, textShadow:`${modeVar['btn-t-s']}`, fontFamily:"Roboto", fontSize:"16px", padding:"7px", width:"55%", cursor:"pointer"}} onClick={handleQuitGame}>Quit</button>
                        </div>
                    </>
                )
        }
    </>
    )
} 

export default TwoPlayer;