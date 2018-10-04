$(function () {
  $('body').on('click', '#SetPdf', function () {
    var fileName = $(this).data().filename;
    html2canvas(document.body, {
      backgroundColor: 'white',
      scale: 1,
      width: 1920,
      windowWidth: 1920
    }).then(function(canvas) {
      var pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'pt',
        format: 'A4'
      })
      var ClipY = 0
      var BaseHeight = 1338
      do {
        var setPdfPageHeiht = 595
        var toPDF = document.createElement('canvas')
        toPDF.width = 1920
        toPDF.height = BaseHeight
        if ((ClipY + toPDF.height) > canvas.height) {
          toPDF.height = canvas.height - ClipY
          setPdfPageHeiht = (595 / BaseHeight) * toPDF.height
        }
        toPDF.getContext('2d').drawImage(canvas, 0, ClipY, 1920, toPDF.height, 0, 0, 1920, toPDF.height)
        var pageData = toPDF.toDataURL()
        pdf.addImage(pageData, 'PNG', 2.5, 2.5, 837, setPdfPageHeiht - 5)
        ClipY += toPDF.height
        if (ClipY < canvas.height) {
          pdf.addPage()
        }
      }
      while (ClipY < canvas.height)
      pdf.save(fileName + '.pdf')
    })
  })
})
