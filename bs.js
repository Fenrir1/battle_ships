/*  Copyright Fenrir, 2015 
 * ----------------------------------------------------------------------
 *
 * The simple "Battle ship" game!
 *
 * Feel free to use this script under the terms of the GNU Lesser General
 * Public License, as long as you do not remove or alter this notice.
 */
 
//--PUBLIC VARIABLES----------------------------------------
var frameLetter = ["А","Б","В","Г","Д","Е","Ж","З","И","К"];

var firstmap = [
	[0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0]
	];
	
var secondmap = [
	[1,0,1,0,1,0,1,0,0,0],
	[0,0,0,0,0,0,0,0,0,0],
	[0,1,1,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,1],
	[0,0,0,0,0,0,0,0,0,1],
	[0,1,1,0,0,0,0,0,0,1],
	[0,0,0,0,0,0,0,0,0,1],
	[0,1,1,1,0,0,0,0,0,0],
	[0,0,0,0,0,1,1,1,0,0]
	];
	
var myShips = [
	{ power:1, hits:0, status: 1, cels: ""},
	{ power:1, hits:0, status: 1, cels: ""},
	{ power:1, hits:0, status: 1, cels: ""},
	{ power:1, hits:0, status: 1, cels: ""},
	{ power:2, hits:0, status: 1, cels: ""},
	{ power:2, hits:0, status: 1, cels: ""},
	{ power:2, hits:0, status: 1, cels: ""},
	{ power:3, hits:0, status: 1, cels: ""},
	{ power:3, hits:0, status: 1, cels: ""},
	{ power:4, hits:0, status: 1, cels: ""}	
	];	
	
var oppShips = [
	{ power:1, hits:0, status: 1, cels: ""},
	{ power:1, hits:0, status: 1, cels: ""},
	{ power:1, hits:0, status: 1, cels: ""},
	{ power:1, hits:0, status: 1, cels: ""},
	{ power:2, hits:0, status: 1, cels: ""},
	{ power:2, hits:0, status: 1, cels: ""},
	{ power:2, hits:0, status: 1, cels: ""},
	{ power:3, hits:0, status: 1, cels: ""},
	{ power:3, hits:0, status: 1, cels: ""},
	{ power:4, hits:0, status: 1, cels: ""}	
	];
	
/*var possibleShapes = [
	"0,0;",
	"0,0;1,0;" "0,0;0,1;",
	"0,0;1,0;0,1;" "0,0;0,1;1,0;" "0,0;1,0;2,0;" "0,0;0,1;0,2;",
	"0,0;1,0;0,1;" "0,0;0,1;1,0;" "0,0;1,0;2,0;3,0;" "0,0;0,1;0,2;0,3;",
	];*/
	
var oppIllegalCels="";
var oppHuntMoves=[];
var isOppHunting=false;

var mapSize=10;
var cellSize=50;

var userName="Аноним";
var oppName="Копьютер";
var isOver=false;

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function cleanMap(map) {
	for(var i = 0; i < mapSize; i++) 
		for(var j = 0; j < mapSize; j++) 
			map[i][j]=0;
}

function cleanShips(ships) {
	for(var i = 0; i < ships.length; i++) {
		ships[i].cels=""; 
		ships[i].status=1;
		ships[i].hits=0;
	}
}

function cleanMaps() {
	cleanMap(firstmap);
	cleanMap(secondmap);
	
	cleanShips(myShips);
	cleanShips(oppShips);
}

