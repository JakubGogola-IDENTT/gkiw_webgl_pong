//This file contains util functions to start WebGL.
const canvas = document.getElementById("c");
let gl = canvas.getContext("webgl");

const keyState = {
    up: false,
    down: false,
    w: false,
    s: false
};

document.addEventListener('keydown', function(e) {
    const keyName = e.key || e["keyIdentifier"];
    if (keyName === "ArrowUp") {
        keyState.up = true;
    }
    if (keyName === "ArrowDown") {
        keyState.down = true;
    }
    if (keyName === "w") {
        keyState.w = true;
    }
    if (keyName === "s") {
        keyState.s = true;
    }
});

document.addEventListener('keyup', function(e) {
    const keyName = e.key || e["keyIdentifier"];
    if (keyName === "ArrowUp") {
        keyState.up = false;
    }
    if (keyName === "ArrowDown") {
        keyState.down = false;
    }
    if (keyName === "w") {
        keyState.w = false;
    }
    if (keyName === "s") {
        keyState.s = false;
    }
});


let leftPlayerScore = 0;
let righetPlayerScore = 0;

//Background elements.
const background = {
    translation: [0, 0, 2],
    width: gl.canvas.clientWidth,
    height: gl.canvas.clientHeight,
    color: [0, 0, 0, 0.8]
};

const playground = {
    translation: [125, 0, 1],
    width: gl.canvas.clientWidth - 250,
    height: gl.canvas.clientHeight,
    color: [0, 0, 0, 0.6]
};

const middleLine = {
    translation: [gl.canvas.clientWidth / 2, 0, 1.5],
    width: 3,
    height: gl.canvas.clientHeight,
    color: [1, 1, 1, 1]
};

//Ball
const ball = {
    translation: [gl.canvas.clientWidth / 2, 0, 1],
    width: 20,
    height: 20,
    color: [1, 1, 1, 1],
    dX: 2,
    dY: 2
};


//Players
const leftPlayer = {
    translation: [127, 0, 1],
    width: 20,
    height: 95,
    color: [0, 0, 1, 1]
};

const rightPlayer = {
    translation: [gl.canvas.clientWidth - 147, 0, 1],
    width: 20,
    height: 95,
    color: [0, 0, 1, 1]
};

const players = [leftPlayer, rightPlayer];

const m4 = {
    projection: function (width, height, depth) {
        return [
            2 / width, 0, 0, 0,
            0, -2 / height, 0, 0,
            0, 0, 2 / depth, 0,
            -1, 1, 0, 1,
        ];
    },

    translation: function (tx, ty, tz) {
        return [
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            tx, ty, tz, 1,
        ];
    },

    multiply: function (a, b) {
        const a00 = a[0 * 4 + 0];
        const a01 = a[0 * 4 + 1];
        const a02 = a[0 * 4 + 2];
        const a03 = a[0 * 4 + 3];
        const a10 = a[1 * 4 + 0];
        const a11 = a[1 * 4 + 1];
        const a12 = a[1 * 4 + 2];
        const a13 = a[1 * 4 + 3];
        const a20 = a[2 * 4 + 0];
        const a21 = a[2 * 4 + 1];
        const a22 = a[2 * 4 + 2];
        const a23 = a[2 * 4 + 3];
        const a30 = a[3 * 4 + 0];
        const a31 = a[3 * 4 + 1];
        const a32 = a[3 * 4 + 2];
        const a33 = a[3 * 4 + 3];
        const b00 = b[0 * 4 + 0];
        const b01 = b[0 * 4 + 1];
        const b02 = b[0 * 4 + 2];
        const b03 = b[0 * 4 + 3];
        const b10 = b[1 * 4 + 0];
        const b11 = b[1 * 4 + 1];
        const b12 = b[1 * 4 + 2];
        const b13 = b[1 * 4 + 3];
        const b20 = b[2 * 4 + 0];
        const b21 = b[2 * 4 + 1];
        const b22 = b[2 * 4 + 2];
        const b23 = b[2 * 4 + 3];
        const b30 = b[3 * 4 + 0];
        const b31 = b[3 * 4 + 1];
        const b32 = b[3 * 4 + 2];
        const b33 = b[3 * 4 + 3];
        return [
            b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30,
            b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31,
            b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32,
            b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33,
            b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30,
            b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31,
            b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32,
            b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33,
            b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30,
            b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31,
            b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32,
            b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33,
            b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30,
            b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31,
            b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32,
            b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33,
        ];
    },

    translate: function (m, tx, ty, tz) {
        return m4.multiply(m, m4.translation(tx, ty, tz));
    },
};

function resizeCanvas(canvas) {
    const displayWidth = canvas.clientWidth;
    const displayHeight = canvas.clientHeight;

    if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
        canvas.width = displayWidth;
        canvas.height = displayHeight;
    }
}

