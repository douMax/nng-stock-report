console.log("Connected")

var fileInput = document.getElementById("file-selector")
var output = {}
var outputArr = []

var dateTimeString = new Date().toLocaleString()

var tbodyDom = document.getElementById("table-body")

var readFile = function () {
    var reader = new FileReader()
    reader.onload = function () {
        var lines = reader.result.split("\n")
        var headerLine = lines[0].split(",")
        console.log("Target columns: ", headerLine[16], headerLine[17])

        lines.forEach((line, index) => {
            if (index > 0) {
                var lineArr = line.split(",")
                var productName = lineArr[17]
                var quantity = Number(lineArr[16])

                if (!productName) {
                    return
                }

                if (output[productName]) {
                    output[productName] = output[productName] + quantity
                } else {
                    output[productName] = quantity
                }
            }
        })

        var keys = Object.keys(output)
        var sortedKeys = keys.sort((a, b) => {
            return (a > b) - 0.5
        })

        sortedKeys.forEach((key) => {
            var tempArr = [key, output[key]]
            outputArr.push(tempArr)
        })

        outputArr.forEach((el) => {
            var tr = document.createElement("tr")
            var td_name = document.createElement("td")
            var name = el[0]
            td_name.innerHTML = name
            var td_qty = document.createElement("td")
            td_qty.innerHTML = el[1]
            tr.appendChild(td_name)
            tr.appendChild(td_qty)
            tbodyDom.appendChild(tr)
        })

        exportToCsv(outputArr)
    }
    // start reading the file. When it is done, calls the onload event defined above.
    reader.readAsText(fileInput.files[0])
}

var exportToCsv = function (results) {
    var csvString = ""

    results.unshift(["Product Name", "Qty"])

    results.forEach(function (rowItem, rowIndex) {
        rowItem.forEach(function (colItem, colIndex) {
            csvString += colItem + ","
        })
        csvString += "\r\n"
    })
    csvString =
        "data:text/csv;charset=utf-8,\uFEFF" + encodeURIComponent(csvString)
    var x = document.createElement("a")
    x.setAttribute("href", csvString)
    x.innerHTML = "Download"
    x.setAttribute("download", `Newnorth Sales Data ${dateTimeString}.csv`)
    x.classList.add("button")
    document.getElementById("d-btn-area").appendChild(x)
}

fileInput.addEventListener("change", readFile)

function printData() {
    var divToPrint = document.getElementById("output-table")
    newWin = window.open("")
    newWin.document.write(divToPrint.outerHTML)
    newWin.print()
    newWin.close()
}

const printBtn = document.getElementById("print-btn")
// printBtn.addEventListener("click", printData)
