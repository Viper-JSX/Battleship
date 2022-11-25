//_____________firstPlayer is the player (main player)________________//

let mainMenu = document.getElementById("mainMenu");
let selectGameModeMenu = document.getElementById("selectGameModeMenu");
let playButton = document.getElementById("playButton");
let selectGameMode = document.getElementById("selectGameMode");
let playerVsComputer = selectGameModeMenu.querySelector("#playerVsComputer");
let playerVsPlayer = selectGameModeMenu.querySelector("#playerVsPlayer");

let gameFields = document.getElementById("gameFields");
let firstPlayerField = document.getElementById("firstPlayerField");
let secondPlayerField = document.getElementById("secondPlayerField");
let currentlyAttackedPlayerField = secondPlayerField;
let firstPlayerCells = firstPlayerField.querySelectorAll("div.cell");
let secondPlayerCells = secondPlayerField.querySelectorAll("div.cell");
let startGameButton = document.getElementById("startGameButton");
let endTheGameButton = document.getElementById("endTheGameButton");
let shipsToPlace = document.getElementById("shipsContainer").querySelectorAll(".ship");

let firstPlayerMoney = 1000;
let secondPlayerMoney = 0;
let playerEXPoints = 0;
let gamesWon = 0;
let playerLevel = 1;
let totalShipsDestroyed = 0;
let totalWeaponUsed = 0;
let totalMoneyEarned = 0;
let totalMoneySpent = 0;
let achievementsNamesAndCurrentValues;

let playerAchievementsWindow = document.getElementById("playerAchievements");
let playerAchievements = playerAchievementsWindow.querySelectorAll(".achievement");
let newAchievementNotification = gameFields.querySelector("#newAchievementNotification");
let achievementViewer = document.getElementById("achievementViewer");
let closeAchievementViewer = achievementViewer.querySelector("#closeAchievementViewer");
let achievementCompletionIndicator = achievementViewer.querySelector(".achievementCompletionIndicator");
let achievementCompletionIndicatorFill = achievementViewer.querySelector(".achievementCompletionIndicatorFill");
let achievementCompletionIndicatorText = achievementViewer.querySelector(".achievementCompletionIndicatorText");

let shipsToPlaceCopy = [...shipsToPlace];
let currentlySelectedShip;
let placingPoint;

let hoverAffectedCells = [];
let gameDialog = document.getElementById("gameDialog");
let arrayOfNumbersForPlayWithBot = [];
let whooseTurn = "first";
let botIsPlaying = true;

let musicTurnedOn = true;
let soundTurnedOn = true;
let mainMusicPlayer = document.getElementById("mainMusicPlayer");
let soundPlayer = document.getElementById("soundPlayer");
let configWindow = document.getElementById("configWindow");
let musicControll = document.getElementById("musicControll");
let soundControll = document.getElementById("soundControll");

let playerEXPointsIndicator = document.querySelector("#playerEXPointsIndicator");
let playerLevelIndicatorFill = document.getElementById("playerLevelIndicatorFill");
let playerLevelCounts = document.querySelectorAll(".playerLevelCount");

let weaponShop = document.getElementById("weaponShop");
let openWeaponShop = document.getElementById("openWeaponShop");
let closeWeaponShop = weaponShop.querySelector("#closeWeaponShop");
let openWeaponSelectField = document.getElementById("openWeaponSelectField");
let closeWeaponSelectField = document.getElementById("closeWeaponSelectField");
let weapon = weaponShop.querySelectorAll(".weaponShopWeapon > div");

let weaponSelectField = document.getElementById("weaponSelectField");
let weaponToSelect = weaponSelectField.querySelector(".weaponToSelectContainer").querySelectorAll("div");

let selectedWeapon = null;
let weaponShotPointInput = document.getElementById("weaponShotPointInput");
let acceptWeaponShotPointButton = document.getElementById("acceptWeaponShotPointButton");
let weaponShotPoint = 0;
//The weapon amount goes in order as the objects below it and as weapon divs in html. KEEP THE ORDER!!!;
let firstPlayerWeaponAmount = {
	linearAttack: 0, squareAttack: 0, nuclearBomb: 0
};

let firstPlayerWeapon = [
	{
		name: "linearAttack",
		price: 150,
		limit: 3,
		bought: 0,

		use: function(){
			weaponShotPoint = parseInt(weaponShotPoint.toString()[weaponShotPoint.toString().length - 1]);
			
			if(weaponShotPoint == 0){
				weaponShotPoint = 10;
			}

			weaponShotPoint += 90;
			
			while(weaponShotPoint > 0){
				if(queryCellByNumber(currentlyAttackedPlayerField, weaponShotPoint).onclick){
					queryCellByNumber(currentlyAttackedPlayerField, weaponShotPoint).onclick();
				}
				weaponShotPoint -= 10;
			}	
			this.bought--;
		}
	},

	{
		name: "squareAttack",
		price: 100,
		limit: 3,
		bought: 0,
		attackArea:[[-11, -10, -9],
				  [-1, 0, 1],
				  [9, 10, 11]],
		use: function(){
			let beginOfIteration = 0;
			let endOfIteration = 3;
			for(let i = 0; i < 3; i++){
				if(queryCellByNumber(currentlyAttackedPlayerField, this.attackArea[i][0] + weaponShotPoint) && queryCellByNumber(currentlyAttackedPlayerField, this.attackArea[i][0] + weaponShotPoint).getAttribute("endOfRow")){
					beginOfIteration = 1;
				}
			}
			for(let i = 0; i < 3; i++){
				if(queryCellByNumber(currentlyAttackedPlayerField, this.attackArea[i][2] + weaponShotPoint) && queryCellByNumber(currentlyAttackedPlayerField, this.attackArea[i][2] + weaponShotPoint).getAttribute("beginningOfRow")){
					endOfIteration = 2;
				}
			}

			for(let i = beginOfIteration; i < endOfIteration; i++){
				for(let j = 0; j < 3; j++){
					if(queryCellByNumber(currentlyAttackedPlayerField, this.attackArea[j][i] + weaponShotPoint) && queryCellByNumber(currentlyAttackedPlayerField, this.attackArea[j][i] + weaponShotPoint).onclick){
						queryCellByNumber(currentlyAttackedPlayerField, this.attackArea[j][i] + weaponShotPoint).onclick();
					}
				}	
			}
			this.bought--;
		}
	},

	{
		name: "nuclearBomb",
		price: 700,
		limit: 1,
		bought: 0,
		attackArea:[[-22, -21, -20, -19, -18],
					[-12, -11, -10, -9, -8],
					[-2, -1, 0, 1, 2],
					[8, 9, 10, 11, 12],
					[18, 19, 20, 21, 22]],

		use: function(){
			let beginOfIteration = 0;
			let endOfIteration = 5;
			for(let i = 0; i < 5; i++){
				if(queryCellByNumber(currentlyAttackedPlayerField, this.attackArea[i][0] + weaponShotPoint) && queryCellByNumber(currentlyAttackedPlayerField, this.attackArea[i][0] + weaponShotPoint).getAttribute("endOfRow")){
					beginOfIteration = 1;
				}
				else if(queryCellByNumber(currentlyAttackedPlayerField, this.attackArea[i][1] + weaponShotPoint) && queryCellByNumber(currentlyAttackedPlayerField, this.attackArea[i][1] + weaponShotPoint).getAttribute("endOfRow")){
					beginOfIteration = 2;
				}

				if(queryCellByNumber(currentlyAttackedPlayerField, this.attackArea[i][3] + weaponShotPoint) && queryCellByNumber(currentlyAttackedPlayerField, this.attackArea[i][3] + weaponShotPoint).getAttribute("beginningOfRow")){
					endOfIteration = 3;
				}
				else if(queryCellByNumber(currentlyAttackedPlayerField, this.attackArea[i][4] + weaponShotPoint) && queryCellByNumber(currentlyAttackedPlayerField, this.attackArea[i][4] + weaponShotPoint).getAttribute("beginningOfRow")){
					endOfIteration = 4;
				}
			}

			for(let i = beginOfIteration; i < endOfIteration; i++){
				for(let j = 0; j < 5; j++){
					if(queryCellByNumber(currentlyAttackedPlayerField, this.attackArea[j][i] + weaponShotPoint) && queryCellByNumber(currentlyAttackedPlayerField, this.attackArea[j][i] + weaponShotPoint).onclick){						
						queryCellByNumber(currentlyAttackedPlayerField, this.attackArea[j][i] + weaponShotPoint).onclick();
					}
				}
			}
			this.bought--;
		}
	}
];

