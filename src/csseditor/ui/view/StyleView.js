import UIElement, { EVENT } from "../../../util/UIElement";

import { editor } from "../../../editor/editor";
import { DEBOUNCE, LOAD } from "../../../util/Event";
import Dom from "../../../util/Dom";
import { CSS_TO_STRING } from "../../../util/functions/func";
import { Project } from "../../../editor/items/Project";

export default class StyleView extends UIElement {

  template() {
    return /*html*/`
    <div class='style-view' style='position: absolute;display:inline-block;left:-1000px;'>
      <div ref='$svgArea'></div>
      <svg width="0" height="0">
        <defs>
          <marker id="start" markerWidth="8" markerHeight="8" refX="5" refY="5">
              <circle cx="5" cy="5" r="3" style="stroke: none; fill:#000000;"/>
          </marker>
          <marker id="head" orient="auto" markerWidth="10" markerHeight="10" refX=".5" refY="3">
            <path d="M0,0 V6 L5,3 Z" fill="red"></path>
          </marker>
        </defs>
      </svg>
    </div>
    `;
  }

  initialize() {
    super.initialize()

    this.refs.$head = Dom.create(document.head)
  }

  makeProjectStyle (item) {

    const keyframeString = item.toKeyframeString();
    const rootVariable = item.toRootVariableCSS()
    
    return /*html*/`<style type='text/css' data-id='${item.id}'>
      :root {
        ${CSS_TO_STRING(rootVariable)}
      }
      /* keyframe */
      ${keyframeString}
    </style>
    `
  }  

  makeStyle (item) {
    if (item.is('project')) {
      return this.makeProjectStyle(item);
    }

    const cssString = item.generateView(`[data-id='${item.id}']`)
    const boundCssString = item.generateViewBoundCSS(`[data-id='${item.id}']`)
    return /*html*/`
      <style type='text/css' data-id='${item.id}'>${cssString}</style>
      <style type='text/css' data-id='${item.id}-move'>${boundCssString}</style>
    ` + item.layers.map(it => {
      return this.makeStyle(it);
    }).join('')
  }

  makeStylePosition (item) {

    const boundCssString = item.generateViewBoundCSS(`[data-id='${item.id}']`)
    return /*html*/`
      <style type='text/css' data-id='${item.id}-move'>${boundCssString}</style>
      `
  }

  refreshStyleHead () {
    var project = editor.selection.currentProject || new Project()

    this.refs.$head.$$(`style`).forEach($style => $style.remove())

    // project setting 
    this.changeStyleHead(project)

    // artboard setting 
    project.artboards.forEach(item => this.changeStyleHead(item))
  }

  changeStyleHead (item) {
    var $temp = Dom.create('div')        

    $temp.html(this.makeStyle(item)).children().forEach($item => {
      this.refs.$head.append($item);
    })

  }

  changeStyleHeadPosition (item) {
    var $temp = Dom.create('div')        

    $temp.html(this.makeStylePosition(item)).children().forEach($item => {
      this.refs.$head.append($item);
    })

  }  

  refreshStyleHeadOne (item, isOnlyOne = false) {
    var list = [item]
    if (!isOnlyOne) {
      list = [item, ...item.allLayers]
    }

    var selector = list.map(it => {
      return `style[data-id="${it.id}"],style[data-id="${it.id}-move"]`
    }).join(',');

    this.refs.$head.$$(selector).forEach(it => {
      it.remove();
    })

    this.changeStyleHead(item)
  }


  refreshStyleHeadPositionOne (item) {
    var selector = `style[data-id="${item.id}-move"]`

    this.refs.$head.$$(selector).forEach(it => {
      it.remove();
    }) 

    this.changeStyleHeadPosition(item)
  }  


  makeSvg (project) {
    const SVGString = project.toSVGString ? project.toSVGString() : ''
    return `
      ${SVGString ? `<svg width="0" height="0">${SVGString}</svg>` : ''}
    `
  }

  [LOAD('$svgArea')] () {

    var project = editor.selection.currentProject || {  }

    return this.makeSvg(project)
  }   

  [EVENT('refreshComputedStyle') + DEBOUNCE(100)] (last) {
    var computedCSS = this.refs.$canvas.getComputedStyle(...last)
    
    this.emit('refreshComputedStyleCode', computedCSS)
  }

  // timeline 에서 테스트 할 때 이걸 활용할 수 있다. 
  // 움직이기 원하는 객체가 타임라인 전체라 
  // 전체를 리프레쉬 하는걸로 한다. 
  // 애니메이션이 진행되는 동안 임의의 객체는 없는 것으로 하자. 
  [EVENT('refreshStyleView', 'moveTimeline', 'playTimeline')] (current,  isOnlyOne = false) {   
    if (current) {
      this.load();
      this.refreshStyleHeadOne(current, isOnlyOne);
    } else {
      this.refresh()
    }
  }

  [EVENT('refreshSVGArea')] () {
    this.load('$svgArea');
  }

  [EVENT('refreshStylePosition')] () {
    editor.selection.each(item => {
      this.refreshStyleHeadPositionOne(item);
    })    
  }

  [EVENT('refreshSelectionStyleView')] () {
    editor.selection.each(item => {
      this.refreshStyleHeadOne(item, true);
    })
  }  

  refresh() {
    this.load();
    this.refreshStyleHead();
  }
}