/* number of ship of current size is Ships array */
function  getShipId(size,number) {
	if (size==1) return 0+number;
	if (size==2) return 4+number;
	if (size==3) return 7+number;
	if (size==4) return 9;
}
/* chek if possible to place horizontal or vertical ship bigining in set position */
function  isPossible(size, isHoriz, row, col, map) {
    if(!isHoriz) {
	    if (col+size>(mapSize-1)) return false; //just in case
        for(var i = Math.max(0,row-1); i <= Math.min((mapSize-1),row+1); i++)
            for(var j = Math.max(0,col-1); j <= Math.min((mapSize-1),col+size); j++) {
                if((map==1)&&(firstmap[i][j] == 1))  return false;
				if((map==2)&&(secondmap[i][j] == 1)) return false;
            }        
        return  true;
    }
    else {
	    if (row+size>(mapSize-1)) return false; //just in case
        for(var i = Math.max(0,row-1); i <= Math.min((mapSize-1),row+size); i++) 
            for(var j = Math.max(0,col-1); j <= Math.min((mapSize-1),col+1); j++)  {
				if((map==1)&&(firstmap[i][j] == 1)) return false;
				if((map==2)&&(secondmap[i][j] == 1)) return false;
            }        
        return  true;
    }
}
/* place vertical or horizontal ship of set size in map(1-your, 2 -opp) at random position */
/* number - to fill Ships array */
function  setRndShip(size,number,map) {
	var isHoriz = Math.random() >= 0.5;
    var row   = getRandomInt(0,mapSize);
    var col  = getRandomInt(0,mapSize);
	
	while (!isPossible(size, isHoriz, row, col, map)) {
		if (isHoriz) {row = getRandomInt(0,mapSize-size+1); col = getRandomInt(0,mapSize);}
		else {row = getRandomInt(0,mapSize); col = getRandomInt(0,mapSize-size+1);}
	}
    
    if (!isHoriz) {
        for(var j = col; j < col + size; j++) 
			if (map==1) {
				firstmap[row][j] = 1;
				myShips[getShipId(size,number)].cels+=row+","+j+";";
			}
			else {
				secondmap[row][j] = 1;
				oppShips[getShipId(size,number)].cels+=row+","+j+";";
			}
		}
    else {
        for(var i = row; i < row + size; i++)
			if (map==1) {
				firstmap[i][col] = 1;
				myShips[getShipId(size,number)].cels+=i+","+col+";";
			}
			else {
				secondmap[i][col] = 1;
				oppShips[getShipId(size,number)].cels+=i+","+col+";";
			}
    }
}
/* fill map(1-your, 2 -opp) with ships */
function  setRndShips(map)	{
    for(var i = 0; i < 1; i++) setRndShip(4,i,map);
    for(var i = 0; i < 2; i++) setRndShip(3,i,map);
    for(var i = 0; i < 3; i++) setRndShip(2,i,map);
    for(var i = 0; i < 4; i++) setRndShip(1,i,map);
}

function checkVictory() {
	var victory = true; 
	for(var i = 0; i < 10; i++) 
		if (oppShips[i].status==1) victory = false;
	if (victory) {showMessage(userName+" победил! <button class='startGame' onClick='startGame();' >Играть</button>"); isOver=true; }
	
	victory = true;
	for(var i = 0; i < 10; i++) 
		if (myShips[i].status==1) victory = false;
	if (victory) {showMessage(oppName+" победил! <button class='startGame' onClick='startGame();' >Играть</button>"); isOver=true; }
}
/*  if ship is dead */
function checkShip(x,y,map) {
    if (map==1) {
		for(var i = 0; i < myShips.length; i++) {
			if (~myShips[i].cels.indexOf(x+","+y+";")) {
				myShips[i].hits += 1;
				if (myShips[i].hits>=myShips[i].power) {
					myShips[i].status=0;
					markDeadShip(myShips[i].cels,map);
				}
				break;
			}
		} 	
	}
	else {
		for(var i = 0; i < oppShips.length; i++) {
			if (~oppShips[i].cels.indexOf(x+","+y+";")) {
				oppShips[i].hits += 1;
				if (oppShips[i].hits>=oppShips[i].power) {
					oppShips[i].status=0;
					markDeadShip(oppShips[i].cels,map);
				}
				break;
			}
		} 
	}
}

