import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as d3 from "d3";

@Component({
  selector: 'app-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.css']
})
export class ViewerComponent implements AfterViewInit  {
  @ViewChild('markinglayer', { static: true }) markinglayer: ElementRef = new ElementRef(null);
  @ViewChild('original', { static: true }) original: ElementRef = new ElementRef(null);
  color =  'rgb(255, 0, 0)';
  
  server: string = "http://localhost:5001/forms";
  dxfUrl = "http://localhost:3000/bird.dxf";
  svgSrc = 'http://localhost:5001/svg/20230213173114968045.svg';
 
  unDo: any[] = [];
  height: any="120mm";
  width: any="90mm";
  scale: any="100%";
  
  svgContent: any;
  

 
  constructor(private http: HttpClient, private renderer: Renderer2) { }
 
  ngAfterViewInit(): void {
   this.http.post(this.server, {url:this.dxfUrl}).subscribe((data:any )=> {

 

    this.height = data.overallSize[0];
    this.width = data.overallSize[1];
      
  


   });
 
    this.http.get(this.svgSrc, { responseType: 'text' }).subscribe(data => {
    
      this.svgContent = data;
      this.original.nativeElement.innerHTML = this.svgContent;

      let paths = document.getElementsByTagName('path');
      for (let index = 0; index < paths.length; index++) {
        const element = paths[index];
     
       // fill path with transparent color
        this.renderer.setStyle(element, 'fill', 'transparent');
 
       
        element.onmousedown = (e) => {
          var computedStyle = window.getComputedStyle(element);
          console.log(computedStyle.getPropertyValue("stroke"));
          this.unDo.push(element);
          // toggle color
          if (computedStyle.getPropertyValue("stroke") !==this.color) {
            this.renderer.setStyle(element, 'stroke', this.color);
          }
          else {
            this.renderer.setStyle(element, 'stroke', 'rgba(255, 255, 255, 0)');
          }

  
   
       
        }

        const svg = d3.select(this.markinglayer.nativeElement);
          
        const org = d3.select(this.original.nativeElement);

          svg.call(d3.zoom().on('zoom', (event, x ) => {
            console.log(event.transform);
            svg.attr('transform', event.transform);
         
            d3.selectAll('g').attr('transform', event.transform);

            
            
    
     
          }));

          org.call(d3.zoom().on('zoom', (event, x ) => {
            console.log(event.transform);
            org.attr('transform', event.transform);
         
            d3.selectAll('g').attr('transform', event.transform);

            
            
    
     
          }));
       

      }
       
      //console.log(paths);
    });
  }

  undo() {
    if (this.unDo.length > 0) {
      let element = this.unDo.pop();
      console.log(element);
      this.renderer.setStyle(element, 'stroke', 'white');
    }
  }


  decoupe() {
    this.color = 'rgb(255, 0, 0)';
  }
  gravure() {
    this.color = 'rgb(0, 0, 255)';
  }


  export(){
    // download the svg file
    let svg = document.getElementsByTagName('svg')[1];
    let svgData = new XMLSerializer().serializeToString(svg);
    let svgBlob = new Blob([svgData], {type:"image/svg+xml;charset=utf-8"});
    let svgUrl = URL.createObjectURL(svgBlob);
    let downloadLink = document.createElement("a");
    downloadLink.href = svgUrl;
    downloadLink.download = "download.svg";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    
  
    

  }


}