let secondPlayerWeapon = [Array.prototype.map.call(firstPlayerWeapon, function(obj){return {...obj}})];
secondPlayerWeapon = secondPlayerWeapon[0];

function queryCellByNumber(playerField, number){
	return playerField.querySelector(`[number = "${number}"]`);
}

/*---Adding EXP---*/
function addEXPoints(amount){
	playerEXPoints += amount;
	//0.001 is mistake of computer in calculation;
	while(playerEXPoints**(1/3) >= playerLevel - 0.001){
		//if point === 0 return // it caises error // also related to level === 0
		playerEXPoints -= playerLevel**3;
		playerLevel += 1;
		playerLevelCounts.forEach((count) => count.querySelector(".count").textContent = playerLevel);
	}
	playerEXPointsIndicator.textContent = `${playerEXPoints}/${playerLevel**3}`;
	playerLevelIndicatorFill.style.width = `${(playerEXPoints / playerLevel**3) * 100}%`;
	
	saveUserData();
}



function updateAchievementsValues(){
	achievementsNamesAndCurrentValues = [["destroyShips", totalShipsDestroyed], ["useWeapon", totalWeaponUsed], ["earnMoney", totalMoneyEarned], ["spendMoney", totalMoneySpent], ["winGames", gamesWon]];
}

for(let i = 1; i <= 100; i++){
	arrayOfNumbersForPlayWithBot[arrayOfNumbersForPlayWithBot.length] = i;
}


/*---Main menu---*/
let configurationsButton = document.getElementById("configurationsButton");
let closeConfigurationWindow = document.getElementById("closeConfigurationWindow");
let backToMainMenuButton = document.getElementById("backToMainMenuButton");
let openPlayerInfoWindow = document.getElementById("openPlayerInfoWindow");
let playerInfoWindow = document.getElementById("playerInfoWindow");
let nameWindow = document.getElementById("nameWindow");
let acceptNameButton = nameWindow.querySelector(".acceptNameButton");
let nameInput = nameWindow.querySelector(".nameInput");
let closePlayerInfoWindow = playerInfoWindow.querySelector("#closePlayerInfoWindow");
let playerName = document.querySelectorAll(".playerName");

playerAchievements.forEach(function(achievement){
	achievement.innerHTML = `<p class="achievementTitle">${achievement.getAttribute("targetTitle")}</p> <p class="achievementTarget">${achievement.getAttribute("target")}</p>`;
})


/*---Play button click---*/

playButton.onclick = function(){
	if(!localStorage.getItem("playerName")){
		nameWindow.style.display = "flex";
	}
	else{
		playerEXPoints =  parseInt(localStorage.getItem("playerEXPoints"));
		playerLevel = parseInt(localStorage.getItem("playerLevel"));

		gamesWon = parseInt(localStorage.getItem("gamesWon"));
		totalShipsDestroyed = parseInt(localStorage.getItem("totalShipsDestroyed"));
		totalWeaponUsed = parseInt(localStorage.getItem("totalWeaponUsed"));
	 	totalMoneyEarned = parseInt(localStorage.getItem("totalMoneyEarned"));
	 	totalMoneySpent = parseInt(localStorage.getItem("totalMoneySpent"));
		playerName[0].textContent = localStorage.getItem("playerName");
		playerName[1].textContent = localStorage.getItem("playerName");

		playerEXPointsIndicator.textContent = `${playerEXPoints}/${playerLevel**3}`
		playerLevelIndicatorFill.style.width = `${((playerEXPoints / playerLevel**3)) * 100}%`;
			
		updateAchievementsValues();
	
		for(let i = 0; i < achievementsNamesAndCurrentValues.length; i++){
			playerAchievements.forEach(function(achievement){
				if(achievement.getAttribute("achievementName") == achievementsNamesAndCurrentValues[i][0] && achievementsNamesAndCurrentValues[i][1] >= parseInt(achievement.getAttribute("target"))){
					achievement.style.background = "orange";
					achievement.setAttribute("completed", "true");
				}

			})
		}
		playerAchievements.forEach(function(achievement){
			achievement.onclick = handleAchievementOpen;
		})
	}

	playerLevelCounts.forEach((count) => count.querySelector(".count").textContent = playerLevel);

	if(musicTurnedOn){
		mainMusicPlayer.play();
	}
	mainMenu.style.width = "0%";

	document.getElementById("playerMoney").textContent = `${firstPlayerMoney}\u20AC`;
	setTimeout(function(){
		mainMenu.style.display = "none";
		selectGameModeMenu.style.display = "flex";
		document.getElementById("selectGameModeBackgroundVideo").play();
	}, 2000)

	setTimeout(function(){
		selectGameModeMenu.style.width = "100%";
	}, 2300)
}

/*---Initial user setup---*/
acceptNameButton.onclick = function(){
	if(nameInput.value.length >= 4){
		saveUserData(nameInput.value, 1000, 1, 0, 0, 0, 0, 0, firstPlayerWeaponAmount);

		nameWindow.style.display = "none";
		playerName.textContent = localStorage.getItem("firstPlayerName");
		updateAchievementsValues();
	}
}

openPlayerInfoWindow.onclick = function(){
	let EXPointCountProgression = playerEXPoints / 100;
	playerInfoWindow.style.display = "flex";

	playerLevelIndicatorFill.style.cssText="width: 0%; transition: 0s";
	playerLevelIndicatorFill.style.transition = "1s";
		
	for(let i = 0; i <= 100; i++){
		setTimeout(function(){
			playerEXPointsIndicator.textContent = `${(EXPointCountProgression * i).toFixed(0)}/${playerLevel**3}`;
		}, 10 * i)
	}

	setTimeout(function(){
		playerLevelIndicatorFill.style.width = `${(playerEXPoints / playerLevel**3) * 100}%`;
	}, 100)
}


closePlayerInfoWindow.onclick = function(){
	playerInfoWindow.style.display = "none";
}

closeAchievementViewer.onclick = function(){
	achievementViewer.style.display = "none";
	achievementCompletionIndicatorFill.style.width = "0px";
}


backToMainMenuButton.onclick = function(){
	selectGameModeMenu.style.width = "0%";
	setTimeout(function(){
		selectGameModeMenu.style.display = "none";
		mainMenu.style.display = "flex";
	}, 2000)

	setTimeout(function(){
		mainMenu.style.width = "100%";
	}, 2300);
}


configurationsButton.onclick = function(){
	configWindow.style.display = "flex";
	setTimeout(function(){
		configWindow.style.width = "100%";
	}, 100)
}


closeConfigurationWindow.onclick = function(){
	configWindow.style.width = "0%";
	setTimeout(function(){
		configWindow.style.display = "none";
	}, 1000)
}


/*---Music volume switch---*/