function compileShader(gl, shaderSource, shaderType) {
    //Create the shader object.
    const shader = gl.createShader(shaderType);

    //Set the shader source code.
    gl.shaderSource(shader, shaderSource);

    //Compile the shader.
    gl.compileShader(shader);

    let success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (!success) {
        throw "Couldn't compile shader: " + gl.getShaderInfoLog(shader);
    }

    return shader;
}

//Creating program for GPU.
function createProgram(gl, vertexShader, fragmentShader) {
    //Create a program.
    const program = gl.createProgram();

    //Attach the shaders.
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);

    //Link the program.
    gl.linkProgram(program);

    //Check if it is linked.
    let success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (!success) {
        throw ("Program failed to link: ") + gl.getProgramInfoLog(program);
    }

    return program;
}

function createShadersFromScript(gl, scriptId, opt_shaderType) {
    //Look up the script tag by id.
    let shaderScript = document.getElementById(scriptId);
    if (!shaderScript) {
        throw ("*** Error: unknown script element: ") + scriptId;
    }

    //Extract the contents of the script tag.
    const shaderSource = shaderScript.text;

    //If we didn't pass in type, use 'type' from the script tag.
    if(!opt_shaderType) {
        if (shaderScript.type === "x-shader/x-vertex") {
            opt_shaderType = gl.VERTEX_SHADER;
        } else if (shaderScript.type === "x-shader/x-fragment") {
            opt_shaderType = gl.FRAGMENT_SHADER;
        } else if (!opt_shaderType) {
            throw ("*** Error: shader type not set")
        }
    }

    return compileShader(gl, shaderSource, opt_shaderType);
}

function createProgramFromScripts(gl, shaderScriptIds) {
    const vertexShader = createShadersFromScript(gl, shaderScriptIds[0], gl.VERTEX_SHADER);
    const fragmentShader = createShadersFromScript(gl, shaderScriptIds[1], gl.FRAGMENT_SHADER);

    return createProgram(gl, vertexShader, fragmentShader);
}

function setRectangle(gl, x, y, width, height) {
    const x1 = x;
    const x2 = x + width;
    const y1 = y;
    const y2 = y + height;

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        x1, y1, 0,
        x2, y1, 0,
        x1, y2, 0,
        x1, y2, 0,
        x2, y1, 0,
        x2, y2, 0,
    ]), gl.STATIC_DRAW);
}

function initBall() {
    ball.translation[0] = gl.canvas.clientWidth / 2;
    ball.translation[1] = gl.canvas.clientHeight / 2 - 100;
    ball.dX = 3;
    ball.dY = 3;
}

function checkColision(player) {
    const leftBall = ball.translation[0];
    const rightBall = ball.translation[0] + ball.width;
    const topBall = ball.translation[1];
    const bottomBall = ball.translation[1] + ball.height;

    const leftPlayer = player.translation[0];
    const rightPlayer = player.translation[0] + player.width;
    const topPlayer = player.translation[1];
    const bottomPlayer = player.translation[1] + player.height;

    if (leftBall > rightPlayer) {
        return false;
    } else if (rightBall < leftPlayer) {
        return false;
    } else if (topBall > bottomPlayer) {
        return false;
    } else if (bottomBall < topPlayer) {
        return false;
    }

    return true;
}

function moveBall() {
    //Move ball.
    ball.translation[0] += ball.dX;
    ball.translation[1] += ball.dY;

    //Ball is out of playground.
    if(ball.translation[0] < playground.translation[0] - 50) {
        leftPlayerScore += 1;
        initBall();
    } else if (ball.translation[0] > playground.translation[0] + playground.width + 50) {
        righetPlayerScore += 1;
        initBall();
    }

    //Ball hit top or bottom edge of playground.
    if (ball.translation[1] < 0 || ball.translation[1] > playground.height - 20) {
        console.log("Before: " + ball.dY);
        ball.dY = - ball.dY;
        console.log("After: " + ball.dY);
        return;
    }

    for (let i = 0; i < 2; i++) {

       if (checkColision(players[i])) {
            if (ball.dX < 0) {
                ball.dX -= 1;
            } else {
                ball.dX += 1;
            }

            ball.dX = -ball.dX;

           const hitPosition = (players[i].translation[1] + players[1].height) - ball.translation[1];

           if (hitPosition >= 0 && hitPosition <= 10) {
                ball.dY = 4;
            } else if (hitPosition >= 10 && hitPosition < 20) {
                ball.dY = 3;
            } else if (hitPosition >= 20 && hitPosition < 30) {
                ball.dY = 2;
            } else if (hitPosition >= 30 && hitPosition < 40) {
                ball.dY = 1;
            } else if (hitPosition >= 40 && hitPosition < 55) {
                ball.dY = 0;
            } else if (hitPosition >= 55 && hitPosition < 65) {
                ball.dY = -1;
            } else if (hitPosition >= 65 && hitPosition < 75) {
                ball.dY = -2;
            } else if (hitPosition >= 75 && hitPosition < 85) {
                ball.dY = -3;
            } else if (hitPosition >= 85 && hitPosition < 95) {
                ball.dY = -4;
            }
       }

    }
}

