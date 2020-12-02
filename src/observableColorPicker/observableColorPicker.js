import {
    InitObservable, addListener, setValue, getValue, logListenersToConsole,
    removeListenerByKey, removeListenerByHandler,
    handlerFnLogToConsole, buildHandlerFnInnerText, handlerBuilder, buildHandlerFnInnerTextLength,
    buildHandlerFnValue
} from "../observableListMap/observableListMap.js";


import {firstOfTriple, secondOfTriple, thirdOfTriple, triple} from "../lambda-calculus-library/lambda-calculus.js";
import { onInputListener, onInputListeners, toHexString, toRGBString } from "./colorPickerUtilities.js";

import {maybe, getSafeElements} from "../maybe/maybe.js";

const [inputText, label, sizes] = getSafeElements("inputText", "label", "sizes")

// "let" wenn später zusätzliche Listener hinzugefügt oder entfernt werden soll,
// ansonsten, wenn immutable mit "const" vor veränderung schützen

const labelHandler      = handlerBuilder(1)(buildHandlerFnInnerText(label))
const labelSizeHandler  = handlerBuilder(2)(buildHandlerFnInnerTextLength(sizes))
const consoleHandler    = handlerBuilder(3)(handlerFnLogToConsole)

const inputObservable = InitObservable("")
                            (addListener)(labelHandler)
                            (addListener)(labelSizeHandler)
                            (addListener)(consoleHandler)

onInputListener(inputObservable, inputText)


const [resultColor, rgbValue, hex, hsl] = getSafeElements("resultColor", "rgbValue", "hex", "hsl")
const [inputR, inputG, inputB] = getSafeElements("inputR", "inputG", "inputB")
const [rangeR, rangeG, rangeB] = getSafeElements("rangeR", "rangeG", "rangeB")

const getRed = firstOfTriple
const getGreen = secondOfTriple
const getBlue = thirdOfTriple

const valueHandlerInputR            = handlerBuilder(1)(nVal => oVal => inputR.value = nVal(getRed))
const valueHandlerRangeR            = handlerBuilder(2)(nVal => oVal => rangeR.value = nVal(getRed))
const valueHandlerInputG            = handlerBuilder(3)(nVal => oVal => inputG.value = nVal(getGreen))
const valueHandlerRangeG            = handlerBuilder(4)(nVal => oVal => rangeG.value = nVal(getGreen))
const valueHandlerInputB            = handlerBuilder(5)(nVal => oVal => inputB.value = nVal(getBlue))
const valueHandlerRangeB            = handlerBuilder(6)(nVal => oVal => rangeB.value = nVal(getBlue))
const rgbHandlerBgColorRGB          = handlerBuilder(7)(nVal => oVal => resultColor.style.backgroundColor = toRGBString(nVal(getRed), nVal(getGreen), nVal(getBlue)))
const valueHandlerRgbTextRGB        = handlerBuilder(8)(nVal => oVal => rgbValue.value = toRGBString(nVal(getRed), nVal(getGreen), nVal(getBlue)))
const valueHandlerHexTextRGB        = handlerBuilder(9)(nVal => oVal => hex.innerText = toHexString(nVal(getRed), nVal(getGreen), nVal(getBlue)))


let rgbObservable = InitObservable(triple(11)(22)(44))
                        (addListener)(valueHandlerInputR)
                        (addListener)(valueHandlerRangeR)
                        (addListener)(valueHandlerInputG)
                        (addListener)(valueHandlerRangeG)
                        (addListener)(valueHandlerInputB)
                        (addListener)(valueHandlerRangeB)
                        (addListener)(rgbHandlerBgColorRGB)
                        (addListener)(valueHandlerRgbTextRGB)
                        (addListener)(valueHandlerHexTextRGB)


inputR.oninput = _ => rgbObservable = rgbObservable(setValue)(
    triple
    (inputR.value)
    (rgbObservable(getValue)(getGreen))
    (rgbObservable(getValue)(getBlue))
)

rangeR.oninput = _ => rgbObservable = rgbObservable(setValue)(
    triple
    (rangeR.value)
    (rgbObservable(getValue)(getGreen))
    (rgbObservable(getValue)(getBlue))
)

inputG.oninput = _ => rgbObservable = rgbObservable(setValue)(
    triple
    (rgbObservable(getValue)(getRed))
    (inputG.value)
    (rgbObservable(getValue)(getBlue))
)

rangeG.oninput = _ => rgbObservable = rgbObservable(setValue)(
    triple
    (rgbObservable(getValue)(getRed))
    (rangeG.value)
    (rgbObservable(getValue)(getBlue))
)

inputB.oninput = _ => rgbObservable = rgbObservable(setValue)(
    triple
    (rgbObservable(getValue)(getRed))
    (rgbObservable(getValue)(getGreen))
    (inputB.value)
)

rangeB.oninput = _ => rgbObservable = rgbObservable(setValue)(
    triple
    (rgbObservable(getValue)(getRed))
    (rgbObservable(getValue)(getGreen))
    (rangeB.value)
)


const notifyListenersWithInitialsValues = (...observables) =>
    observables.forEach(obs => obs(setValue)(obs(getValue)))

notifyListenersWithInitialsValues(rgbObservable)



// Toggle (Un/Subscribe)-Handler of RGB-Background
const unsubRgbBg = getSafeElements("unsubRgbBg")
unsubRgbBg.onclick = e => {
    console.log(unsubRgbBg.checked)

    if (unsubRgbBg.checked) {
        rgbObservable = rgbObservable(removeListenerByHandler)(rgbHandlerBgColorRGB)
        unsubRgbBg.labels[0].innerText = "Subscribe RGB-Background"
    } else {
        rgbObservable = rgbObservable(addListener)(rgbHandlerBgColorRGB)
        unsubRgbBg.labels[0].innerText = "UnSubscribe RGB-Background"
    }
}