musicControll.onclick = function(){
	if(musicTurnedOn){
		musicTurnedOn = false;
		mainMusicPlayer.pause();
		musicControll.style.textDecoration = "line-through";
	}
	else{
		musicTurnedOn = true;
		mainMusicPlayer.play();
		musicControll.style.textDecoration = "none";
	}
}


/*---Sound volume switch---*/

soundControll.onclick = function(){
	if(soundTurnedOn){
		soundTurnedOn = false;
		soundPlayer.pause();
		soundControll.style.textDecoration = "line-through";
	}
	else{
		soundTurnedOn = true;
		soundPlayer.play();
		soundControll.style.textDecoration = "none";
	}
}



	/*---Game mode selection---*/

playerVsComputer.onclick = function(){
	botIsPlaying = true;
	this.setAttribute("disabled", "true");
	playerVsPlayer.removeAttribute("disabled");
}

playerVsPlayer.onclick = function(){
	botIsPlaying = false;
	this.setAttribute("disabled", "true");
	playerVsComputer.removeAttribute("disabled");
}

	/*---Game mode selection---*/

/*If user plays with bot then all user saved progress data is loaded, if pVp then everyone has 1000 cash units and 0 weapon*/ 
selectGameMode.onclick = function(){
	selectGameModeMenu.style.width = "0%";
	setTimeout(function(){
		selectGameModeMenu.style.display = "none";
		gameFields.style.display = "flex";
	}, 2000)


	if(botIsPlaying){
		setPlayerDataFromLocaleStorage();
	}
	else{
		firstPlayerMoney = 1000;
		for(let i = 0; i < firstPlayerWeapon.length; i++){
			firstPlayerWeapon[i].bought = 0;
			secondPlayerWeapon[i].bought = 0;
		}
	}

	secondPlayerMoney = 1000;
	playerMoney.textContent = `${firstPlayerMoney}\u20AC`;

	renderWeaponCount("first");
}




let passShipPlacingToSecondPlayer = document.getElementById("passShipPlacingToSecondPlayer");

/*Initialization of shipsplacing click event for each cell*/
firstPlayerCells.forEach(function(cell){
	cell.onclick = function(){
		placingPoint = parseInt(cell.getAttribute("number"));
		placeShip(firstPlayerField, currentlySelectedShip, placingPoint);
	}

	cell.onmouseover = function(){
		cellMouseOverEffect(firstPlayerField, this);
	};

	cell.onmouseleave = function(){
		cellMouseLeaveEffect(firstPlayerField);
	}
});

secondPlayerCells.forEach(function(cell){
	cell.onclick = function(){
		placingPoint = parseInt(cell.getAttribute("number"));
		placeShip(secondPlayerField, currentlySelectedShip, placingPoint);
	}

	cell.onmouseover = function(){
		cellMouseOverEffect(secondPlayerField, this);
	};

	cell.onmouseleave = function(){
		cellMouseLeaveEffect(secondPlayerField);
	}
});


/*Ship select*/
shipsToPlace.forEach(function(ship){
	ship.onclick = function(){
		if(parseInt(ship.getAttribute("amountOnTheField")) < parseInt(ship.getAttribute("limit"))){
			currentlySelectedShip = ship;
		}

		shipsToPlace.forEach((ship) => ship.classList.remove("-selected"));

		if(!this.classList.contains("-disabled")){/*this.classList.disabled*/
			this.classList.add("-selected")
		}
	}
})



passShipPlacingToSecondPlayer.onclick = function(){
	if(firstPlayerField.querySelectorAll(`[ship = "true"]`).length < 25){
		return;
	}

	whooseTurn = "second";
	shipsToPlace.forEach(function(ship){
		ship.setAttribute("amountOnTheField", "0");
		ship.classList.remove("-seleted");
		ship.classList.remove("-disabled");
	})
	startGameButton.style.display = "block";

	renderWeaponCount(whooseTurn);

	document.getElementById("playerMoney").textContent = `${secondPlayerMoney}\u20AC`;

	if(botIsPlaying){ /*Then autoplace and auto buy*/
		for(let i = 0; i < 10; i++){
			weapon[Math.round(Math.random() * (weapon.length - 1))].onclick()
		}

		autoPlacingButton.onclick();
		passShipPlacingToSecondPlayer.style.display = "none";
		setTimeout(() => { 
			startGame();
			secondPlayerField.style.display = "grid"; 
		}, 100);
	}
	else{ /*User selects by himself*/
		firstPlayerField.style.display = "none";
		passShipPlacingToSecondPlayer.style.display = "none";
		secondPlayerField.style.display = "grid";
	}
}

rotateShipButton.onclick = rotateShip;

//Auto Placing
autoPlacingButton.onclick = function(){
	if(whooseTurn == "first"){
		autoPlacing(firstPlayerField);
	}
	else if(whooseTurn == "second"){
		autoPlacing(secondPlayerField);
	}
}


/*---BUYING_WEAPON---*/
for(let i = 0; i < weapon.length; i++){
	weapon[i].onclick = function(){
		if(whooseTurn == "first"){
			for(let j = 0; j < firstPlayerWeapon.length; j++){
				if(weapon[i].className == firstPlayerWeapon[j].name && firstPlayerWeapon[j].limit > firstPlayerWeapon[j].bought && firstPlayerMoney >= firstPlayerWeapon[j].price){
					firstPlayerWeapon[j].bought += 1;
					firstPlayerMoney -= firstPlayerWeapon[j].price;
					document.getElementById("playerMoney").textContent = `${firstPlayerMoney}\u20AC`;

					if(botIsPlaying){
						totalMoneySpent += firstPlayerWeapon[j].price;
						updateAchievementsValues();
						checkForNewAchievenents("spendMoney", totalMoneySpent);
					}
					break;
				}
			}
		}
		else if(whooseTurn == "second"){
			for(let j = 0; j < secondPlayerWeapon.length; j++){
				if(weapon[i].className == secondPlayerWeapon[j].name && secondPlayerWeapon[j].limit > secondPlayerWeapon[j].bought && secondPlayerMoney >= secondPlayerWeapon[j].price){
					secondPlayerWeapon[j].bought += 1;
					secondPlayerMoney -= secondPlayerWeapon[j].price;
					document.getElementById("playerMoney").textContent = `${secondPlayerMoney}\u20AC`;
					break;
				}
			}
		}
		saveUserData();
		renderWeaponCount(whooseTurn);
	}
}

openWeaponShop.onclick = function(){
	weaponShop.style.display = "block";
}

closeWeaponShop.onclick = function(){
	weaponShop.style.display = "none";
}

	

let botMovesBeforeUsingWeapon = 0;
let amountOfMovesToUseWeapon = Math.round(Math.random() * 15);
let cellNumberToAttack = 0;

let gameEndWindow = document.getElementById("gameEndWindow");
	
startGameButton.onclick = startGame;


	openWeaponSelectField.onclick = function(){
		weaponSelectField.style.width = "20%";
	}
	closeWeaponSelectField.onclick = function(){
		weaponSelectField.style.width = "0%";
	}



/*---Game ending---*/
let leaveGameButton = gameFields.querySelector("#leaveGameButton");
let leavingConfirmWindow = gameFields.querySelector("#leavingConfirmWindow");
let confirmLeaving = leavingConfirmWindow.querySelector("#confirmLeaving");
let rejectLeaving = leavingConfirmWindow.querySelector("#rejectLeaving");

endTheGameButton.onclick = endTheGame;



leaveGameButton.onclick = function(){
	leavingConfirmWindow.style.display = "flex";
	closeWeaponSelectField.onclick();
}

confirmLeaving.onclick = function(){
	endTheGame();
	leavingConfirmWindow.style.display = "none";
}

rejectLeaving.onclick = function(){
	leavingConfirmWindow.style.display = "none";
}














