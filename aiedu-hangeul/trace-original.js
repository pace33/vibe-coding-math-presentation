/* Original public Aiedu Hangul stroke definitions, layouts and validation.
 * Source: https://aiedue.ddns.net/korean/app.js?v=stage3-ink-transcription-v4
 * Read on 2026-10-06. Pure functions copied; account/backend code intentionally excluded.
 * Canvas mount adapter below is specific to this lecture site.
 */
(function(root){
'use strict';
const traceInitials = ['ㄱ','ㄲ','ㄴ','ㄷ','ㄸ','ㄹ','ㅁ','ㅂ','ㅃ','ㅅ','ㅆ','ㅇ','ㅈ','ㅉ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'];
const traceMedials = ['ㅏ','ㅐ','ㅑ','ㅒ','ㅓ','ㅔ','ㅕ','ㅖ','ㅗ','ㅘ','ㅙ','ㅚ','ㅛ','ㅜ','ㅝ','ㅞ','ㅟ','ㅠ','ㅡ','ㅢ','ㅣ'];
const traceFinals = ['', 'ㄱ','ㄲ','ㄳ','ㄴ','ㄵ','ㄶ','ㄷ','ㄹ','ㄺ','ㄻ','ㄼ','ㄽ','ㄾ','ㄿ','ㅀ','ㅁ','ㅂ','ㅄ','ㅅ','ㅆ','ㅇ','ㅈ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'];
const traceVerticalVowels = new Set(['ㅏ','ㅐ','ㅑ','ㅒ','ㅓ','ㅔ','ㅕ','ㅖ','ㅣ']);
const traceMixedLayoutVowels = new Set(['ㅘ','ㅙ','ㅚ','ㅝ','ㅞ','ㅟ','ㅢ']);
const traceCompositeJamo = {
    'ㄲ': ['ㄱ', 'ㄱ'],
    'ㄸ': ['ㄷ', 'ㄷ'],
    'ㅃ': ['ㅂ', 'ㅂ'],
    'ㅆ': ['ㅅ', 'ㅅ'],
    'ㅉ': ['ㅈ', 'ㅈ'],
    'ㅘ': ['ㅗ', 'ㅏ'],
    'ㅙ': ['ㅗ', 'ㅐ'],
    'ㅚ': ['ㅗ', 'ㅣ'],
    'ㅝ': ['ㅜ', 'ㅓ'],
    'ㅞ': ['ㅜ', 'ㅔ'],
    'ㅟ': ['ㅜ', 'ㅣ'],
    'ㅢ': ['ㅡ', 'ㅣ'],
    'ㄳ': ['ㄱ', 'ㅅ'],
    'ㄵ': ['ㄴ', 'ㅈ'],
    'ㄶ': ['ㄴ', 'ㅎ'],
    'ㄺ': ['ㄹ', 'ㄱ'],
    'ㄻ': ['ㄹ', 'ㅁ'],
    'ㄼ': ['ㄹ', 'ㅂ'],
    'ㄽ': ['ㄹ', 'ㅅ'],
    'ㄾ': ['ㄹ', 'ㅌ'],
    'ㄿ': ['ㄹ', 'ㅍ'],
    'ㅀ': ['ㄹ', 'ㅎ'],
    'ㅄ': ['ㅂ', 'ㅅ']
};
const traceTopToBottomStroke = (x, top, bottom) => ({ points: [[x, top], [x, bottom]] });
const traceLeftToRightStroke = (y, left, right, options = {}) => ({ points: [[left, y], [right, y]], ...options });
const traceStrokeMap = {
    'ㆍ': [{ points: [[0.5, 0.5], [0.5, 0.5]], dot: true }],
    '●': [{ points: [[0.5, 0.5], [0.5, 0.5]], dot: true }],
    'ㅣ': [{ points: [[0.5, 0.18], [0.5, 0.82]] }],
    'ㅡ': [{ points: [[0.2, 0.55], [0.8, 0.55]] }],
    'ㅏ': [{ points: [[0.45, 0.18], [0.45, 0.82]] }, { points: [[0.45, 0.5], [0.78, 0.5]] }],
    'ㅓ': [traceLeftToRightStroke(0.5, 0.28, 0.62), { points: [[0.62, 0.18], [0.62, 0.82]] }],
    'ㅑ': [{ points: [[0.42, 0.16], [0.42, 0.84]] }, { points: [[0.42, 0.4], [0.78, 0.4]] }, { points: [[0.42, 0.62], [0.78, 0.62]] }],
    'ㅕ': [traceLeftToRightStroke(0.4, 0.28, 0.66), traceLeftToRightStroke(0.62, 0.28, 0.66), { points: [[0.66, 0.16], [0.66, 0.84]] }],
    'ㅗ': [traceTopToBottomStroke(0.5, 0.24, 0.54), { points: [[0.22, 0.64], [0.78, 0.64]] }],
    'ㅜ': [{ points: [[0.22, 0.36], [0.78, 0.36]] }, { points: [[0.5, 0.46], [0.5, 0.76]] }],
    'ㅛ': [traceTopToBottomStroke(0.4, 0.22, 0.5), traceTopToBottomStroke(0.6, 0.22, 0.5), { points: [[0.22, 0.64], [0.78, 0.64]] }],
    'ㅠ': [{ points: [[0.22, 0.36], [0.78, 0.36]] }, { points: [[0.4, 0.48], [0.4, 0.78]] }, { points: [[0.6, 0.48], [0.6, 0.78]] }],
    'ㅐ': [{ points: [[0.36, 0.18], [0.36, 0.82]] }, { points: [[0.36, 0.5], [0.58, 0.5]] }, { points: [[0.7, 0.18], [0.7, 0.82]] }],
    'ㅔ': [traceLeftToRightStroke(0.5, 0.32, 0.62), { points: [[0.62, 0.18], [0.62, 0.82]] }, { points: [[0.78, 0.18], [0.78, 0.82]] }],
    'ㅒ': [{ points: [[0.34, 0.16], [0.34, 0.84]] }, { points: [[0.34, 0.4], [0.56, 0.4]] }, { points: [[0.34, 0.62], [0.56, 0.62]] }, { points: [[0.72, 0.16], [0.72, 0.84]] }],
    'ㅖ': [traceLeftToRightStroke(0.4, 0.28, 0.58, { strictDirection: true }), traceLeftToRightStroke(0.62, 0.28, 0.58, { strictDirection: true }), { points: [[0.58, 0.16], [0.58, 0.84]] }, { points: [[0.78, 0.16], [0.78, 0.84]] }],
    'ㄱ': [{ points: [[0.22, 0.24], [0.78, 0.24], [0.78, 0.78]] }],
    'ㄴ': [{ points: [[0.24, 0.2], [0.24, 0.76], [0.78, 0.76]] }],
    'ㄷ': [{ points: [[0.28, 0.24], [0.74, 0.24]] }, { points: [[0.28, 0.24], [0.28, 0.76]] }, { points: [[0.28, 0.76], [0.74, 0.76]] }],
    'ㅌ': [{ points: [[0.28, 0.22], [0.74, 0.22]] }, { points: [[0.28, 0.22], [0.28, 0.78]] }, { points: [[0.28, 0.5], [0.68, 0.5]] }, { points: [[0.28, 0.78], [0.74, 0.78]] }],
    'ㅁ': [{ points: [[0.28, 0.24], [0.28, 0.76]] }, { points: [[0.28, 0.24], [0.74, 0.24]] }, { points: [[0.74, 0.24], [0.74, 0.76]] }, { points: [[0.28, 0.76], [0.74, 0.76]] }],
    'ㅂ': [{ points: [[0.3, 0.2], [0.3, 0.78]] }, { points: [[0.72, 0.2], [0.72, 0.78]] }, { points: [[0.3, 0.5], [0.72, 0.5]] }, { points: [[0.28, 0.78], [0.74, 0.78]] }],
    'ㅍ': [{ points: [[0.26, 0.22], [0.76, 0.22]] }, { points: [[0.32, 0.22], [0.32, 0.78]] }, { points: [[0.7, 0.22], [0.7, 0.78]] }, { points: [[0.26, 0.78], [0.76, 0.78]] }],
    'ㅅ': [{ points: [[0.5, 0.22], [0.28, 0.78]] }, { points: [[0.5, 0.22], [0.76, 0.78]] }],
    'ㅈ': [{ points: [[0.24, 0.24], [0.78, 0.24]] }, { points: [[0.5, 0.28], [0.28, 0.78]] }, { points: [[0.5, 0.28], [0.76, 0.78]] }],
    'ㅊ': [{ points: [[0.5, 0.16], [0.5, 0.3]] }, { points: [[0.24, 0.34], [0.78, 0.34]] }, { points: [[0.5, 0.38], [0.28, 0.8]] }, { points: [[0.5, 0.38], [0.76, 0.8]] }],
    'ㅋ': [{ points: [[0.22, 0.22], [0.78, 0.22]] }, { points: [[0.78, 0.22], [0.78, 0.78]] }, { points: [[0.44, 0.5], [0.78, 0.5]] }],
    'ㅇ': [{ circle: [0.5, 0.52, 0.25, 0.3] }],
    'ㅎ': [{ points: [[0.5, 0.14], [0.5, 0.28]] }, { points: [[0.28, 0.34], [0.72, 0.34]] }, { circle: [0.5, 0.62, 0.24, 0.24] }],
    'ㄹ': [
        { points: [[0.26, 0.22], [0.72, 0.22]] },
        { points: [[0.72, 0.22], [0.72, 0.46]] },
        { points: [[0.34, 0.46], [0.72, 0.46]] },
        { points: [[0.34, 0.46], [0.34, 0.72]] },
        { points: [[0.34, 0.72], [0.76, 0.72]] }
    ]
};

function decomposeTraceSyllable(char) {
    const code = char.charCodeAt(0) - 0xAC00;
    if (code < 0 || code > 11171) return null;
    const initialIndex = Math.floor(code / 588);
    const medialIndex = Math.floor((code % 588) / 28);
    const finalIndex = code % 28;
    return {
        initial: traceInitials[initialIndex],
        medial: traceMedials[medialIndex],
        final: traceFinals[finalIndex]
    };
}

function traceSubBox(box, x, y, w, h) {
    return {
        x: box.x + box.w * x,
        y: box.y + box.h * y,
        w: box.w * w,
        h: box.h * h
    };
}

function getTraceSyllableParts(syllable, box) {
    const hasFinal = Boolean(syllable.final);
    const top = hasFinal ? traceSubBox(box, 0.08, 0.05, 0.84, 0.62) : traceSubBox(box, 0.08, 0.08, 0.84, 0.82);
    const parts = [];
    if (traceMixedLayoutVowels.has(syllable.medial)) {
        const [horizontalPart, verticalPart] = traceCompositeJamo[syllable.medial];
        parts.push(
            { char: syllable.initial, box: traceSubBox(top, 0.02, 0.0, 0.56, 0.5) },
            { char: horizontalPart, box: traceSubBox(top, 0.0, 0.46, 0.62, 0.54) },
            { char: verticalPart, box: traceSubBox(top, 0.58, 0.0, 0.42, 1) }
        );
    } else if (traceVerticalVowels.has(syllable.medial)) {
        parts.push(
            { char: syllable.initial, box: traceSubBox(top, 0.0, 0.02, 0.48, 0.96) },
            { char: syllable.medial, box: traceSubBox(top, 0.48, 0.0, 0.52, 1) }
        );
    } else {
        parts.push(
            { char: syllable.initial, box: traceSubBox(top, 0.18, 0.0, 0.64, 0.52) },
            { char: syllable.medial, box: traceSubBox(top, 0.0, 0.45, 1, 0.55) }
        );
    }
    if (hasFinal) parts.push({ char: syllable.final, box: traceSubBox(box, 0.16, 0.68, 0.68, 0.28) });
    return parts;
}

function drawTraceNumber(ctx, x, y, number, scale) {
    const r = Math.max(10, scale * 0.085);
    ctx.save();
    ctx.fillStyle = '#fb923c';
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = `900 ${Math.max(10, r * 0.95)}px 'Outfit', sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(String(number), x, y + 0.5);
    ctx.restore();
}

function drawTraceArrowHead(ctx, fromX, fromY, toX, toY, scale) {
    const angle = Math.atan2(toY - fromY, toX - fromX);
    const size = Math.max(10, scale * 0.11);
    ctx.beginPath();
    ctx.moveTo(toX, toY);
    ctx.lineTo(toX - Math.cos(angle - Math.PI / 6) * size, toY - Math.sin(angle - Math.PI / 6) * size);
    ctx.lineTo(toX - Math.cos(angle + Math.PI / 6) * size, toY - Math.sin(angle + Math.PI / 6) * size);
    ctx.closePath();
    ctx.fillStyle = '#f97316';
    ctx.fill();
}

function drawTraceStroke(ctx, stroke, box, number, options = {}) {
    const scale = Math.min(box.w, box.h);
    const tx = (p) => ({ x: box.x + p[0] * box.w, y: box.y + p[1] * box.h });
    const alpha = options.alpha ?? 1;
    const color = options.color || '#f97316';
    ctx.save();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = Math.max(11, scale * (options.completed ? 0.075 : 0.105));

    if (stroke.dot) {
        const p = tx(stroke.points[0]);
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(10, scale * 0.1), 0, Math.PI * 2);
        ctx.fill();
        if (!options.completed) drawTraceNumber(ctx, p.x, p.y, number, scale);
        ctx.restore();
        return;
    }

    if (stroke.circle) {
        const [cx, cy, rx, ry] = stroke.circle;
        const x = box.x + cx * box.w;
        const y = box.y + cy * box.h;
        const radiusX = rx * box.w;
        const radiusY = ry * box.h;
        const startAngle = -Math.PI / 2;
        const endAngle = startAngle - Math.PI * 2;
        ctx.beginPath();
        ctx.ellipse(x, y, radiusX, radiusY, 0, startAngle, endAngle, true);
        ctx.stroke();
        if (!options.completed) {
            const arrowAngle = startAngle - Math.PI * 0.18;
            const fromAngle = arrowAngle + 0.22;
            drawTraceArrowHead(
                ctx,
                x + Math.cos(fromAngle) * radiusX,
                y + Math.sin(fromAngle) * radiusY,
                x + Math.cos(arrowAngle) * radiusX,
                y + Math.sin(arrowAngle) * radiusY,
                scale
            );
            drawTraceNumber(ctx, x - radiusX * 0.8, y - radiusY * 0.9, number, scale);
        }
        ctx.restore();
        return;
    }

    const points = stroke.points.map(tx);
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    points.slice(1).forEach((p) => ctx.lineTo(p.x, p.y));
    ctx.stroke();
    const prev = points[Math.max(0, points.length - 2)];
    const last = points[points.length - 1];
    if (!options.completed) drawTraceArrowHead(ctx, prev.x, prev.y, last.x, last.y, scale);
    if (!options.completed) drawTraceNumber(ctx, points[0].x, points[0].y, number, scale);
    ctx.restore();
}

function drawSingleTraceChar(ctx, char, box) {
    if (traceCompositeJamo[char]) {
        const parts = traceCompositeJamo[char];
        parts.forEach((part, idx) => {
            const child = traceSubBox(box, idx / parts.length, 0, 1 / parts.length, 1);
            drawSingleTraceChar(ctx, part, child);
        });
        return;
    }

    const syllable = decomposeTraceSyllable(char);
    if (syllable) {
        getTraceSyllableParts(syllable, box).forEach((part) => drawSingleTraceChar(ctx, part.char, part.box));
        return;
    }

    const strokes = traceStrokeMap[char];
    if (!strokes) {
        ctx.save();
        ctx.fillStyle = '#c2410c';
        ctx.font = `900 ${Math.max(24, Math.min(box.w, box.h) * 0.5)}px 'Noto Sans KR', sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(char, box.x + box.w / 2, box.y + box.h / 2);
        ctx.restore();
        return;
    }
    strokes.forEach((stroke, idx) => drawTraceStroke(ctx, stroke, box, idx + 1));
}

function collectSingleTraceChar(char, box, out) {
    if (traceCompositeJamo[char]) {
        const parts = traceCompositeJamo[char];
        parts.forEach((part, idx) => {
            collectSingleTraceChar(part, traceSubBox(box, idx / parts.length, 0, 1 / parts.length, 1), out);
        });
        return;
    }

    const syllable = decomposeTraceSyllable(char);
    if (syllable) {
        getTraceSyllableParts(syllable, box).forEach((part) => collectSingleTraceChar(part.char, part.box, out));
        return;
    }

    const strokes = traceStrokeMap[char] || [];
    strokes.forEach((stroke) => out.push({ stroke, box }));
}

function collectTraceStrokeOrder(text, bx, by, boxW, boxH) {
    const chars = Array.from(text || '');
    const out = [];
    if (chars.length <= 1) {
        collectSingleTraceChar(chars[0] || text, { x: bx + boxW * 0.18, y: by + boxH * 0.16, w: boxW * 0.64, h: boxH * 0.7 }, out);
        return out;
    }

    const gap = boxW * 0.03;
    const charW = (boxW * 0.82 - gap * (chars.length - 1)) / chars.length;
    chars.forEach((char, idx) => {
        collectSingleTraceChar(char, {
            x: bx + boxW * 0.09 + idx * (charW + gap),
            y: by + boxH * 0.18,
            w: charW,
            h: boxH * 0.68
        }, out);
    });
    return out;
}

function drawTraceStrokeOrder(ctx, text, bx, by, boxW, boxH, completedCount = 0, hideLabel = false) {
    if (!hideLabel) {
        const labelSize = Math.max(22, Math.min(boxW, boxH) * 0.18);
        ctx.save();
        ctx.fillStyle = '#c2410c';
        ctx.font = `900 ${labelSize}px 'Noto Sans KR', sans-serif`;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.fillText(text, bx + 12, by + 10);
        ctx.restore();
    }

    const guideY = hideLabel ? by - boxH * 0.04 : by;
    const guideH = hideLabel ? boxH * 1.08 : boxH;
    const strokes = collectTraceStrokeOrder(text, bx, guideY, boxW, guideH);
    strokes.forEach((item, idx) => {
        if (idx < completedCount) {
            drawTraceStroke(ctx, item.stroke, item.box, idx + 1, { completed: true, alpha: 0.45, color: '#fb923c' });
        } else if (idx === completedCount) {
            drawTraceStroke(ctx, item.stroke, item.box, idx + 1);
        }
    });
    return strokes;
}


function tracePointForStroke(strokeItem, point) {
    return {
        x: strokeItem.box.x + point[0] * strokeItem.box.w,
        y: strokeItem.box.y + point[1] * strokeItem.box.h
    };
}

function traceStrokeStartPoint(strokeItem) {
    const stroke = strokeItem.stroke;
    if (stroke.dot) return tracePointForStroke(strokeItem, stroke.points[0]);
    if (stroke.circle) {
        const [cx, cy, rx, ry] = stroke.circle;
        return { x: strokeItem.box.x + cx * strokeItem.box.w, y: strokeItem.box.y + (cy - ry) * strokeItem.box.h };
    }
    return tracePointForStroke(strokeItem, stroke.points[0]);
}

function traceStrokeEndPoint(strokeItem) {
    const stroke = strokeItem.stroke;
    if (stroke.dot) return tracePointForStroke(strokeItem, stroke.points[0]);
    if (stroke.circle) {
        const [cx, cy, rx, ry] = stroke.circle;
        return { x: strokeItem.box.x + cx * strokeItem.box.w, y: strokeItem.box.y + (cy - ry) * strokeItem.box.h };
    }
    return tracePointForStroke(strokeItem, stroke.points[stroke.points.length - 1]);
}

function traceDistance(a, b) {
    return Math.hypot(a.x - b.x, a.y - b.y);
}

function tracePathLength(path) {
    let total = 0;
    for (let i = 1; i < path.length; i += 1) total += traceDistance(path[i - 1], path[i]);
    return total;
}

function traceIsNearCurrentStrokeStart(point, strokeItem) {
    const scale = Math.min(strokeItem.box.w, strokeItem.box.h);
    if (strokeItem.stroke.strictDirection) {
        const start = traceStrokeStartPoint(strokeItem);
        const end = traceStrokeEndPoint(strokeItem);
        const strokeLength = traceDistance(start, end);
        return traceDistance(point, start) <= Math.max(8, Math.min(scale * 0.14, strokeLength * 0.32));
    }
    const tolerance = strokeItem.lesson21Easy
        ? Math.max(18, scale * 0.4)
        : strokeItem.lesson21Compact ? Math.max(10, scale * 0.28) : Math.max(36, scale * 0.34);
    return traceDistance(point, traceStrokeStartPoint(strokeItem)) <= tolerance;
}

function traceDidCompleteStroke(path, strokeItem) {
    const scale = Math.min(strokeItem.box.w, strokeItem.box.h);
    if (!path || path.length < 2) return false;
    if (strokeItem.stroke.dot) return tracePathLength(path) >= Math.max(8, scale * 0.06);
    if (strokeItem.stroke.circle) return tracePathLength(path) >= scale * 0.6;
    const last = path[path.length - 1];
    const minimumLength = strokeItem.lesson21Easy
        ? scale * 0.28
        : strokeItem.lesson21Compact ? scale * 0.42 : scale * 0.14;
    const endTolerance = strokeItem.lesson21Easy
        ? Math.max(18, scale * 0.42)
        : strokeItem.lesson21Compact ? Math.max(11, scale * 0.3) : Math.max(40, scale * 0.38);
    const directionalEndTolerance = strokeItem.stroke.strictDirection
        ? Math.max(8, Math.min(scale * 0.16, traceDistance(traceStrokeStartPoint(strokeItem), traceStrokeEndPoint(strokeItem)) * 0.32))
        : endTolerance;
    const guidePoints = strokeItem.stroke.points || [];
    const cornerTolerance = strokeItem.lesson21Easy
        ? Math.max(18, scale * 0.38)
        : strokeItem.lesson21Compact ? Math.max(11, scale * 0.28) : Math.max(32, scale * 0.3);
    const passedCorners = guidePoints.slice(1, -1).every((guidePoint) => {
        const corner = tracePointForStroke(strokeItem, guidePoint);
        return path.some((point) => traceDistance(point, corner) <= cornerTolerance);
    });
    return tracePathLength(path) >= minimumLength
        && traceDistance(last, traceStrokeEndPoint(strokeItem)) <= directionalEndTolerance
        && passedCorners;
}


function mount(canvas, text, options = {}) {
  const ctx = canvas.getContext('2d');
  let width = 0, height = 0, completed = 0, paths = [], active = null, strokes = [];
  const update = () => {
    canvas.dataset.completed = String(completed === strokes.length && strokes.length > 0);
    canvas.dataset.strokeIndex = String(completed);
    canvas.dataset.strokeTotal = String(strokes.length);
    options.onProgress?.({completed,total:strokes.length,done:canvas.dataset.completed==='true'});
  };
  const drawPath = path => {
    if (path.length < 2) return;
    ctx.save(); ctx.strokeStyle='#626e75'; ctx.lineWidth=5; ctx.lineCap='round'; ctx.lineJoin='round';
    ctx.beginPath();ctx.moveTo(path[0].x*width,path[0].y*height);
    path.slice(1).forEach(p=>ctx.lineTo(p.x*width,p.y*height));ctx.stroke();ctx.restore();
  };
  const redraw = () => {
    ctx.clearRect(0,0,width,height);
    ctx.fillStyle='#fffaf1';ctx.fillRect(0,0,width,height);
    ctx.save();ctx.strokeStyle='#fed7aa';ctx.setLineDash([4,5]);ctx.lineWidth=1;
    for(const y of [height/3,height*2/3]){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(width,y);ctx.stroke();}
    ctx.restore();
    strokes=drawTraceStrokeOrder(ctx,text,0,0,width,height,completed,true);
    paths.forEach(drawPath);
    if(active)drawPath(active);
  };
  const resize = () => {
    const box=canvas.getBoundingClientRect();
    if (!box.width || !box.height) return;
    width=box.width;height=box.height;
    const ratio=Math.min(root.devicePixelRatio||1,2);
    canvas.width=Math.round(width*ratio);canvas.height=Math.round(height*ratio);
    ctx.setTransform(ratio,0,0,ratio,0,0);redraw();update();
  };
  const point = event => {
    const box=canvas.getBoundingClientRect();
    return {x:event.clientX-box.left,y:event.clientY-box.top};
  };
  const normalize = p => ({x:p.x/width,y:p.y/height});
  canvas.addEventListener('pointerdown',event=>{
    if(event.button!==0 || completed>=strokes.length || options.enabled?.()===false)return;
    event.preventDefault();
    const p=point(event),item=strokes[completed];
    if(!traceIsNearCurrentStrokeStart(p,item)){
      options.onInvalid?.('번호가 표시된 시작점에서 쓰기 시작해요.');return;
    }
    canvas.setPointerCapture(event.pointerId);active=[normalize(p)];redraw();
  });
  canvas.addEventListener('pointermove',event=>{
    if(!active)return;
    active.push(normalize(point(event)));redraw();
  });
  canvas.addEventListener('pointerup',event=>{
    if(!active)return;
    active.push(normalize(point(event)));
    const path=active.map(p=>({x:p.x*width,y:p.y*height}));
    const item=strokes[completed];
    const valid=traceIsNearCurrentStrokeStart(path[0],item)&&traceDidCompleteStroke(path,item);
    if(valid){paths.push(active);completed+=1;}else options.onInvalid?.('주황색 획의 방향과 끝점을 따라 다시 써 보세요.');
    active=null;redraw();update();
    if(valid&&completed===strokes.length)options.onComplete?.();
  });
  canvas.addEventListener('pointercancel',()=>{active=null;redraw();});
  const observer=new ResizeObserver(resize);observer.observe(canvas);
  resize();
  return {reset(){completed=0;paths=[];active=null;redraw();update();},
    destroy(){observer.disconnect();active=null;},
    get completed(){return completed;},
    get total(){return strokes.length;}};
}
function drawCurricularCanvasGuide(canvas, guideText) {
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const width = Math.max(320, Math.round(rect.width || canvas.clientWidth || 640));
    const height = Math.max(150, Math.round(rect.height || canvas.clientHeight || 220));
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    const ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, width, height);
    if (!String(guideText || '').trim()) {
        canvas._guideMask = buildCurricularGuideMask(width, height, [], 32, 40, height / 2);
        return;
    }
    ctx.strokeStyle = 'rgba(239, 154, 154, 0.85)';
    ctx.lineWidth = 1.2;
    ctx.setLineDash([8, 8]);
    ctx.fillStyle = 'rgba(107, 114, 128, 0.18)';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const text = String(guideText || '단어');
    const chars = Array.from(text);
    const baseSize = Math.max(28, Math.min(82, Math.floor(width / Math.max(3.2, chars.length * 0.72))));
    ctx.font = `900 ${baseSize}px "Noto Sans KR", "Apple SD Gothic Neo", sans-serif`;
    const lines = [];
    let current = '';
    chars.forEach((char) => {
        const test = current + char;
        if (ctx.measureText(test).width > width * 0.84 && current) { lines.push(current); current = char; }
        else current = test;
    });
    if (current) lines.push(current);
    const lineHeight = baseSize * 1.25;
    const startY = (height - ((lines.length - 1) * lineHeight)) / 2;
    lines.forEach((line, lineIndex) => {
        const y = startY + lineIndex * lineHeight;
        ctx.fillText(line, width / 2, y);
        ctx.strokeText(line, width / 2, y);
    });
    ctx.setLineDash([]);
    canvas._guideMask = buildCurricularGuideMask(width, height, lines, baseSize, lineHeight, startY);
}
function buildCurricularGuideMask(width, height, lines, baseSize, lineHeight, startY) {
    const mask = document.createElement('canvas');
    mask.width = width;
    mask.height = height;
    const mctx = mask.getContext('2d');
    mctx.fillStyle = '#000';
    mctx.textAlign = 'center';
    mctx.textBaseline = 'middle';
    mctx.font = `900 ${baseSize}px "Noto Sans KR", "Apple SD Gothic Neo", sans-serif`;
    lines.forEach((line, lineIndex) => mctx.fillText(line, width / 2, startY + lineIndex * lineHeight));
    return mask;
}
function drawStoredCurricularStrokes(canvas) {
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const width = canvas.width / dpr;
    const height = canvas.height / dpr;
    ctx.save();
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.strokeStyle = 'rgba(44, 62, 80, 0.78)';
    ctx.lineWidth = 9;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    (canvas._curricularStrokes || []).forEach((points) => {
        if (!points.length) return;
        ctx.beginPath();
        points.forEach((point, i) => { if (i === 0) ctx.moveTo(point.x * width, point.y * height); else ctx.lineTo(point.x * width, point.y * height); });
        ctx.stroke();
    });
    ctx.restore();
}
function measureCurricularCanvasCoverage(canvas) {
    if (!canvas?._guideMask) return 0;
    const dpr = window.devicePixelRatio || 1;
    const width = Math.round(canvas.width / dpr);
    const height = Math.round(canvas.height / dpr);
    const user = document.createElement('canvas');
    user.width = width; user.height = height;
    const uctx = user.getContext('2d');
    uctx.strokeStyle = '#000';
    uctx.lineWidth = 24;
    uctx.lineCap = 'round';
    uctx.lineJoin = 'round';
    (canvas._curricularStrokes || []).forEach((points) => {
        if (!points.length) return;
        uctx.beginPath();
        points.forEach((point, i) => { if (i === 0) uctx.moveTo(point.x * width, point.y * height); else uctx.lineTo(point.x * width, point.y * height); });
        uctx.stroke();
    });
    const maskData = canvas._guideMask.getContext('2d').getImageData(0, 0, width, height).data;
    const userData = uctx.getImageData(0, 0, width, height).data;
    let guidePixels = 0, covered = 0;
    for (let i = 3; i < maskData.length; i += 4) {
        if (maskData[i] > 12) {
            guidePixels += 1;
            if (userData[i] > 12) covered += 1;
        }
    }
    return guidePixels ? covered / guidePixels : 0;
}

