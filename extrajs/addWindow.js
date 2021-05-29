const resultaat = document.getElementById("resultaat")


function lengte() {
    const resLengte = resultaat.value.length
    if (resLengte >= 35) {
        resultaat.style.height = "15vh"
    }
}

lengte()

setInterval(lengte, 1000)