function saveUserData(name = "Stranger", money = firstPlayerMoney, EXPoints = playerEXPoints, level = playerLevel, wonGames = gamesWon, totalUsedWeapon = totalWeaponUsed, totalEarnedMoney = totalMoneyEarned, totalSpentMoney = totalMoneySpent, weaponAmount = firstPlayerWeaponAmount){
	//write data to local storage
	updatefirstPlayerWeaponAmount();

	localStorage.setItem("playerName", name);
	localStorage.setItem("playerMoney", money);
	localStorage.setItem("playerEXPoints", EXPoints);
	localStorage.setItem("playerLevel", level);
	localStorage.setItem("gamesWon", wonGames);
	localStorage.setItem("totalWeaponUsed", totalUsedWeapon);
	localStorage.setItem("totalMoneyEarned", totalEarnedMoney);	
	localStorage.setItem("totalMoneySpent", totalSpentMoney);
	localStorage.setItem("playerWeaponAmount", JSON.stringify(weaponAmount));	
}




function startGame(){
	if(secondPlayerField.querySelectorAll(`[ship = "true"]`).length != 25){
		return;
	}
	whooseTurn = "first";
	renderWeaponCount(whooseTurn);
	firstPlayerField.style.pointerEvents = "none";
	secondPlayerField.style.pointerEvents = "initial";
	startGameButton.style.display = "none";
	firstPlayerField.style.display = "grid";
	shipPlaceField.style.display = "none";
	openWeaponSelectField.style.display = "initial";

	firstPlayerCells.forEach(function(cell){
		cell.style.background = "var(--cellBackground)";
		cell.onclick = shot;

		if(cell.querySelector("div") && !botIsPlaying){
			cell.querySelector("div").style.display = "none";
		}
	})
	secondPlayerCells.forEach(function(cell){
		cell.style.backgroundColor = "var(--cellBackground)";
		cell.onclick = shot;

		if(cell.querySelector("div")){
			cell.querySelector("div").style.display = "none";
		}
	})

	for(let i = 0; i < firstPlayerWeapon.length; i++){
		weaponToSelect[i].setAttribute("amount", firstPlayerWeapon[i].bought);
	}
	renderWeaponCount(whooseTurn);

	for(let i = 0; i < firstPlayerWeapon.length; i++){
		weaponToSelect[i].onclick = function(){
			let weaponName = weaponToSelect[i].classList[0]; //it's weapon nam
			weaponToSelect.forEach((item) => {
				item.classList.remove("-selected");
			});

			if(whooseTurn == "first"){
				for(let j = 0; j < firstPlayerWeapon.length; j++){
					if(firstPlayerWeapon[j].name == weaponName && firstPlayerWeapon[j].bought > 0){
						this.classList.add("-selected");
						document.querySelector("#selectShotPoint").style.height = "20%";
						selectedWeapon = firstPlayerWeapon[j];
						secondPlayerField.style.pointerEvents = "none";
					}
				}
			}
			else if(whooseTurn == "second"){
				for(let j = 0; j < secondPlayerWeapon.length; j++){
					if(secondPlayerWeapon[j].name == weaponName && secondPlayerWeapon[j].bought > 0){
						this.classList.add("-selected");
						document.querySelector("#selectShotPoint").style.height = "20%";
						selectedWeapon = secondPlayerWeapon[j];
						firstPlayerField.style.pointerEvents = "none";
					}
				}
			}
			saveUserData();
			renderWeaponCount(whooseTurn);
		}
	}


	acceptWeaponShotPointButton.onclick = function(){
		document.querySelector("#selectShotPoint").style.height = "0%";
		closeWeaponSelectField.onclick();

		if(selectedWeapon){
			soundPlayer.src = "Files/sounds/big_explosion.mp3";
			soundPlayer.play();

			currentlyAttackedPlayerField.querySelectorAll(".cell").forEach(function(cell){
				cell.style.backgroundColor = "var(--cellBackground)";
			})
			
			if(whooseTurn == "first"){
				secondPlayerField.style.pointerEvents = "initial";
				selectedWeapon.use();
				whooseTurn = "second";
				renderWeaponCount(whooseTurn);
				shotPoint1 = null;
				selectedWeapon = null;
				currentlyAttackedPlayerField = firstPlayerField;
				firstPlayerField.style.pointerEvents = "initial";
				secondPlayerField.style.pointerEvents = "none";
				totalWeaponUsed++;
				updateAchievementsValues();
				checkForNewAchievenents("useWeapon", totalWeaponUsed);

				for(let i = 0; i < firstPlayerWeapon.length; i++){
					weaponToSelect[i].setAttribute("amount", secondPlayerWeapon[i].bought);
					weaponToSelect[i].classList.remove("-selected");
				}
			}
			else if(whooseTurn == "second"){
				firstPlayerField.style.pointerEvents = "initial";
				whooseTurn = "first";
				renderWeaponCount(whooseTurn);
				selectedWeapon.use();
				shotPoint1 = null;
				selectedWeapon = null;
				currentlyAttackedPlayerField = secondPlayerField;
				firstPlayerField.style.pointerEvents = "none";
				secondPlayerField.style.pointerEvents = "initial";
				openWeaponSelectField.pointerEvents = "initial";

				for(let i = 0; i < firstPlayerWeapon.length; i++){
					weaponToSelect[i].setAttribute("amount", firstPlayerWeapon[i].bought);
					weaponToSelect[i].classList.remove("-selected");
				}
			}


			if(botIsPlaying && whooseTurn == "second"){
				setTimeout(bot, 1000);
			}
		}
		saveUserData();
		renderWeaponCount(whooseTurn);
	}

	weaponShotPointInput.oninput = function(){
		weaponShotPoint = parseInt(weaponShotPointInput.value);
		
		if(weaponShotPoint != "" && weaponShotPoint >= 1 && weaponShotPoint <= 100){
			currentlyAttackedPlayerField.querySelectorAll(".cell").forEach(function(cell){
					cell.style.backgroundColor = "var(--cellBackground)";
			})
			queryCellByNumber(currentlyAttackedPlayerField, weaponShotPoint).style.background = "rgb(128, 0, 128)";
		}
	}
}



function setPlayerDataFromLocaleStorage(){
	firstPlayerMoney = parseFloat(localStorage.getItem("playerMoney"));
	firstPlayerWeaponAmount = JSON.parse(localStorage.getItem("playerWeaponAmount"));

	for(const prop in firstPlayerWeaponAmount){
		for(let i = 0; i < firstPlayerWeapon.length; i++){
			if(prop.toLowerCase() === firstPlayerWeapon[i].name.toLowerCase()){
				firstPlayerWeapon[i].bought = firstPlayerWeaponAmount[prop];
				break;
			}
		}
	}
};




function rotateShip(){
	if(currentlySelectedShip){
		currentlySelectedShip.getAttribute("turned") == "false" ? currentlySelectedShip.setAttribute("turned", "true") : currentlySelectedShip.setAttribute("turned", "false")
	}
}