function mountCurricular(canvas,text,options={}) {
  let strokes=[],active=null;
  const redraw=()=>{drawCurricularCanvasGuide(canvas,text);canvas._curricularStrokes=active?[...strokes,active]:strokes;drawStoredCurricularStrokes(canvas);};
  const report=()=>{const coverage=measureCurricularCanvasCoverage(canvas);canvas.dataset.coverage=String(coverage);canvas.dataset.completed=String(coverage>=.8||Math.round(coverage*100)>=80);options.onProgress?.({coverage,done:canvas.dataset.completed==='true'});return coverage;};
  const point=e=>{const rect=canvas.getBoundingClientRect();return {x:Math.max(0,Math.min(1,(e.clientX-rect.left)/rect.width)),y:Math.max(0,Math.min(1,(e.clientY-rect.top)/rect.height))};};
  canvas.addEventListener('pointerdown',e=>{if(e.button!==0)return;e.preventDefault();canvas.setPointerCapture(e.pointerId);active=[point(e)];});
  canvas.addEventListener('pointermove',e=>{if(!active)return;active.push(point(e));redraw();});
  canvas.addEventListener('pointerup',e=>{if(!active)return;active.push(point(e));if(active.length>1)strokes.push(active);active=null;redraw();report();});
  canvas.addEventListener('pointercancel',()=>{active=null;redraw();});
  const observer=new ResizeObserver(()=>{redraw();report();});observer.observe(canvas);redraw();report();
  document.fonts?.ready.then(()=>{if(canvas.isConnected){redraw();report();}});
  return {reset(){strokes=[];active=null;redraw();report();},check:report,destroy(){observer.disconnect();active=null;}};
}


