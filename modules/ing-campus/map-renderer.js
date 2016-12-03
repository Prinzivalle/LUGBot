'use strict';

const Canvas = require('canvas');
const settings = require('../../etc/ing-campus-maps');

const blockW = settings.blockW;
const blockH = settings.blockH;
const space = settings.space;
const bColor = settings.bColor;
const cColor = settings.cColor;
const busyColor = settings.busyColor;
const freeColor = settings.freeColor;

/**
 * Generate a canvas that represent the lab map
 * @param {(number|string)[][]} matrix
 * @param {string} statuses
 * @return {Canvas} a canvas that represent the lab map
 */
exports.generateCanvas = function generateCanvas(matrix, statuses) {
  const nX = matrix[0].length;
  const nY = matrix.length;

  const canvas = new Canvas(nX * (blockW + space) - space, nY * (blockH + space) - space);
  const ctx = canvas.getContext('2d');

  ctx.font = settings.font;

  let i = 0;
  for (let y = 0; y < nY; y++) {
    for (let x = 0; x < nX; x++) {

      const pc = matrix[y][x];
      if (pc == 'c') {
        drawPc(ctx, pc, x, y, false);
      } else if (pc != 0) {
        const status = statuses.charAt(i++);
        drawPc(ctx, pc, x, y, status == '0');
      }

    }
  }

  return canvas;
};

/**
 * Draw a pc on the canvas
 * @param {Context2d} ctx Canvas Cairo context
 * @param {number|string} pcNumber pc number
 * @param {int} x pc horizontal position on grid
 * @param {int} y pc vertical position on grid
 * @param {boolean} isFree true if pc is free
 */
function drawPc(ctx, pcNumber, x, y, isFree) {
  // Choosing color of rectangle
  if (typeof pcNumber == 'string' && pcNumber.indexOf('-B') > -1) ctx.fillStyle = bColor;
  else if (pcNumber === 'c') ctx.fillStyle = cColor;
  else ctx.fillStyle = isFree ? freeColor : busyColor;

  // Drawing the rectangle
  const x2 = x * (blockW + space);
  const y2 = y * (blockH + space);
  ctx.fillRect(x2, y2, blockW, blockH);

  // Drawing pc text
  if (pcNumber !== 'c') {
    const metrics = ctx.measureText(pcNumber);
    const tW = metrics.actualBoundingBoxRight;
    const tH = metrics.actualBoundingBoxAscent;
    ctx.fillStyle = "#ffffff";
    ctx.fillText(pcNumber, x2 + (blockW - tW) / 2, y2 + tH + (blockH - tH) / 2);
  }
}