function placeShip(playerField, ship, placingPoint){
	if(ship && placingPoint){
		let shipLength = parseInt(ship.getAttribute("length"));
		let currentCell;
		let shipOnTheChosenPlace = false;
		let placeOccupied = false;

		/*Check if place where player wants to place a ship is occupied, unavaliable or does not exist*/
		if(ship.getAttribute("turned") == "false"){
			for(let j = 0; j < shipLength; j++){
				if(queryCellByNumber(playerField, placingPoint + j * 10) && queryCellByNumber(playerField, placingPoint + j * 10).getAttribute("ship")){
					shipOnTheChosenPlace = true;
					return;

				}
			}

			for(let j = 0; j < shipLength; j++){
				if(!queryCellByNumber(playerField, placingPoint + j * 10) || queryCellByNumber(playerField, placingPoint + j * 10).getAttribute("occupied")){
					placeOccupied = true;
					return;
				}
			}
		}
		else if(ship.getAttribute("turned") == "true"){
			for(let j = placingPoint; j < placingPoint + shipLength; j++){
				if(queryCellByNumber(playerField, j) && queryCellByNumber(playerField, j).getAttribute("occupied") == "true"){
					placeOccupied = true;
					return;
				}
			}
		}

		for(let i = 0; i < shipLength; i++){
			if(ship.getAttribute("turned") == "false"){
				if(!playerField.querySelector(`[number = "${placingPoint + 10 * (shipLength - 1)}"]`) || parseInt(ship.getAttribute("amountOnTheField")) > parseInt(ship.getAttribute("limit")) || placeOccupied || shipOnTheChosenPlace){
					return;
				}

				/*If place avaliable then occupy the following cells:*/
				if(queryCellByNumber(playerField, placingPoint - 1) && !queryCellByNumber(playerField, placingPoint - 1).getAttribute("endOfRow")){
					queryCellByNumber(playerField, placingPoint - 1 + i * 10).style.background = "rgb(20, 100, 250)";
					queryCellByNumber(playerField, placingPoint - 1 + i * 10).setAttribute("occupied", "true");

				}
				if(!queryCellByNumber(playerField, placingPoint + 1).getAttribute("beginningOfRow")){
					queryCellByNumber(playerField, placingPoint + 1 + i * 10).style.background = "rgb(20, 100, 250)";
					queryCellByNumber(playerField, placingPoint + 1 + i * 10).setAttribute("occupied", "true");
				}

				if(queryCellByNumber(playerField ,placingPoint - 10)){
					if(queryCellByNumber(playerField, placingPoint - 10 - 1) && !queryCellByNumber(playerField, placingPoint - 10 - 1).getAttribute("endOfRow")){
						queryCellByNumber(playerField, placingPoint - 10 - 1).style.background = "rgb(20, 100, 250)";
						queryCellByNumber(playerField, placingPoint - 10 - 1).setAttribute("occupied", "true");
					}
					if(queryCellByNumber(playerField, placingPoint - 10)){
						queryCellByNumber(playerField, placingPoint - 10).style.background = "rgb(20, 100, 250)";
						queryCellByNumber(playerField, placingPoint - 10).setAttribute("occupied", "true");
					}
					if(queryCellByNumber(playerField, placingPoint - 10 + 1) && !queryCellByNumber(playerField, placingPoint - 10 + 1).getAttribute("beginningOfRow")){
						queryCellByNumber(playerField, placingPoint - 10 + 1).style.background = "rgb(20, 100, 250)";
							queryCellByNumber(playerField, placingPoint - 10 + 1).setAttribute("occupied", "true");
					}
				}
				if(queryCellByNumber(playerField, placingPoint + shipLength * 10)){
					if(queryCellByNumber(playerField, placingPoint + shipLength * 10 - 1) && !queryCellByNumber(playerField, placingPoint + shipLength * 10 - 1).getAttribute("endOfRow")){
						queryCellByNumber(playerField, placingPoint + shipLength * 10 - 1).style.background = "rgb(20, 100, 250)";
						queryCellByNumber(playerField, placingPoint + shipLength * 10 - 1).setAttribute("occupied", "true");
					}
					if(queryCellByNumber(playerField, placingPoint + shipLength * 10)){
						queryCellByNumber(playerField, placingPoint + shipLength * 10).style.background = "rgb(20, 100, 250)";
						queryCellByNumber(playerField, placingPoint + shipLength * 10).setAttribute("occupied", "true");
					}
					if(queryCellByNumber(playerField, placingPoint + shipLength * 10 + 1) && !queryCellByNumber(playerField, placingPoint + shipLength * 10 + 1).getAttribute("beginningOfRow")){
						queryCellByNumber(playerField, placingPoint + shipLength * 10 + 1).style.background = "rgb(20, 100, 250)";
						queryCellByNumber(playerField, placingPoint + shipLength * 10 + 1).setAttribute("occupied", "true");
					}
				}

				currentCell = playerField.querySelector(`[number = "${placingPoint + i * 10}"]`)
				currentCell.setAttribute("ship", "true");
				currentCell.setAttribute("occupied", "true");
				currentCell.setAttribute("shipLength", shipLength);
				currentCell.setAttribute("id", `${whooseTurn}Player-${ship.getAttribute("id")}-${ship.getAttribute("amountOnTheField")}`)
				
				let cellFill = document.createElement("div");
				cellFill.style.cssText = "width: 100%; height: 100%; background: black; position: absolute;";
				currentCell.appendChild(cellFill);

				if(i == 0){
					cellFill.style.borderTopLeftRadius =  "10px"; 
					cellFill.style.borderTopRightRadius = "10px";
				}
				else if(i == shipLength - 1){
					cellFill.style.borderBottomLeftRadius =  "10px"; 
					cellFill.style.borderBottomRightRadius = "10px";					
				}
			}
				

			else if(ship.getAttribute("turned") == "true"){
				let shipCrossesFieldLine = false;

				for(let j = placingPoint; j < placingPoint + shipLength - 1; j++){
					if(playerField.querySelector(`[number = "${j}"]`).getAttribute("endOfRow")){
						shipCrossesFieldLine = true;
						return;
					}
				}

				if(shipCrossesFieldLine || placeOccupied){
					return;
				}

				//Placing occupied cells on top and bottom side
				if(playerField.querySelector(`[number = "${placingPoint + i - 10}"]`)){
					playerField.querySelector(`[number = "${placingPoint + i - 10}"]`).style.background = "rgb(20, 100, 250)";
					queryCellByNumber(playerField, placingPoint + i - 10).setAttribute("occupied", "true");
				}
				if(playerField.querySelector(`[number = "${placingPoint + i + 10}"]`)){
					playerField.querySelector(`[number = "${placingPoint + i + 10}"]`).style.background = "rgb(20, 100, 250)";
					queryCellByNumber(playerField, placingPoint + i + 10).setAttribute("occupied", "true");
				}
				////////////////////////////////////////////////////

				//Placing occupied cells on left and right side
				if(!(playerField.querySelector(`[number = "${placingPoint}"]`)).getAttribute("beginningOfRow")){
					if(playerField.querySelector(`[number = "${placingPoint - 1 - 10}"]`)){
						playerField.querySelector(`[number = "${placingPoint - 1 - 10}"]`).style.background = "rgb(20, 100, 250)";
						queryCellByNumber(playerField, placingPoint - 1 - 10).setAttribute("occupied", "true");
					}
					if(playerField.querySelector(`[number = "${placingPoint - 1}"]`)){
						playerField.querySelector(`[number = "${placingPoint - 1}"]`).style.background = "rgb(20, 100, 250)";
						queryCellByNumber(playerField, placingPoint - 1).setAttribute("occupied", "true");
					}
					if(playerField.querySelector(`[number = "${placingPoint - 1 + 10}"]`)){
						playerField.querySelector(`[number = "${placingPoint - 1 + 10}"]`).style.background = "rgb(20, 100, 250)";
						queryCellByNumber(playerField, placingPoint + 10 - 1).setAttribute("occupied", "true");
					}
				}

				if(!(playerField.querySelector(`[number = "${placingPoint + shipLength - 1}"]`)).getAttribute("endOfRow")){
					if(playerField.querySelector(`[number = "${placingPoint + shipLength - 10}"]`)){
						playerField.querySelector(`[number = "${placingPoint + shipLength - 10}"]`).style.background = "rgb(20, 100, 250)";
						queryCellByNumber(playerField, placingPoint + shipLength - 10).setAttribute("occupied", "true");
					}
					if(playerField.querySelector(`[number = "${placingPoint + shipLength}"]`)){
						playerField.querySelector(`[number = "${placingPoint + shipLength}"]`).style.background = "rgb(20, 100, 250)";
						queryCellByNumber(playerField, placingPoint + shipLength).setAttribute("occupied", "true");
					}
					if(playerField.querySelector(`[number = "${placingPoint + shipLength + 10}"]`)){
						playerField.querySelector(`[number = "${placingPoint + shipLength + 10}"]`).style.background = "rgb(20, 100, 250)";
						queryCellByNumber(playerField, placingPoint + shipLength + 10).setAttribute("occupied", "true");
					}
				}
				////////////////////////////////////////////////////

				currentCell = queryCellByNumber(playerField, placingPoint + i);
				currentCell.setAttribute("ship", "true");
				currentCell.setAttribute("occupied", "true");
				currentCell.setAttribute("shipLength", shipLength);
				currentCell.setAttribute("id", `${whooseTurn}Player-${ship.getAttribute("id")}-${ship.getAttribute("amountOnTheField")}`);

				let cellFill = document.createElement("div");
				cellFill.style.cssText = "width: 100%; height: 100%; background: black; position: absolute;";
				currentCell.appendChild(cellFill);

				if(i === 0){
					cellFill.style.borderTopLeftRadius =  "10px"; 
					cellFill.style.borderBottomLeftRadius = "10px";
				}
				else if(i === shipLength - 1){
					cellFill.style.borderTopRightRadius =  "10px"; 
					cellFill.style.borderBottomRightRadius = "10px";					
				}
			}		
		}

	ship.setAttribute("amountOnTheField", parseInt(ship.getAttribute("amountOnTheField")) + 1);
	
	ship.classList.remove("-selected");
	if(parseInt(ship.getAttribute("amountOnTheField")) === parseInt(ship.getAttribute("limit")))  {
		ship.classList.add("-disabled"); 
	}
	currentlySelectedShip = null;
	}
}





