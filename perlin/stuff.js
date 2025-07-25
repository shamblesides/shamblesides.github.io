import { perlin3 } from "./perlin.js";

const canvas = document.querySelector('canvas');
if (canvas == null) throw new Error('no canvas');
const upscale = 1;
canvas.width = 48*upscale;
canvas.height = 48*upscale;

const ctx = canvas.getContext('2d');
if (ctx == null) throw new Error('ctx fail');

/**
 * @param {string} filename 
 * @param {Blob} blob 
 */
function download(filename, blob) {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
}

// @ts-expect-error
const gif = new GIF({
    workers: 3,
    quality: 2,
})
gif.on('finished', function (/** @type {Blob} */ blob) {
    download('vfx.gif', blob);
});

/**
 * @param {number} val 
 * @returns {number}
 */
const clamp = (val) => Math.max(0, Math.min(255, Math.round(val)));

/**
 * 
 * @param {number} n 
 * @param {number} x 
 * @param {number} y 
 * @param {number} z 
 * @returns  {number}
 */
const fractal = (n,x,y,z) => n > 0 ? perlin3(x,y,z) + .5*fractal(n-1,x*2,y*2,z) : 0;

let z = 0;
const intervalHandle = setInterval(() => {
    for (let x = 0; x < canvas.width/upscale; x += 1) {
        for (let y = 0; y < canvas.height/upscale; y += 1) {
            const scale=7
            const r = 160+80*fractal(5, x/scale, y/scale, Math.sin((z/30+0.11)*Math.PI*2));
            // const g = clamp(100+256*fractal(1, x/scale, y/scale, Math.sin(z/5+Math.PI*2*0.44)));
            const b = 240+80*fractal(5, x/scale, y/scale, Math.sin((z/30+0.44)*Math.PI*2));
            const g = (r+b)*0.7*fractal(5, x/scale, y/scale, Math.sin((z/30+0.77)*Math.PI*2));;
            ctx.fillStyle = `rgb(${clamp(r)},${clamp(g)},${clamp(b)})`;
            ctx.fillRect(x*upscale, y*upscale, upscale, upscale)
        }
    }
    gif.addFrame(canvas, { delay: 1000 / 60, copy: true })
    z += 1;
    if (z === 30) {
        clearInterval(intervalHandle);
        gif.render();
    }
}, 100)