import { DomItem } from "./DomItem";
import AssetParser from "../parse/AssetParser";
import { SVGFilter } from "../css-property/SVGFilter";
import { isString } from "../../util/functions/func";

export class AssetItem extends DomItem {

  getDefaultObject(obj = {}) { 
    return super.getDefaultObject({
      colors: [],
      gradients: [],
      svgfilters: [],
      svgimages: [],
      images: [],     //  { id: xxxx, url : '' }
      ...obj
    });
  }

  // 모든 Assets 은  JSON 포맷만가진다. 따로 문자열화 하지 않는다. 
  // {color, name, variable}
  // {gradient,name,variable}
  // {filters: [],id,name}
  // {mimeType, original(data or url), local, name}

  // 파싱은 
  // var asset = AssetParser.parse(data);
  // asset.color, name, variable 


  copyPropertyList(arr, index) {
    var copyObject = {...arr[index]};
    arr.splice(index, 0, copyObject);
  }
 
  toSVGString () {

    var filterString = this.json.svgfilters.map(svgfilter => {

      var filters = svgfilter.filters.map(filter => {
        return SVGFilter.parse(filter);
      })

      return `<filter id='${svgfilter.id}'>
  ${filters.join('\n')}
</filter>
`

    }).join('\n\n')

    return `
      ${filterString}
    `
  }

  toCloneObject() {
    return {
      ...super.toCloneObject(),
      colors: JSON.parse(JSON.stringify(this.json.colors)),
      gradients: JSON.parse(JSON.stringify(this.json.gradients)),
      svgfilters: JSON.parse(JSON.stringify(this.json.svgfilters)),
      svgimages: JSON.parse(JSON.stringify(this.json.svgimages)),
      images: JSON.parse(JSON.stringify(this.json.images))
    }
  }

  /* color assets manage */ 

  removeColor(removeIndex) {
    this.removePropertyList(this.json.colors, removeIndex);
  }      


  copyColor(index) {
    this.copyPropertyList(this.json.colors, index);
  }        

  sortColor(startIndex, targetIndex) {
    this.sortItem(this.json.colors, startIndex, targetIndex);
  }    

  setColorValue(index, value = {}) {
    this.json.colors[index] = {...this.json.colors[index], ...value}
  }

  getColor (name) {
    return this.json.colors.filter(item => item.name === name)[0];
  }

  addColor (obj) {
    this.json.colors.push(obj);
    return obj; 
  }

  createColor(data = {}) {
    return this.addColor(data)
  }  


  /* image assets manage */ 

  removeImage(removeIndex) {
    this.removePropertyList(this.json.images, removeIndex);
  }      


  copyImage(index) {
    this.copyPropertyList(this.json.images, index);
  }        

  sortImage(startIndex, targetIndex) {
    this.sortItem(this.json.images, startIndex, targetIndex);
  }    


  setImageValue(index, value = {}) {
    this.json.images[index] = {...this.json.images[index], ...value}
  }  

  addImage(obj) {
    this.json.images.push(obj)
    return obj; 
  }

  createImage(data = {}) {
    return this.addImage(data)
  }  

  /* color assets manage */ 


  removeGradient(removeIndex) {
    this.removePropertyList(this.json.gradients, removeIndex);
  }      


  copyGradient(index) {
    this.copyPropertyList(this.json.gradients, index);
  }        

  sortGradient(startIndex, targetIndex) {
    this.sortItem(this.json.gradients, startIndex, targetIndex);
  }    

  setGradientValue(index, value) {
    this.json.gradients[index] = {...this.json.gradients[index], ...value}
  }

  getGradient (name) {
    return this.json.gradients.filter(item => item.name === name)[0]
  }

  addGradient(obj = {}) {
    this.json.gradients.push(obj)
    return obj; 
  }

  createGradient(data = {}) {
    return this.addGradient(data)
  }  


  /* svg filters  */

  removeSVGFilter(removeIndex) {
    this.removePropertyList(this.json.svgfilters, removeIndex);
  }      


  copySVGFilter(index) {
    this.copyPropertyList(this.json.svgfilters, index);    
  }        

  sortSVGFilter(startIndex, targetIndex) {
    this.sortItem(this.json.svgfilters, startIndex, targetIndex);
  }    

  setSVGFilterValue(index, value) {
    this.json.svgfilters[index] = {...this.json.svgfilters[index], ...value}
  }

  addSVGFilter(obj = {}) {
    this.json.svgfilters.push(obj)
    return obj; 
  }

  createSVGFilter(data = {}) {
    return this.addSVGFilter(data)
  }  
}