function autoPlacing(playerField){
	let numbArr = [];
	let placeNumber;
	let currentShip;

	for(let i = 1; i <= 100; i++){
		numbArr[numbArr.length] = i;
	}

	for(let i = 0; i <= 100; i++){
		try{
			shipsToPlaceCopy[0].onclick();
			currentShip = currentlySelectedShip;
			placeNumber = numbArr[Math.floor(Math.random() * numbArr.length)] || 1; //if array is empty then placeNumber is undefined
			numbArr.splice(numbArr.indexOf(placeNumber), 1);
		}
		catch{};

		for(let i = 0; i < Math.random() * 10; i++){
			rotateShipButton.onclick();
		}

		queryCellByNumber(playerField, placeNumber).onclick();
			
		if(currentShip && shipsToPlaceCopy[0] && parseInt(shipsToPlaceCopy[0].getAttribute("limit")) == parseInt(shipsToPlaceCopy[0].getAttribute("amountOnTheField"))){
			Array.prototype.splice.call(shipsToPlaceCopy, 0, 1);
		}
	}

	shipsToPlaceCopy = [...shipsToPlace];
}






function cellMouseOverEffect(playerField, cell){
	/*Mouse hovering over cell*/
	let currentCell;
	if(currentlySelectedShip){
		const shipLength = parseInt(currentlySelectedShip.getAttribute("length"));

		/*Not turned ship hovering over cell*/
		if(currentlySelectedShip.getAttribute("turned") == "false"){
			for(let i = 0; i < shipLength; i++){
				currentCell = queryCellByNumber(playerField, parseInt(cell.getAttribute("number")) + i * 10);

				if(currentCell && !currentCell.getAttribute("ship") && !currentCell.getAttribute("occupied")){
					queryCellByNumber(playerField, parseInt(cell.getAttribute("number")) + i * 10).style.background = "gray";
					hoverAffectedCells[hoverAffectedCells.length] = parseInt(currentCell.getAttribute("number"));
				}
			}
		}
			
		/*Turned ship hovering over cell*/
		else if(currentlySelectedShip.getAttribute("turned") == "true"){
			for(let i = 0; i < shipLength; i++){
				currentCell = queryCellByNumber(playerField, parseInt(cell.getAttribute("number")) + i);

				if(currentCell && !currentCell.getAttribute("ship") && !currentCell.getAttribute("occupied")){	
					if(queryCellByNumber(playerField, parseInt(currentCell.getAttribute("number")) + 1) && queryCellByNumber(playerField, parseInt(currentCell.getAttribute("number")) + 1).getAttribute("beginningOfRow")) {
						currentCell.style.background = "gray";
						hoverAffectedCells[hoverAffectedCells.length] = currentCell.getAttribute("number");
						break;
					}
					currentCell.style.background = "gray";
					hoverAffectedCells[hoverAffectedCells.length] = parseInt(currentCell.getAttribute("number"));
				}
			}
		}
	}
}






/*When cell hover effect ends need to turn gray cells ^ into default color*/
function cellMouseLeaveEffect(playerField){
	hoverAffectedCells.forEach(function(number){
		if(!queryCellByNumber(playerField, number).getAttribute("ship")){
			queryCellByNumber(playerField, number).style.background = "var(--cellBackground)"
		}
	})
	hoverAffectedCells = [];
}