//Redraw scene.
function drawScene(gl, program, positionAttributeLocation, positionBuffer, translation, width, height,
                   resolutionUniformLocation, colorUniformLocation, matrixUniformLocation, color, primitiveInfo) {
    resizeCanvas(gl.canvas);

    //Tell WebGL how to convert from clip space to pixels.
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    //Clear the canvas.
    //gl.clear(gl.COLOR_BUFFER_BIT);

    //Tell it to use our program (pair of shaders).
    gl.useProgram(program);

    //Turn on the attribute.
    gl.enableVertexAttribArray(positionAttributeLocation);

    //Bind the position buffer.
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);


    const primitiveType = primitiveInfo.primitive;
    const count = primitiveInfo.count;

    setRectangle(gl, translation[0], translation[1], width, height);

    //Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER).
    const size = 3; //2 components per iteration.
    const type = gl.FLOAT; //The data is 32bit floats.
    const normalize = false; //Don't normalize the data.
    const stride = 0; //0 = move forward size * sizeof(type) each iteration to get position.
    const offset = 0; //Start at the beginning of the buffer.
    gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);

    //Set the resolution.
    gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);

    //Set the color.
    gl.uniform4fv(colorUniformLocation, color);

    const matrix = m4.projection(gl.canvas.clientWidth, gl.canvas.clientHeight, 400);

    gl.uniformMatrix4fv(matrixUniformLocation, false, matrix);

    gl.drawArrays(primitiveType, offset, count);
}

//Starting WebGL.
function main() {
    //Check if WebGL is supported in user's browser.
    if (!gl) {
        console.log("Your browser doesn't support WebGL!");
        return;
    }

    const idOfVertexShaderScript = "2d-vertex-shader";
    const idOfFragmentShaderScript = "2d-fragment-shader";

    const program = createProgramFromScripts(gl, [idOfVertexShaderScript, idOfFragmentShaderScript]);

    const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
    const resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");
    const matrixUniformLocation = gl.getUniformLocation(program, "u_matrix");
    const colorUniformLocation = gl.getUniformLocation(program, "u_color");
    const positionBuffer = gl.createBuffer();

    const primitiveInfo = {name: "TRIANGLES", primitive: gl.TRIANGLES, count: 6};

    gl.clear(gl.COLOR_BUFFER_BIT);

    moveBall();

    //Drawing background.
    drawScene(gl, program, positionAttributeLocation, positionBuffer, background.translation, background.width, background.height,
            resolutionUniformLocation, colorUniformLocation, matrixUniformLocation, background.color, primitiveInfo);

    drawScene(gl, program, positionAttributeLocation, positionBuffer, playground.translation, playground.width, playground.height,
        resolutionUniformLocation, colorUniformLocation, matrixUniformLocation, playground.color, primitiveInfo);

    drawScene(gl, program, positionAttributeLocation, positionBuffer, middleLine.translation, middleLine.width, middleLine.height,
        resolutionUniformLocation, colorUniformLocation, matrixUniformLocation, middleLine.color, primitiveInfo);

    //Drawing players.
    if (keyState.w && leftPlayer.translation[1] > 0) {
        leftPlayer.translation[1] -= 10;
        console.log(leftPlayer.translation);
    }
    if (keyState.s && leftPlayer.translation[1] < playground.height - 100) {
        leftPlayer.translation[1] += 10;
        console.log(leftPlayer.translation);
    }
    if (keyState.up && rightPlayer.translation[1] > 0) {
        rightPlayer.translation[1] -= 10;
        console.log(rightPlayer.translation);
    }
    if (keyState.down && rightPlayer.translation[1] < playground.height - 100) {
        rightPlayer.translation[1] += 10;
        console.log(rightPlayer.translation);
    }
    drawScene(gl, program, positionAttributeLocation, positionBuffer, leftPlayer.translation, leftPlayer.width, leftPlayer.height,
        resolutionUniformLocation, colorUniformLocation, matrixUniformLocation, leftPlayer.color, primitiveInfo);

    drawScene(gl, program, positionAttributeLocation, positionBuffer, rightPlayer.translation, rightPlayer.width, rightPlayer.height,
        resolutionUniformLocation, colorUniformLocation, matrixUniformLocation, rightPlayer.color, primitiveInfo);

    drawScene(gl, program, positionAttributeLocation, positionBuffer, ball.translation, ball.width, ball.height,
        resolutionUniformLocation, colorUniformLocation, matrixUniformLocation, ball.color, primitiveInfo);

    window.requestAnimationFrame(main);
}

initBall();
window.requestAnimationFrame(main);