const drawingColors=['#111827','#ef4444','#f97316','#facc15','#22c55e','#14b8a6','#3b82f6','#8b5cf6','#ec4899','#ffffff'];
const drawingBrushSizeMap={1:4,2:9,3:16,4:26};
const drawingTemplateLibrary=[{key:'house',label:'우리 집',type:'coloring',shapes:[{shape:'square',x:.5,y:.58,w:.36,h:.3},{shape:'triangle',x:.5,y:.33,w:.46,h:.28},{shape:'square',x:.43,y:.6,w:.09,h:.09},{shape:'square',x:.6,y:.6,w:.09,h:.09}]}];
const drawingActiveTemplate='house',drawingActiveTargetTemplate=null;
const drawingShapeMap={square:{color:'#22c55e'},triangle:{color:'#f97316'}};
function sampleLine(x1,y1,x2,y2,count=28){return Array.from({length:count},(_,i)=>{const t=count===1?0:i/(count-1);return{x:x1+(x2-x1)*t,y:y1+(y2-y1)*t};});}
function getShapePoints(item, width, height) {
    const cx = item.x * width;
    const cy = item.y * height;
    const w = Math.max(30, Math.abs(item.w || 0.28) * width);
    const h = Math.max(24, Math.abs(item.h || 0.28) * height);
    const left = cx - w / 2, right = cx + w / 2, top = cy - h / 2, bottom = cy + h / 2;
    const points = [];
    const pushPolygon = (vertices) => vertices.forEach((p, i) => points.push(...sampleLine(p.x, p.y, vertices[(i + 1) % vertices.length].x, vertices[(i + 1) % vertices.length].y, 18)));
    if (item.shape === 'line') return sampleLine(item.x * width, item.y * height, (item.x + (item.w || 0)) * width, (item.y + (item.h || 0)) * height, 38);
    if (item.shape === 'wave') {
        if (item.variant === 'arc') {
            for (let i = 0; i < 70; i++) {
                const t = i / 69;
                const a = Math.PI * (1 - t);
                points.push({ x: cx + Math.cos(a) * w / 2, y: cy - Math.sin(a) * h / 2 });
            }
            return points;
        }
        if (item.variant === 'crescent') {
            const outer = [];
            const inner = [];
            for (let i = 0; i < 48; i++) {
                const t = i / 47;
                const a = -Math.PI / 2 + Math.PI * t;
                outer.push({ x: cx + Math.cos(a) * w / 2, y: cy + Math.sin(a) * h / 2 });
                inner.push({ x: cx + w * 0.22 + Math.cos(a) * w * 0.34, y: cy + Math.sin(a) * h * 0.40 });
            }
            return [...outer, ...inner.reverse()];
        }
        for (let i = 0; i < 60; i++) {
            const t = i / 59;
            points.push({ x: left + w * t, y: cy + Math.sin(t * Math.PI * 4) * h * 0.45 });
        }
        return points;
    }
    if (item.shape === 'zigzag') {
        const vertices = Array.from({ length: 7 }, (_, i) => ({ x: left + (w / 6) * i, y: cy + (i % 2 ? h * 0.45 : -h * 0.45) }));
        vertices.forEach((p, i) => { if (i < vertices.length - 1) points.push(...sampleLine(p.x, p.y, vertices[i + 1].x, vertices[i + 1].y, 12)); });
        return points;
    }
    if (item.shape === 'circle') {
        for (let i = 0; i < 72; i++) {
            const a = Math.PI * 2 * i / 72;
            points.push({ x: cx + Math.cos(a) * w / 2, y: cy + Math.sin(a) * h / 2 });
        }
        return points;
    }
    if (item.shape === 'square') pushPolygon([{ x: left, y: top }, { x: right, y: top }, { x: right, y: bottom }, { x: left, y: bottom }]);
    else if (item.shape === 'triangle') pushPolygon([{ x: cx, y: top }, { x: right, y: bottom }, { x: left, y: bottom }]);
    else if (item.shape === 'diamond') pushPolygon([{ x: cx, y: top }, { x: right, y: cy }, { x: cx, y: bottom }, { x: left, y: cy }]);
    else if (item.shape === 'pentagon') {
        const v = Array.from({ length: 5 }, (_, i) => { const a = -Math.PI / 2 + Math.PI * 2 * i / 5; return { x: cx + Math.cos(a) * w / 2, y: cy + Math.sin(a) * h / 2 }; });
        pushPolygon(v);
    } else if (item.shape === 'star') {
        const v = Array.from({ length: 10 }, (_, i) => { const a = -Math.PI / 2 + Math.PI * 2 * i / 10; const r = (i % 2 ? 0.23 : 0.5); return { x: cx + Math.cos(a) * w * r, y: cy + Math.sin(a) * h * r }; });
        pushPolygon(v);
    } else if (item.shape === 'heart') {
        for (let i = 0; i < 80; i++) {
            const t = Math.PI * 2 * i / 80;
            const x = 16 * Math.pow(Math.sin(t), 3);
            const y = -(13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t));
            points.push({ x: cx + x * w / 34, y: cy + y * h / 30 });
        }
    }
    return points;
}