function shot(){
	if(!this.getAttribute("ship")){
		let missDot = document.createElement("div");
		missDot.id = "missDot";
		missDot.style.cssText = "animation-name: dotMiss";
		this.appendChild(missDot);

		if(!selectedWeapon && soundTurnedOn){
			soundPlayer.src = "Files/sounds/shot_sound.mp3";
			soundPlayer.play();
		}
	}
	else if(this.getAttribute("ship")){
		let destroyDot = document.createElement("div");
		destroyDot.className = "destroyDot";
		destroyDot.style.cssText = "animation-name: dotDestroy";
		this.appendChild(destroyDot);
		this.setAttribute("destroyed", "true");
		if(!selectedWeapon && soundTurnedOn){
			soundPlayer.src = "Files/sounds/small_explosion.mp3";
			soundPlayer.play();
		}
		if(firstPlayerField.querySelectorAll(`#${this.getAttribute("id")}[destroyed = "true"]`).length == parseInt(this.getAttribute("shipLength"))){
			let smoke;

			firstPlayerField.querySelectorAll(`#${this.getAttribute("id")}[destroyed = "true"]`).forEach(function(cell){
				cell.querySelector("div").style.background = "pink";
				cell.querySelector("div").style.display = "block";
				cell.setAttribute("shipDestroyed", "true");
				cell.style.animationName = "fullShipExplosion";

				smoke = document.createElement("img");
				smoke.className = "smoke";
				smoke.src = "Files/images/smoke.gif";
				cell.appendChild(smoke);
			})
				
			setTimeout(function(){
				soundPlayer.src = "Files//big_explosion.mp3";
				soundPlayer.play();
			}, 1000);

			if(firstPlayerField.querySelectorAll(`div[destroyed = "true"]`).length == 25){
				let victoryMoney = gameEndWindow.querySelector("#victoryMoney");
				let shipSectionDestroyedMoney = gameEndWindow.querySelector("#shipSectionDestroyedMoney");
				let shipSectionsLostMoney = gameEndWindow.querySelector("#shipSectionsLostMoney");
				let targetingPercentMoney = gameEndWindow.querySelector("#targetingPercentMoney");
				let totalMoney = gameEndWindow.querySelector("#totalMoney");
				let shotsMade = 0;
				let destroyedShipSections = 25;
				let lostShipSections = 0;
				let targetingPercent;
				let total;

				secondPlayerField.style.pointerEvents = "none";

				
				gameEndWindow.querySelector("#endGameText").textContent =  "Second player win";
				gameEndWindow.opacity = 0;
				gameEndWindow.style.display = "flex";
				setTimeout(() => gameEndWindow.opacity = 1);
					
				if(!botIsPlaying){
					firstPlayerCells.forEach(function(cell){
						if(cell.onclick == null){
							shotsMade += 1;
						}
					});

					lostShipSections = secondPlayerField.querySelectorAll("[destroyed = 'true']").length;
					targetingPercent = Number(((25 / shotsMade) * 100).toFixed(2));
					total = 500 + 250 - lostShipSections * 10 + targetingPercent * 20;

					shipSectionsLostMoney.textContent = `${lostShipSections} x -10 => -${lostShipSections * 10}`;
					targetingPercentMoney.textContent = `${targetingPercent}% => ${(targetingPercent * 10).toFixed(2)}`;
					totalMoney.textContent = `${total}\u20AC`;
					secondPlayerMoney += total;
				}
				else{
					secondPlayerCells.forEach(function(cell){
						if(cell.onclick == null){
							shotsMade += 1;
						}
					});

					destroyedShipSections = secondPlayerField.querySelectorAll("[destroyed = 'true']").length;
					lostShipSections = 25;
					targetingPercent = Number(((destroyedShipSections / shotsMade) * 100).toFixed(2));
					total =	destroyedShipSections * 10 - lostShipSections * 10 + targetingPercent * 20;

					victoryMoney.textContent = "0";
					shipSectionsLostMoney.textContent = "25 x -10 => -250";
					shipSectionDestroyedMoney.textContent = `${destroyedShipSections} x 10 => ${destroyedShipSections * 10}`;
					targetingPercentMoney.textContent = `${targetingPercent}% => ${targetingPercent * 10}`;
					totalMoney.textContent = `${total}\u20AC`;
					firstPlayerMoney += total;
					totalMoneyEarned += total;
					playerMoney.textContent = `${firstPlayerMoney}\u20AC`;
					updateAchievementsValues();
					checkForNewAchievenents("earnMoney", totalMoneyEarned);

					secondPlayerMoney = 1000;
				}
			}
		}
			
		if(secondPlayerField.querySelectorAll(`#${this.id}[destroyed = "true"]`).length == parseInt(this.getAttribute("shipLength"))){
			let smoke;

			secondPlayerField.querySelectorAll(`#${this.id}[destroyed = "true"]`).forEach(function(cell){
				cell.querySelector("div").style.background = "pink";
				cell.querySelector("div").style.display = "block";
				cell.setAttribute("shipDestroyed", "true");
				cell.style.animationName = "fullShipExplosion";

				smoke = document.createElement("img");
				smoke.className = "smoke";
				smoke.src = "Files/images/smoke.gif";
				cell.appendChild(smoke)
			})
			totalShipsDestroyed++;
			updateAchievementsValues();
			checkForNewAchievenents("destroyShips", totalShipsDestroyed);

			setTimeout(function(){
				soundPlayer.src = "Files/sounds/big_explosion.mp3";
				soundPlayer.play();
			}, 100);

			if(secondPlayerField.querySelectorAll(`div[destroyed = "true"]`).length == 25){
				let victoryMoney = gameEndWindow.querySelector("#victoryMoney");
				let shipSectionDestroyedMoney = gameEndWindow.querySelector("#shipSectionDestroyedMoney");
				let shipSectionsLostMoney = gameEndWindow.querySelector("#shipSectionsLostMoney");
				let targetingPercentMoney = gameEndWindow.querySelector("#targetingPercentMoney");
				let totalMoney = gameEndWindow.querySelector("#totalMoney");
				let shotsMade = 0;
				let destroyedShipSections = 25;
				let lostShipSections = 0;
				let targetingPercent;
				let total;

				firstPlayerField.style.pointerEvents = "none";

				gameEndWindow.querySelector("#endGameText").textContent =  "First player win";
				gameEndWindow.opacity = 0;
				gameEndWindow.style.display = "flex";
				setTimeout(() => gameEndWindow.opacity = 1);

				secondPlayerCells.forEach(function(cell){
						if(cell.onclick == null){
							shotsMade += 1;
						}
					})

				destroyedShipSections = 25;
				lostShipSections = firstPlayerField.querySelectorAll("[destroyed = 'true']").length;
				targetingPercent = Number(((destroyedShipSections / shotsMade) * 100).toFixed(2));
				total =	500 + destroyedShipSections * 10 - lostShipSections * 10 + targetingPercent * 10;

				victoryMoney.textContent = "500";
				shipSectionsLostMoney.textContent = `${lostShipSections} x -10 => ${lostShipSections * -10}`;
				shipSectionDestroyedMoney.textContent = `${destroyedShipSections} x 10 => ${destroyedShipSections * 10}`;
				targetingPercentMoney.textContent = `${targetingPercent}% => ${(targetingPercent * 10).toFixed(2)}`;
				totalMoney.textContent = `${total}\u20AC`;
				firstPlayerMoney += total;
				totalMoneyEarned += total;
				playerMoney.textContent = `${firstPlayerMoney}\u20AC`;
					
				addEXPoints(50);
				updateAchievementsValues();
				checkForNewAchievenents("winGames", gamesWon);
				checkForNewAchievenents("earnMoney", totalMoneyEarned);
					
			}
		}	
	}
	this.onclick = null;

	if(!selectedWeapon && whooseTurn == "first"){
		firstPlayerField.style.pointerEvents = "initial";
		secondPlayerField.style.pointerEvents = "none";
		whooseTurn = "second";
		currentlyAttackedPlayerField = firstPlayerField;

		for(let i = 0; i < firstPlayerWeapon.length; i++){
			weaponToSelect[i].setAttribute("amount", secondPlayerWeapon[i].bought);
		}
	}
	else if(!selectedWeapon && whooseTurn == "second"){
		firstPlayerField.style.pointerEvents = "none";
		secondPlayerField.style.pointerEvents = "initial";
		openWeaponSelectField.style.pointerEvents = "initial";
		whooseTurn = "first";
		currentlyAttackedPlayerField = secondPlayerField;

		for(let i = 0; i < firstPlayerWeapon.length; i++){
			weaponToSelect[i].setAttribute("amount", firstPlayerWeapon[i].bought);
		}
	}
		
	if(botIsPlaying && currentlyAttackedPlayerField == firstPlayerField && selectedWeapon){
		arrayOfNumbersForPlayWithBot.splice(arrayOfNumbersForPlayWithBot.indexOf(parseInt(this.getAttribute("number"))), 1);
	}

	if(botIsPlaying && whooseTurn == "second"){
		setTimeout(bot, 1000);
	}

	saveUserData();
	renderWeaponCount(whooseTurn);
}




function updatefirstPlayerWeaponAmount(){
	firstPlayerWeaponAmount[firstPlayerWeapon[0].name] = firstPlayerWeapon[0].bought;
	firstPlayerWeaponAmount[firstPlayerWeapon[1].name] = firstPlayerWeapon[1].bought;
	firstPlayerWeaponAmount[firstPlayerWeapon[2].name] = firstPlayerWeapon[2].bought
}