function markDeadShip(listCels,map) {
	var deadCels = listCels.split(';');
	for(var i = 0; i < deadCels.length-1; i++) {
		var deadCel = deadCels[i].split(',');
		if (map==1) firstmap[deadCel[0]][deadCel[1]]=4;
		else secondmap[deadCel[0]][deadCel[1]]=4;
	}
}
/* check if this cel is legal for shot */
function isIllegalCels(x,y) {
	if (~oppIllegalCels.indexOf(x+","+y+";")) return true;
	return false;		
}
/* add cel where is no ship */
function addIllegalCel(x,y) {
	if (!~oppIllegalCels.indexOf(x+","+y+";")) 
		oppIllegalCels+=x+","+y+";";
}
/* get cels of the dead ship */
function getIllegalCels(x,y) {
	for(var i = 0; i < myShips.length; i++) {
			if (~myShips[i].cels.indexOf(x+","+y+";")) {
				getIllegalCelsStr(myShips[i].cels);
				break;
				}
			}
}
/* if the ship is dead then mark all cels around it as illegal tagets */
function getIllegalCelsStr(listCels) {
	var deadCels = listCels.split(';');
	for(var i = 0; i < deadCels.length-1; i++) {
		var deadCel = deadCels[i].split(',');
		    for(var t = Math.max(0,parseInt(deadCel[0], mapSize)-1); t <= Math.min(mapSize-1,parseInt(deadCel[0], mapSize)+1); t++)
            for(var j = Math.max(0,parseInt(deadCel[1], mapSize)-1); j <= Math.min(mapSize-1,parseInt(deadCel[1], mapSize)+1); j++) {
				addIllegalCel(t,j);
            }   
	}
}
/* if opponent hit(not killed) ship he will hunt in bordered area of hit position*/
function oppAddHuntMoves(x,y) {
	var tX=x;
	var tY=y;
	var countX=0;
	var countY=0;
	oppHuntMoves.splice(0,oppHuntMoves.length);
		
	for(var i = Math.max(0,x-1); i <= Math.min(mapSize-1,x+1); i++) if (firstmap[i][y] == 2) countX++;
	for(var j = Math.max(0,y-1); j <= Math.min(mapSize-1,y+1); j++) if (firstmap[x][j] == 2) countY++;
	if (countX>1) {
	        tX=x;
			while ((tX>=0)&&(firstmap[tX][y]==2)) tX-=1;
			if ((tX>=0)&&(tX!=x)&&(!isIllegalCels(tX,y))) { oppHuntMoves.push([tX,y]); }
			tX=x;
			while ((tX<mapSize)&&(firstmap[tX][y]==2)) tX+=1;
			if ((tX<mapSize)&&(tX!=x)&&(!isIllegalCels(tX,y))) { oppHuntMoves.push([tX,y]); }
	}
	if (countY>1) {
	        tY=y-1;
			while ((tY>=0)&&(firstmap[x][tY]==2)) tY=tY-1;
			if ((tY>=0)&&(tY!=y)&&(!isIllegalCels(x,tY))) oppHuntMoves.push([x,tY]);
			tY=y+1;
			while ((tY<mapSize)&&(firstmap[x][tY]==2)) tY=tY+1;
			if ((tY<mapSize)&&(tY!=y)&&(!isIllegalCels(x,tY))) oppHuntMoves.push([x,tY]);
	}
	if ((countX==1)&&(countY==1)) {
		if ((x-1>=0)&&(!isIllegalCels(x-1,y))) oppHuntMoves.push([x-1,y]);
		if ((x+1<mapSize)&&(!isIllegalCels(x+1,y))) oppHuntMoves.push([x+1,y]);
		if ((y+1<mapSize)&&(!isIllegalCels(x,y+1))) oppHuntMoves.push([x,y+1]);
		if ((y-1>=0)&&(!isIllegalCels(x,y-1))) oppHuntMoves.push([x,y-1]);
	}
}
/* Opponent's move */
function oppMove() {
	var x,y;
	
	if (isOppHunting) {
		var h=getRandomInt(0,oppHuntMoves.length);
		x=oppHuntMoves[h][0];
		y=oppHuntMoves[h][1];
		oppHuntMoves.splice(h,1);
	}
	else {
		x=getRandomInt(0,mapSize);
		y=getRandomInt(0,mapSize);
		while (isIllegalCels(x,y)) {
			x=getRandomInt(0,mapSize);
			y=getRandomInt(0,mapSize);
		}
	}
	
	if (firstmap[x][y]==0) {  // MISS
			firstmap[x][y]=3;
			drawMap(firstmap,'yourField',0);
			addIllegalCel(x,y);
			showMessage(oppName+" промахнулся. Ваш ход!");
		}
	if (firstmap[x][y]==1) // HIT
		{
			firstmap[x][y]=2;
			checkShip(x,y,1);
			drawMap(firstmap,'yourField',0);
			checkVictory();
			if (firstmap[x][y]==2) { // JUST HIT
				isOppHunting=true;
				oppAddHuntMoves(x,y);
				showMessage(oppName+" ранил...");
			}
			else {                  // KILL
				addIllegalCel(x,y);
				getIllegalCels(x,y);
				oppHuntMoves = [];
				isOppHunting=false;
				if (!isOver) 
					showMessage(oppName+" убил...")
				else
					drawMap(secondmap,'oppFeild',0);
			}
			if (!isOver) oppMove();
		}
	
}
/* Your move */
function yourMove(evt) {
	var x,y;
	var canvas = document.getElementById('oppFeild');
	var rect = canvas.getBoundingClientRect();
	e = evt || window.event;
    x=e.clientX - rect.left - 50;
    y=e.clientY - rect.top - 50;
	x=Math.floor(x/50);
	y=Math.floor(y/50);
	
	if (secondmap[x][y]==0) { // MISS
			secondmap[x][y]=3;
			drawMap(secondmap,'oppFeild',1);
			showMessage(userName+" промахнулся. Ход "+oppName);
			if (!isOver) oppMove();
		}
	if (secondmap[x][y]==1) { // HIT
		secondmap[x][y]=2;
		checkShip(x,y,2);
		drawMap(secondmap,'oppFeild',1);
		checkVictory();
		if (secondmap[x][y]==2) // JUST HIT
			showMessage(userName+" ранил. Ваш ход...");
		else                    // KILL
			if (!isOver) showMessage(userName+" убил! Ваш ход...");
	}
	
}