function strokeShapePath(ctx, item, width, height) {
    const pts = getShapePoints(item, width, height);
    if (!pts.length) return;
    ctx.beginPath();
    pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
    if (!['line', 'wave', 'zigzag'].includes(item.shape)) ctx.closePath();
    ctx.stroke();
}

function drawDrawingTemplate(ctx, width, height) {
    const template = drawingActiveTargetTemplate || drawingTemplateLibrary.find((item) => item.key === drawingActiveTemplate) || drawingTemplateLibrary[0];
    if (!template?.shapes?.length) return;
    ctx.save();
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 7;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.setLineDash([14, 12]);
    template.shapes.forEach((shape) => {
        ctx.strokeStyle = drawingShapeMap[shape.shape]?.color || '#94a3b8';
        strokeShapePath(ctx, shape, width, height);
    });
    ctx.setLineDash([]);
    ctx.fillStyle = '#64748b';
    ctx.font = 'bold 18px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(template.label, width * 0.5, 34);
    ctx.restore();
}

function evaluateDrawingAccuracy(canvas, drawingBrushSize, drawingUserTracePoints) {
    const rect = canvas.getBoundingClientRect();
    const template = drawingActiveTargetTemplate || drawingTemplateLibrary.find((item) => item.key === drawingActiveTemplate) || drawingTemplateLibrary[0];
    // 도형 하나를 조금 건드린 것만으로 전체 도안이 통과되지 않도록
    // 브러시가 커져도 판정 반경은 제한하고, 도형 인스턴스별 정확도를 따로 계산한다.
    const threshold = Math.min(22, Math.max(10, drawingBrushSize * 0.9));
    const byShape = {};
    const instances = [];
    let total = 0;
    let hit = 0;
    let accuracySum = 0;
    let instanceCount = 0;
    (template.shapes || []).forEach((shape, index) => {
        const pts = getShapePoints(shape, rect.width, rect.height);
        let shapeHit = 0;
        pts.forEach((target) => {
            const matched = drawingUserTracePoints.some((p) => Math.hypot(p.x - target.x, p.y - target.y) <= threshold);
            if (matched) shapeHit += 1;
        });
        const instanceAccuracy = pts.length ? Math.round((shapeHit / pts.length) * 100) : 0;
        total += pts.length;
        hit += shapeHit;
        accuracySum += instanceAccuracy;
        instanceCount += 1;
        const key = shape.shape;
        byShape[key] = byShape[key] || { hit: 0, total: 0, accuracySum: 0, instanceCount: 0, instances: [] };
        byShape[key].hit += shapeHit;
        byShape[key].total += pts.length;
        byShape[key].accuracySum += instanceAccuracy;
        byShape[key].instanceCount += 1;
        byShape[key].instances.push({ index, hit: shapeHit, total: pts.length, accuracy: instanceAccuracy });
        instances.push({ shape: key, index, hit: shapeHit, total: pts.length, accuracy: instanceAccuracy });
    });
    const accuracy = instanceCount ? Math.round(accuracySum / instanceCount) : 0;
    return { accuracy, hit, total, byShape, instances };
}