function renderWeaponCount(turn){
	if(turn === "first"){
		for(let i = 0; i < weaponToSelect.length; i++){
			weapon[i].querySelector(".amount").textContent = firstPlayerWeapon[i].bought;
			weaponToSelect[i].querySelector(".amount").textContent = firstPlayerWeapon[i].bought;
			
			if(firstPlayerWeapon[i].bought === 0){
				weaponToSelect[i].classList.add("-disabled");
			}
			else{
				weaponToSelect[i].classList.remove("-disabled");
			}
		}
		
	}
	else if(turn === "second"){
		for(let i = 0; i < weaponToSelect.length; i++){
			weapon[i].querySelector(".amount").textContent = secondPlayerWeapon[i].bought;
			weaponToSelect[i].querySelector(".amount").textContent = secondPlayerWeapon[i].bought;
			
			if(secondPlayerWeapon[i].bought === 0){
				weaponToSelect[i].classList.add("-disabled");
			}
			else{
				weaponToSelect[i].classList.remove("-disabled");
			}
		}
	}
}





function bot(){
	let cellToClick;
	let cellNumberToClick;

	///////////////////BOT_USING_WEAPON
	let botHasWeapon = false;
	let weaponNumberToSelect = 0;

	if(botMovesBeforeUsingWeapon == amountOfMovesToUseWeapon){
		botMovesBeforeUsingWeapon = 0;
		amountOfMovesToUseWeapon = Math.round(Math.random() * 15);
		for(let i = 0; i < secondPlayerWeapon.length; i++){
			if(secondPlayerWeapon[i].bought > 0){
				botHasWeapon = true;
				break;
			}
		}
		if(botHasWeapon){
			for(let i = 0; i < 20; i++){
				weaponNumberToSelect = Math.round(Math.random() * (secondPlayerWeapon.length - 1));
				if(parseInt(weaponToSelect[weaponNumberToSelect].getAttribute("amount")) > 0){
					weaponToSelect[weaponNumberToSelect].onclick();
					weaponShotPoint = cellNumberToAttack = arrayOfNumbersForPlayWithBot[Math.floor(Math.random() * arrayOfNumbersForPlayWithBot.length)];
					cellNumbersToRemove = [];
					weaponShotPointInput.value = cellNumberToAttack;
					botAttackPointsToRemove = selectedWeapon.attackArea;
						
					acceptWeaponShotPointButton.onclick();
					return;
				}
			}
		}
	}


	cellNumberToClick = arrayOfNumbersForPlayWithBot[Math.floor(Math.random() * arrayOfNumbersForPlayWithBot.length)];
	cellToClick = queryCellByNumber(firstPlayerField, cellNumberToClick);
	arrayOfNumbersForPlayWithBot.splice(arrayOfNumbersForPlayWithBot.indexOf(cellNumberToClick), 1);
	cellToClick.onclick();
	botMovesBeforeUsingWeapon += 1;
}







/*---Opening achievements---*/

function handleAchievementOpen(){
	let achievementCompletionIndicatorFillWidth;
	let playerAchievementCompletion;
	let countAnimationProgression;

	for(let i = 0; i < achievementsNamesAndCurrentValues.length; i++){
		if(this.getAttribute("achievementName") == achievementsNamesAndCurrentValues[i][0]){
			playerAchievementCompletion = (achievementsNamesAndCurrentValues[i][1] <= parseInt(this.getAttribute("target"))) ? achievementsNamesAndCurrentValues[i][1] : parseInt(this.getAttribute("target"));
			countAnimationProgression = playerAchievementCompletion / 20;

			achievementCompletionIndicatorFillWidth = parseFloat((achievementsNamesAndCurrentValues[i][1] / parseInt(this.getAttribute("target")) * 100).toFixed(2));
			achievementCompletionIndicatorFillWidth = (achievementCompletionIndicatorFillWidth <= 100) ? achievementCompletionIndicatorFillWidth : 100;
			break;
		}
	}
	achievementViewer.style.display = "flex";
	achievementViewer.querySelector(".achievementTitle").textContent = `${this.getAttribute("targetTitle")}`;
	achievementViewer.querySelector(".achievementTarget").textContent = `${this.getAttribute("target")}`;

	setTimeout(function(){
		achievementCompletionIndicatorFill.style.width = `${achievementCompletionIndicatorFillWidth}%`;
		for(let i = 1; i <= 20; i++){
			setTimeout(function(){
				achievementCompletionIndicatorText.textContent = `${(countAnimationProgression * i).toFixed(0)}/${this.getAttribute("target")}`;
			}.bind(this), 50 * i);
		}
	}.bind(this), 100);
}




/*---New Achievements checking---*/

function checkForNewAchievenents(achievementName, playerTotal){
	let selectedAchievements = playerAchievementsWindow.querySelectorAll(`[achievementName = "${achievementName}"]`);

	selectedAchievements.forEach(function(achievement){
		if(!achievement.getAttribute("completed") && playerTotal >= parseInt(achievement.getAttribute("target"))){
			achievement.style.background = "green";
			achievement.setAttribute("completed", "true");
			
			newAchievementNotification.innerHTML = `<p>Achievement</p><hr><p>${achievement.getAttribute("targetTitle")}: </p><p>${achievement.getAttribute("target")}</p><hr><p>Is completed</p>`;
			newAchievementNotification.style.display = "flex";
			setTimeout(function(){
				newAchievementNotification.style.opacity = "0";
				setTimeout(function(){
					newAchievementNotification.style.opacity = "1";
					newAchievementNotification.style.display = "none";
				}, 1500)
			}, 3000)
		}
	})
}




function updateAchievementsValues(){
	achievementsNamesAndCurrentValues = [["destroyShips", totalShipsDestroyed], ["useWeapon", totalWeaponUsed], ["earnMoney", totalMoneyEarned], ["spendMoney", totalMoneySpent], ["winGames", gamesWon]];
}



function endTheGame(){
	whooseTurn = "first";
	gameEndWindow.style.display = "none";
	selectGameModeMenu.style.display = "flex";
	selectGameModeMenu.style.width = "100%";
	gameFields.style.display = "none";
	firstPlayerField.style.display = "grid";
	firstPlayerField.style.pointerEvents = "initial";
	secondPlayerField.style.display = "none";
	passShipPlacingToSecondPlayer.style.display = "block";
	openWeaponSelectField.style.display = "initial";
	shipPlaceField.style.display = "flex";
	arrayOfNumbersForPlayWithBot = [];
	
	if(botIsPlaying){ //The game was with a bot, but not pvp
		saveUserData();
	}

	for(let i = 1; i <= 100; i++){
		arrayOfNumbersForPlayWithBot[arrayOfNumbersForPlayWithBot.length] = i;
	}

	shipsToPlace.forEach(function(ship){
		ship.setAttribute("amountOnTheField", "0");
		ship.setAttribute("turned", "false");
		ship.classList.remove("-disabled");
	});

	firstPlayerCells.forEach(function(cell){
		cell.removeAttribute("ship");
		cell.removeAttribute("occupied");
		cell.removeAttribute("destroyed");
		cell.removeAttribute("shipDestroyed");
		cell.removeAttribute("shipLength");
		cell.removeAttribute("id");
		cell.style.background = "var(--cellBackground)";
		cell.textContent = "";
		cell.style.animationName = "none";

		cell.onclick = function(){
			placingPoint = parseInt(cell.getAttribute("number"));
			placeShip(firstPlayerField, currentlySelectedShip, placingPoint);
		};
	})

	secondPlayerCells.forEach(function(cell){
		cell.removeAttribute("ship");
		cell.removeAttribute("occupied");
		cell.removeAttribute("destroyed");
		cell.removeAttribute("shipDestroyed");
		cell.removeAttribute("shipLength");
		cell.removeAttribute("id");
		cell.style.background = "var(--cellBackground)";
		cell.textContent = "";
		cell.style.animationName = "none";

		cell.onclick = function(){
			placingPoint = parseInt(cell.getAttribute("number"));
			placeShip(secondPlayerField, currentlySelectedShip, placingPoint);
		};
	})
}