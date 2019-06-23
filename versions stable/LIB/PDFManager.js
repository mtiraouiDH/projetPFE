"use strict";

var PDFManager = class{
	constructor(pdf_source, pdf_canvas){
		this.pdf_source = pdf_source;
		this.pdf_canvas = pdf_canvas;
		this.context = pdf_canvas.getContext('2d');
		this.pdfFile = null;
		this.currPageNumber = 1;
		this.zoomed = false;
	    this.fitScale = 1;
	    this.start();
	}
	getCanvas(){
		return this.pdf_canvas;
	}
	openNextPage(){
		  var pageNumber = Math.min(this.pdfFile.numPages, this.currPageNumber + 1);
		  if (pageNumber !== this.currPageNumber) {
		    this.currPageNumber = pageNumber;
		    this.openPage(this.pdfFile, this.currPageNumber);
		  }
	}
	openPage(pdfFile, pageNumber){
		var scale = this.zoomed ? this.fitScale : 1;
		var object = this;
		pdfFile.getPage(pageNumber).then(function(page) {
			var viewport = page.getViewport(0.7);
			if (object.zoomed) {
		      var scale = page.clientWidth / viewport.width;
		      viewport = page.getViewport(scale);
		    }
		    var pageWidth = viewport.width;
		    var pageHeight = viewport.height;
		    var isPortrait = pageHeight > pageWidth;
		    if (!isPortrait){  //landscape
		    	viewport = page.getViewport(1.3);
		    	object.pdf_canvas.height = viewport.height;
		    	object.pdf_canvas.width = viewport.width;}
		              		 
		    else {			  //Portrait
		    	object.pdf_canvas.height = viewport.height;
		    	object.pdf_canvas.width = viewport.width;
		    }
		    var renderContext = {
		      canvasContext: object.context,
		      viewport: viewport
		    };

		    page.render(renderContext);
		});
	}
	start(){
		if (!window.requestAnimationFrame) {
		  window.requestAnimationFrame = (function() {
		    return window.webkitRequestAnimationFrame ||
		      window.mozRequestAnimationFrame ||
		      window.oRequestAnimationFrame ||
		      window.msRequestAnimationFrame ||
		      function(callback, element) {
		        window.setTimeout(callback, 1000 / 60);
		      };
		  })();
		}
		var that = this;

		PDFJS.disableStream = true;
	    PDFJS.getDocument(this.pdf_source).then(function(doc) {
			 
	    	that.pdfFile = doc; 
		  
		    function scroll (pgNumb ) {
			   if(isNaN(pgNumb)) {pgNumb=1;}	  	  
			   
			   that.openPage(that.pdfFile, pgNumb);	  
		   
		       function doStuff() { setTimeout(continueExecution, 5000);} //wait five seconds before continuing
		   					
		   	   function continueExecution(){

		     	pgNumb ++;
		     
		     	if (pgNumb === that.pdfFile.pdfInfo.numPages) {pgNumb=1;}
		     
		     	scroll(pgNumb);
		  	    }       
		   
		        doStuff();
		    } scroll();			
		});
	}
}