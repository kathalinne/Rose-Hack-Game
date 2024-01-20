// Since this example code uses the p5 collide2d library, be sure to remind
// students to load it in. Model how to do this by either connecting a local
// copy (included in the templates), connecting a hosted copy through a CDN, or
// (as a last resort) by pasting it in its entirety in this script as the first
// line.
/* global createCanvas, colorMode, HSB, width, height, random, background, fill, noFill, color, random,
          rect, ellipse, stroke, image, loadImage, frameRate, collideRectRect, collideRectCircle, text,
          mouseX, mouseY, strokeWeight, line, mouseIsPressed, windowWidth, windowHeight, noStroke,
          keyCode, UP_ARROW, LEFT_ARROW, RIGHT_ARROW, DOWN_ARROW, textSize, noLoop, loop, round */

          let backgroundColor, playerSnake, currentApple, score;

          function setup() {
            // Canvas & color settings
            width = 400;
            height = 400;
            createCanvas(width, height);
            colorMode(HSB, 360, 100, 100);
            backgroundColor = 95;
            frameRate(12);
          
            playerSnake = new Snake();
            currentApple = new Apple();
            score = 0;
          }
          
          function draw() {
            background(backgroundColor);
            // The snake performs the following four methods:
            playerSnake.moveSelf();
            playerSnake.showSelf();
          
            playerSnake.checkCollisions();
            playerSnake.checkApples();
            // The apple needs fewer methods to show up on screen.
            currentApple.showSelf();
            // We put the score in its own function for readability.
            displayScore();
          }
          
          function displayScore() {
            text(`Score: ${score}`, 20, 20);
          }
          
          class Snake {
            constructor() {
              this.size = 10;
              this.x = width / 2;
              this.y = height - 10;
              this.direction = "N";
              this.speed = 12;
          
              this.tail = [new TailSegment(this.x, this.y)];
            }
          
            moveSelf() {
              if (this.direction === "N") {
                this.y -= this.speed;
              } else if (this.direction === "S") {
                this.y += this.speed;
              } else if (this.direction === "E") {
                this.x += this.speed;
              } else if (this.direction === "W") {
                this.x -= this.speed;
              } else {
                console.log("Error: invalid direction");
              }
              this.tail.unshift(new TailSegment(this.x, this.y));
              this.tail.pop();
            }
          
            showSelf() {
              if (this.y <= 0) {
                this.y = height;
              } else if (this.y >= height) {
                this.y = 0;
              }
              if (this.x <= 0) {
                this.x = width;
              } else if (this.x >= width) {
                this.x = 0;
              }
          
              for (let i = 0; i < this.tail.length; i++) {
                let segment = this.tail[i];
                segment.showSelf();
              }
            }
          
            checkApples() {
              if (
                collideRectCircle(
                  this.x,
                  this.y,
                  this.size,
                  this.size,
                  currentApple.x,
                  currentApple.y,
                  currentApple.size
                )
              ) {
                score += 1;
                currentApple = new Apple();
                this.extendTail();
              }
            }
          
            checkCollisions() {
              // head of the snake touches ANY part of the snake.
              if (this.tail.length <= 2) {
                return;
              }
              for (let i = 1; i < this.tail.length; i++) {
                let tailSegment = this.tail[i];
                if (
                  collideRectRect(
                    this.x,
                    this.y,
                    this.size,
                    this.size,
                    tailSegment.x,
                    tailSegment.y,
                    tailSegment.size,
                    tailSegment.size
                  )
                ) {
                  gameOver();
                }
              }
            }
          
            extendTail() {
              // Create a new TailSegment at the end of the snake.
              // this.tail.push(new TailSegment(this.x, this.y));
              let lastSegment = this.tail[this.tail.length - 1];
              let x = lastSegment.x + lastSegment.size;
              let y = lastSegment.y + lastSegment.size;
              this.tail.push(new TailSegment(lastSegment.x, lastSegment.y));
            }
          }
          
          class Apple {
            constructor() {
              this.x = random(10, width - 10);
              this.y = random(10, height - 10);
              this.size = 10;
            }
          
            showSelf() {
              fill("red");
              ellipse(this.x, this.y, this.size);
            }
          }
          
          class TailSegment {
            constructor(x, y) {
              this.x = x;
              this.y = y;
              this.size = 10;
            }
            showSelf() {
              fill("blue");
              rect(this.x, this.y, this.size, this.size);
            }
          }
          
          function keyPressed() {
            console.log("key pressed: ", keyCode);
            if (keyCode === UP_ARROW && playerSnake.direction != "S") {
              playerSnake.direction = "N";
            } else if (keyCode === DOWN_ARROW && playerSnake.direction != "N") {
              playerSnake.direction = "S";
            } else if (keyCode === RIGHT_ARROW && playerSnake.direction != "W") {
              playerSnake.direction = "E";
            } else if (keyCode === LEFT_ARROW && playerSnake.direction != "E") {
              playerSnake.direction = "W";
            } else {
              console.log("wrong key");
            }
          }
          
          function restartGame() {
            score = 0;
            playerSnake = new Snake();
            currentApple = new Apple();
          
            // Resume draw loop
            loop();
          }
          
          function gameOver() {
            console.log("GAME OVER!");
            stroke(0);
            text("GAME OVER", 50, 50);
          
            // Pause draw loop
            noLoop();
          }
          