function drawCell(posX,posY,stat,filedId,hideShips) {
	var canvas = document.getElementById(filedId);
    var context = canvas.getContext('2d');
	
	if ((stat==0)||((hideShips==1)&&(stat==1))) { //empty
			context.beginPath();
			context.rect(posX*50+50, posY*50+50, 50, 50);
			context.fillStyle = 'white';
			context.fill();
			context.lineWidth = 3;
			context.strokeStyle = '#20AFC1';
			context.stroke();
			context.closePath();
		}
	if ((hideShips==0)&&(stat==1)) { //ship
			context.beginPath();
			context.rect(posX*50+50, posY*50+50, 50, 50);
			context.fillStyle = 'white';
			context.strokeStyle = '#040D30';
			context.fill();
			context.stroke();
			context.closePath();
		}
	if (stat==2) { //hit
			context.beginPath();
			context.moveTo(posX*50+50, posY*50+50);
			context.lineTo(posX*50+50+50, posY*50+50+50);
			context.lineWidth = 3;
			context.strokeStyle = '#115FCE';
			context.stroke();
			context.closePath();
			context.beginPath();
			context.moveTo(posX*50+50, posY*50+50+50);
			context.lineTo(posX*50+50+50,posY*50+50);
			context.lineWidth = 3;
			context.strokeStyle = '#115FCE';
			context.stroke();
			context.closePath();
		}
	if (stat==3) { //missed
			context.beginPath();
			context.arc(posX*50+25+50, posY*50+25+50, 2, 0, 2 * Math.PI, false);
			context.fillStyle = '#20AFC1';
			context.fill();
			context.closePath();
		}
	if (stat==4) { //killed 
			context.beginPath();
			context.rect(posX*50+50, posY*50+50, 50, 50);
			context.fillStyle = 'white';
			context.strokeStyle = '#ff0000';
			context.fill();
			context.stroke();
			context.closePath();
			context.beginPath();
			context.moveTo(posX*50+50, posY*50+50);
			context.lineTo(posX*50+50+50, posY*50+50+50);
			context.lineWidth = 3;
			context.strokeStyle = '#ff0000';
			context.stroke();
			context.closePath();
			context.beginPath();
			context.moveTo(posX*50+50, posY*50+50+50);
			context.lineTo(posX*50+50+50,posY*50+50);
			context.lineWidth = 3;
			context.strokeStyle = '#ff0000';
			context.stroke();
			context.closePath();
		}
	
}

function drawFrame(filedId) {
	var canvas = document.getElementById(filedId);
    var context = canvas.getContext('2d');
	for(var i = 1; i <= 10; i++) {
		context.fillStyle = "#0C418C";
		context.font = "normal 24pt Arial";
		context.fillText(frameLetter[i-1], 18, i*50+50-8);
		context.fillText(i, i*50+8,50-5);
	}
}

function drawMap(map,filedId,hideShips) {
	var canvas = document.getElementById(filedId);
    var context = canvas.getContext('2d');
	var i,j;
	
	for(var i = 0; i < mapSize; i++) 
		for(var j = 0; j < mapSize; j++) {
		  if (map[i][j]==0)	drawCell(i,j,map[i][j],filedId,hideShips);
		}
	
	for(var i = 0; i < mapSize; i++) 
		for(var j = 0; j < mapSize; j++) {
		  if (map[i][j]!=0)	drawCell(i,j,map[i][j],filedId,hideShips);
		}
}

function showMessage(mess) {
	$("#outputDiv").html(mess);
}

function startGame(name) {
	if (typeof name != "undefined") 
	 if (name != "") userName=name;
	isOver=false;
	oppIllegalCels="";
    oppHuntMoves=[];
    isOppHunting=false;
	
	cleanMaps();
	setRndShips(1);
	setRndShips(2);
	
	$("#loginDiv").hide();
	$("#outputDiv").show();
	showMessage("Приветствую "+userName+". Ваш ход...");
	
	drawFrame('yourField'); 	
	drawFrame('oppFeild'); 
	drawMap(firstmap,'yourField',0);
	drawMap(secondmap,'oppFeild',1);
	
	document.getElementById('oppFeild').onclick = function (e) {
		if (!isOver) yourMove(e);
	}
}
