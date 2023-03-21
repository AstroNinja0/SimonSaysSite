const colors = ["red", "blue", "green", "yellow"];

let completePattern = [];
let canClick = false;
let level = 0
let isPlaying = false

function nextInSequence() {
    let randomColor = Math.floor(Math.random() * 3) + 1
    let chosenColor = colors[randomColor-1]

    completePattern.push(chosenColor)
}

function pressButton(color) {
    // jQuery picks the ID that matches the color & animates button
    $("#"+color).fadeOut(80).fadeIn(80)

    // Play the sound with the color name
    new Audio("sounds/"+color+".mp3").play();

    $("#"+color).addClass("pressed");
    setTimeout(function() {
        $("#"+color).removeClass("pressed")
    }, 200);
}

function playPattern() {
    nextInSequence();
    for (let i = 0; i<completePattern.length; i++)
    {
        
        setTimeout (function () {
            let color = completePattern[i];
            pressButton(color);
        }, 500 * i);
    }
    
    $("#level-title").text("Level "+level+"!");
    
    setTimeout(function() {
        canClick = true;
        level++;
    }, completePattern.length*500)
}

function gameOver() {
    new Audio("sounds/wrong.mp3").play();
    
    iter_simon = 0;
    completePattern = [];
    level = 0;
    $("#level-title").text("Game Over! Press a to play again!");

    $("body").addClass("game-over");
    setTimeout(function() {
        $("body").removeClass("game-over");
    }, 1000);
    
    canClick=false
    isPlaying=false
}

let iter_simon = 0

$(".btn").click(function() {
    let clickedColor = this.id
    console.log("Picked "+clickedColor)
    // let clickedPattern.push(clickedColor)
    
    // Use iterative variable to parse the completePattern
    
    // If clickedColor matches the color at the iterators index, press the button
    if (canClick)
    {
        if (iter_simon < completePattern.length)
        {
            if (clickedColor === completePattern[iter_simon])
            {
                pressButton(clickedColor);
                iter_simon++;
            }
            else
            {
                // Else, the player loses
                gameOver();
            }
        }
    
        if (iter_simon === completePattern.length && isPlaying===true)
        {
            setTimeout(function() {
                iter_simon = 0;
                canClick = false
                playPattern();
            }, 500);
        }
        console.log(isPlaying)
    }
})

document.addEventListener("keydown", function(e) {
    if (e.key == "a" && !(isPlaying) )
    {
        canClick = false;
        iter_simon = 0
        isPlaying = true
        level++
        $(".level-title").text("Level ")
        playPattern();
    }
})

function get_score() {
    fetch("stuff.json", {mode: 'cors'})
    .then(res => res.json())
    .then(data => {
        if (level >= data.high_score)
            data.high_score = level
        $(".high-score").text("High score: "+data.high_score)
    })
    .catch((error) => {
        console.error(error);
    })
}
//get_score();