function mountPicture(canvas,options={}){
 const ctx=canvas.getContext('2d'),ink=document.createElement('canvas'),ictx=ink.getContext('2d');
 let paths=[],active=null,width=0,height=0,color=drawingColors[0],size=9,erase=false,tracePoints=[];
 const point=e=>{const r=canvas.getBoundingClientRect();return{x:(e.clientX-r.left)/r.width,y:(e.clientY-r.top)/r.height};};
 const redraw=()=>{
  const r=canvas.getBoundingClientRect();if(!r.width||!r.height)return;
  width=r.width;height=r.height;const dpr=Math.min(root.devicePixelRatio||1,2);
  canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);
  ink.width=canvas.width;ink.height=canvas.height;ictx.setTransform(dpr,0,0,dpr,0,0);
  for(const path of [...paths,...(active?[active]:[])]){
   ictx.save();ictx.globalCompositeOperation=path.erase?'destination-out':'source-over';ictx.lineWidth=path.erase?path.size*2:path.size;
   ictx.strokeStyle=path.color;ictx.lineCap='round';ictx.lineJoin='round';ictx.beginPath();
   path.points.forEach((p,i)=>i?ictx.lineTo(p.x*width,p.y*height):ictx.moveTo(p.x*width,p.y*height));ictx.stroke();ictx.restore();
  }
  ctx.fillStyle='#fff';ctx.fillRect(0,0,width,height);drawDrawingTemplate(ctx,width,height);ctx.drawImage(ink,0,0,width,height);
 };
 canvas.addEventListener('pointerdown',e=>{if(e.button!==0)return;e.preventDefault();canvas.setPointerCapture(e.pointerId);active={color,size,erase,points:[point(e)]};});
 canvas.addEventListener('pointermove',e=>{if(!active)return;active.points.push(point(e));redraw();});
 canvas.addEventListener('pointerup',e=>{
  if(!active)return;active.points.push(point(e));paths.push(active);
  for(let i=1;i<active.points.length;i++){
   const a=active.points[i-1],b=active.points[i],pts=sampleLine(a.x*width,a.y*height,b.x*width,b.y*height,Math.max(2,Math.ceil(Math.hypot((b.x-a.x)*width,(b.y-a.y)*height)/3)));
   if(active.erase)for(const p of pts)tracePoints=tracePoints.filter(t=>Math.hypot(t.x*width-p.x,t.y*height-p.y)>active.size);
   else tracePoints.push(...pts.map(p=>({x:p.x/width,y:p.y/height})));
  }active=null;redraw();
 });
 canvas.addEventListener('pointercancel',()=>{active=null;redraw();});
 const observer=new ResizeObserver(redraw);observer.observe(canvas);redraw();
 return {reset(){paths=[];tracePoints=[];active=null;redraw();},setColor(value){color=value;erase=false;},setSize(value){size=value;},setErase(value){erase=value;},evaluate(){return evaluateDrawingAccuracy(canvas,size,tracePoints.map(p=>({x:p.x*width,y:p.y*height})));},destroy(){observer.disconnect();}};
}

const api={mountPicture,drawingColors,drawingBrushSizeMap,mountCurricular,mount,collectTraceStrokeOrder,traceStrokeStartPoint,traceStrokeEndPoint,traceIsNearCurrentStrokeStart,traceDidCompleteStroke};
if(typeof module==='object'&&module.exports)module.exports=api;
else root.AieduTrace=api;
})(typeof window==='object'?window:globalThis);
