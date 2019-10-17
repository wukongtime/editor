import { isFunction, clone, OBJECT_TO_CLASS, mapjoin } from "../../../util/functions/func";
import icon from "../icon/icon";
import {
  LOAD,
  CLICK,
  POINTERSTART,
  MOVE,
  END,
  DRAGOVER,
  PREVENT,
  DROP,
  DRAGSTART
} from "../../../util/Event";
import { editor } from "../../../editor/editor";
import UIElement, { EVENT } from "../../../util/UIElement";
import RangeEditor from "./RangeEditor";
import ColorViewEditor from "./ColorViewEditor";

import SelectEditor from "./SelectEditor";
import TextEditor from "./TextEditor";
import NumberRangeEditor from "./NumberRangeEditor";
import InputArrayEditor from "./InputArrayEditor";
import { RotaMatrixSVGFilter } from "../../../editor/svg-property/svg-filter/RotaMatrixSVGFilter";
import { MergeSVGFilter } from "../../../editor/svg-property/svg-filter/MergeSVGFilter";
import { GaussianBlurSVGFilter } from "../../../editor/svg-property/svg-filter/GaussianBlurSVGFilter";
import { MorphologySVGFilter } from "../../../editor/svg-property/svg-filter/MorphologySVGFilter";
import { CompositeSVGFilter } from "../../../editor/svg-property/svg-filter/CompositeSVGFilter";
import { TurbulenceSVGFilter } from "../../../editor/svg-property/svg-filter/TurbulenceSVGFilter";
import { DisplacementMapSVGFilter } from "../../../editor/svg-property/svg-filter/DisplacementMapSVGFilter";
import { ColorMatrixSVGFilter } from "../../../editor/svg-property/svg-filter/ColorMatrixSVGFilter";
import { ConvolveMatrixSVGFilter } from "../../../editor/svg-property/svg-filter/ConvolveMatrixSVGFilter";
import { SVGFilter } from "../../../editor/svg-property/SVGFilter";
import { FloodSVGFilter } from "../../../editor/svg-property/svg-filter/FloodSVGFilter";
import { BlendSVGFilter } from "../../../editor/svg-property/svg-filter/BlendSVGFilter";
import { DiffuseLightingSVGFilter } from "../../../editor/svg-property/svg-filter/DiffuseLightingSVGFilter";
import { SpecularLightingSVGFilter } from "../../../editor/svg-property/svg-filter/SpecularLightingSVGFilter";
import { SpotLightSVGFilter } from "../../../editor/svg-property/svg-filter/SpotLightSVGFilter";
import { PointLightSVGFilter } from "../../../editor/svg-property/svg-filter/PointLightSVGFilter";
import { DistantLightSVGFilter } from "../../../editor/svg-property/svg-filter/DistantLightSVGFilter";
import { ComponentTransferSVGFilter } from "../../../editor/svg-property/svg-filter/ComponentTransferSVGFilter";
import FuncFilterEditor from "./FuncFilterEditor";
import { OffsetSVGFilter } from "../../../editor/svg-property/svg-filter/OffsetSVGFilter";
import { Length } from "../../../editor/unit/Length";
import Dom from "../../../util/Dom";
import PathStringManager from "../../../editor/parse/PathStringManager";
import { DropShadowSVGFilter } from "../../../editor/svg-property/svg-filter/DropShadowSVGFilter";
import { SaturateSVGFilter } from "../../../editor/svg-property/svg-filter/SaturateSVGFilter";
import { HueRotateSVGFilter } from "../../../editor/svg-property/svg-filter/HueRotateSVGFilter";
import { LuminanceAlphaSVGFilter } from "../../../editor/svg-property/svg-filter/LuminanceAlphaSVGFilter";
import ColorMatrixEditor from "./ColorMatrixEditor";
import { TileSVGFilter } from "../../../editor/svg-property/svg-filter/TileSVGFilter";



var specList = {
  Tile: TileSVGFilter.spec,
  DropShadow: DropShadowSVGFilter.spec,
  Saturate: SaturateSVGFilter.spec,
  HueRotate: HueRotateSVGFilter.spec,
  LuminanceAlpha: LuminanceAlphaSVGFilter.spec,  
  Offset: OffsetSVGFilter.spec,
  ComponentTransfer: ComponentTransferSVGFilter.spec,
  SpecularLighting: SpecularLightingSVGFilter.spec,
  SpotLight: SpotLightSVGFilter.spec,
  PointLight: PointLightSVGFilter.spec,
  DistantLight:DistantLightSVGFilter.spec,  
  DiffuseLighting: DiffuseLightingSVGFilter.spec,
  Blend: BlendSVGFilter.spec,
  RotaMatrix: RotaMatrixSVGFilter.spec,
  Merge: MergeSVGFilter.spec,
  GaussianBlur: GaussianBlurSVGFilter.spec,
  Flood: FloodSVGFilter.spec,
  Morphology: MorphologySVGFilter.spec,
  Composite: CompositeSVGFilter.spec,
  Turbulence: TurbulenceSVGFilter.spec,
  DisplacementMap: DisplacementMapSVGFilter.spec,
  ColorMatrix: ColorMatrixSVGFilter.spec,
  ConvolveMatrix: ConvolveMatrixSVGFilter.spec
}; 

const filterTypes = [
  {label: 'GRAPHIC REFERENCES', items : [
    {label: 'Source Graphic', value:"SourceGraphic"},
    {label: 'Source Alpha', value:"SourceAlpha"},
    {label: 'Background Image', value:"BackgroundImage"},
    {label: 'Background Alpha', value:"BackgroundAlpha"},
    {label: 'Fill Paint', value:"FillPaint"},                
    {label: 'Stroke Paint', value:"StrokePaint"},
  ]},
  {label: 'SOURCES', items : [
    {label: 'Flood', value:"Flood"},
    {label: 'Turbulence', value:"Turbulence"},
    {label: 'Image', value:"Image"}
  ]},  
  {label: 'MODIFIER', items : [
    {label: 'Color Matrix', value:"ColorMatrix"},
    {label: 'Saturate', value:"Saturate"},
    {label: 'HueRotate', value:"HueRotate"},
    {label: 'Luminance To Alpha', value:"LuminanceAlpha"},
    {label: 'Drop Shadow', value:"DropShadow"},
    {label: 'Morphology', value:"Morphology"},
    {label: 'Convolve Matrix', value:"ConvolveMatrix"},
    {label: 'Offset', value:"Offset"},
    {label: 'Gaussian Blur', value:"GaussianBlur"},
    {label: 'Tile', value:"Tile"}
  ]},    
  {label: 'LIGHTING', items : [
    {label: 'Specular Lighting', value:"SpecularLighting"},
    {label: 'Diffuse Lighting', value:"DiffuseLighting"},
    {label: 'Point Light', value:"PointLight"},
    {label: 'Spot Light', value:"SpotLight"},
    {label: 'Distant Light', value:"DistantLight"}
  ]},     
  {label: 'COMBINERS', items : [
    {label: 'Blend', value:"Blend"},
    {label: 'Composite', value:"Composite"},
    {label: 'Merge', value:"Merge"},
    {label: 'DisplacementMap', value:"DisplacementMap"}
  ]},        
]

const makeFilterSelect = () => {
  return /*html*/`

  <div class='filter-item-list' ref="$filterSelect">

    ${mapjoin(filterTypes, f => {
      return /*html*/`
        <div class='group' label="${f.label}">
          ${mapjoin(f.items, i => {
            return /*html*/ ` <div class='item' draggable="true" value="${i.value}">${i.label}</div>`
          })}
        </div>
      `
    })}
  </div>
  `
}

export default class SVGFilterEditor extends UIElement {

  components() {
    return {
      ColorMatrixEditor,
      InputArrayEditor,
      NumberRangeEditor,
      RangeEditor,
      ColorViewEditor,
      SelectEditor,
      TextEditor,
      FuncFilterEditor
    }
  }

  initState() {
    var filters = (this.props.value || []).map(it => SVGFilter.parse(it))

    return {
      filters,
      selectedIndex: -1,
      selectedFilter: null
    }
  }

  template() {
    return /*html*/`
      <div class='svg-filter-editor filter-list'>
        <div class='left'>
          <div class='label' >
              ${makeFilterSelect()}
          </div>
        </div>
        <div  class='center'>
          <div class='graph'>
            <div class='drag-line-panel' ref='$dragLinePanel'></div>          
            <div class='connected-line-panel' ref='$connectedLinePanel'></div>
            <div class='graph-panel' ref='$graphPanel' droppable="true"></div>
          </div>
        </div>
        <div class='right'>
          <div class='filter-list' ref='$filterList'></div>
        </div>
      </div>`;
  }

  [DRAGSTART('$filterSelect .item')] (e) {
    var filter = e.$delegateTarget.attr('value');

    e.dataTransfer.setData('filter/type', filter);
  }

  [DRAGOVER('$graphPanel') + PREVENT] () {}
  [DROP('$graphPanel') + PREVENT] (e) {

    var offset  = {x: e.offsetX, y: e.offsetY  }

    var filterType = e.dataTransfer.getData('filter/type')

    this.makeFilterNode(filterType, { bound: offset })
  }

  makeFilterNode  (filterType, opt = {}) {
    this.state.filters.push(this.makeFilter(filterType, opt))
    this.state.selectedIndex = this.state.filters.length - 1; 
    this.state.selectedFilter = this.state.filters[this.state.selectedIndex]; 

    this.refresh();

    this.modifyFilter()    
  }

  getSpec(filterType) {
    return specList[filterType];
  }

  makeFilterEditorTemplate (s, filter, key) {

    var objectId = `${filter.type}${key}${this.state.selectedIndex}${Date.now()}`


    if (s.inputType === 'color-matrix') {
      return /*html*/`
        <div>
          <ColorMatrixEditor 
            ref='$colorMatrix${objectId}' 
            label="${s.title}"
            key="${key}"       
            column='${s.column}' 
            values='${filter[key].join(' ')}' 
            onchange="changeRangeEditor"
          />
        </div>
        `
    } else if (s.inputType === 'input-array') {
      return /*html*/`
        <div>
          <InputArrayEditor 
            ref='$inputArray${objectId}' 
            label="${s.title}"
            key="${key}"       
            column-label="R,G,B,A,M",
            row-label="R,G,B,A",
            column='${s.column}' 
            values='${filter[key].join(' ')}' 
            onchange="changeRangeEditor"
          />
        </div>
        `

    } else if (s.inputType === 'select') {

      var options = s.options

      if (isFunction(s.options)){
        options = s.options(this.state.filters)
      }

      return /*html*/`
        <div>
          <SelectEditor 
            ref='$select${objectId}' 
            label="${s.title}"
            options='${options}' 
            key="${key}"
            value='${filter[key].toString()}' 
            onchange="changeRangeEditor"             
          />
        </div>
        `
    } else if (s.inputType === 'text') {
      return /*html*/`
        <div>
          <TextEditor 
            ref='$text${objectId}' 
            label="${s.title}"
            key="${key}"
            value='${filter[key].toString()}' 
            onchange="changeTextEditor"
          />
        </div>
        `
    } else if (s.inputType === 'number-range') {  
      return /*html*/` 
        <div>
          <NumberRangeEditor 
            ref='$numberrange${objectId}' 
            label="${s.title}" 
            min="${s.min}"
            max="${s.max}"
            step="${s.step}"
            key="${key}" 
            value="${filter[key].toString()}" 
            onchange="changeRangeEditor" 
          />
        </div>
      `
    } else if (s.inputType === 'color') {
      return /*html*/`
        <div>
          <ColorViewEditor 
            ref='$colorview${objectId}' 
            label="${s.title}" 
            key="${key}"
            value="${filter[key].toString()}" 
            onchange="changeSVGFilterColorViewEditor" 
          />
        </div>
      `
    } else if (s.inputType === 'FuncFilter') {
      return /*html*/`
        <div>
          <FuncFilterEditor 
            ref='$funcFilter${objectId}' 
            label="${s.title}" 
            key="${key}"
            value="${filter[key].toString()}" 
            onchange="changeFuncFilterEditor" 
          />
        </div>
      `      
    }

    return /*html*/`
      <div>
        <RangeEditor 
          ref='$range${objectId}' 
          layout='block' 
          calc='false' 
          label="${s.title}" 
          min="${s.min}"
          max="${s.max}"
          step="${s.step}"
          key="${key}" 
          value="${filter[key].toString()}" 
          units="${s.units.join(',')}" 
          onchange="changeRangeEditor" 
        />
      </div>
    `
  }

  makeOneFilterTemplate(spec, filter) {
  return /*html*/`
    <div class="filter-item">
      <div class="title">
        <label>${filter.type}</label>
        <div class="filter-menu">
          <button type="button" class="del">${icon.remove}</button>
        </div>
      </div>
      <div class="filter-ui">
        ${Object.keys(spec).map(key => {
          return this.makeFilterEditorTemplate(spec[key], filter, key);
        }).join(' ')}

      </div>
    </div>
  `;
  }

  makeFilterTemplate(filter) {
    return this.makeOneFilterTemplate(
      this.getSpec(filter.type),
      filter
    );
  }

  [LOAD("$filterList")]() {

    if (this.state.selectedFilter  && this.state.selectedFilter.isSource() === false) {
      return this.makeFilterTemplate(this.state.selectedFilter);
    }

    return '';
  }

  modifyFilter () {

    this.state.filters.forEach(f => {
      if (f.isLight() && f.connected.length) {
        f.connected.forEach(c => {
          this.state.filters.filter(s => s.id === c.id).forEach(lightManager => {
            lightManager.reset({
              lightInfo: f.toLightString()
            })
          })
        })
      }
    })

    this.parent.trigger(this.props.onchange, this.props.key, this.state.filters)
  }

  makeFilter(type, opt = {}) {
    return SVGFilter.parse({ ...opt, type });
  }


  [CLICK("$filterSelect .item[value]")](e) {
    var filterType = e.$delegateTarget.attr('value');

    this.makeFilterNode(filterType);
  }

  [CLICK("$filterList .filter-menu .del")](e) {
    this.removeFilter(this.state.selectedFilter.id);
  }

  [LOAD('$graphPanel')] () {
    return this.makeGraphPanel();
  }

  selectFilter (index) {
    this.setState({
      selectedIndex: index,
      selectedFilter: this.state.filters[index]
    }, false)
    this.load('$filterList')
  }

  [POINTERSTART('$graphPanel .filter-node') + MOVE()  + END()] (e) {
    this.$target = e.$delegateTarget;
    this.$point = null; 
    this.pointType = 'object';
    this.pointIndex = 0; 
    var rect = this.refs.$graphPanel.rect();
    this.rect = rect;  

    var index = +this.$target.attr('data-index');    
    this.selectFilter(index);
    this.$target.onlyOneClass('selected');

    var  pointer = Dom.create(e.target);

    if (pointer.hasClass('out')) {
      this.$point = pointer;
      this.pointType = 'out';
      this.pointIndex = 0; 
    } else if (pointer.hasClass('in')) {
      this.$point = pointer;
      this.pointType = 'in'; 
      this.pointIndex = +pointer.attr('data-index');      
    } else {
      var filter = this.state.selectedFilter
      this.startXY = clone(filter.bound);

      this.inputPointList = []  
      
      this.inputPointList.push(...filter.connected.map(c => {
        return {
          obj: c.path, 
          index: 0,
          point: clone(c.path[0])
        }
      }))

      this.state.filters.forEach((it, filterIndex) => {

        it.connected.filter(c => c.id === filter.id).forEach(source =>  {
          this.inputPointList.push({
            obj: source.path, 
            index: source.path.length-1, 
            point: clone(source.path[source.path.length-1])
          })
        })
      })
    }

    if (this.pointType === 'in' || this.pointType === 'out') {
      var inRect = pointer.rect()
      var x = inRect.x - rect.x;
      var y = inRect.y - rect.y;

      var centerX = x + inRect.width/2;
      var centerY = y + inRect.height/2;

      this.startXY = {x: centerX, y: centerY };
    }

    this.startXY.dx = 0
    this.startXY.dy = 0; 

    this.load('$dragLinePanel');

  }

  [LOAD('$dragLinePanel')] () {
    if (this.pointType === 'in' || this.pointType === 'out') {
      var {x, y, dx, dy } = this.startXY;
      return /*html*/`
      <svg>
        <path class='drag-line' fill='transparent' stroke-width="1" stroke='block' d="M${x},${y}L${x + dx},${y + dy}Z" />
      </svg>
      `
    } else {
      return ''; 
    }
  }

  makeConnectedPath (points) {

    var manager = new PathStringManager();

    points.forEach((p, index) => {
      if (index === 0) {
        manager.M(p)
      } else {
        manager.L(p);
      }
    })
    manager.Z()

    return manager.d;
  }

  [LOAD('$connectedLinePanel')] () {

    return /*html*/`
      <svg>
        ${this.state.filters.map(it => {
          return it.connected.map(({id, path}) => {
            return /*html*/`
              <path class='connected-line' d="${this.makeConnectedPath(path)}" />
              <circle data-target-id='${id}' data-source-id="${it.id}" class='connected-remove-circle' cx="${(path[0].x + path[1].x) / 2 }" cy="${(path[0].y + path[1].y) / 2}" />
            `
          }).join('');
        }).join('')}
      </svg>
    `
  }

  [CLICK('$connectedLinePanel .connected-remove-circle')] (e) {
    var  [tid, sid] = e.$delegateTarget.attrs('data-target-id', 'data-source-id');

    var filters = this.state.filters; 
    filters.filter(it => it.id === sid).forEach(it => {
      it.connected = it.connected.filter(c => c.id != tid);
    });

    filters.filter(it => it.id === tid).forEach(it => {
      it.in = it.in.map(inObject => {
        if (inObject.id ==  sid) {
          return null; 
        }

        return inObject; 
      })
    });

    this.refresh();

    this.modifyFilter();    
  }

  getCenterXY ($target) {
    var inRect = $target.rect()
    var x = inRect.x - this.rect.x;
    var y = inRect.y - this.rect.y;

    var centerX = x + inRect.width/2;
    var centerY = y + inRect.height/2;

    return {x: centerX, y: centerY}
  }

  end (dx, dy) {

    if (this.pointType === 'in'|| this.pointType === 'out') {

      this.startXY.dx = dx; 
      this.startXY.dy = dy; 
      var filter = this.state.selectedFilter;

      var e = editor.config.get('bodyEvent')      

      var $target = Dom.create(e.target);
      var $targetNode = $target.closest('filter-node');
      
      if (this.pointType === 'out') {

        if ($target.hasClass('in')) {
          var center = this.getCenterXY($target);

          var targetFilter = this.state.filters[+$targetNode.attr('data-index')]
          if (targetFilter) {

            if (!targetFilter.hasLight() && filter.isLight()) {
              // light 계열은 lighting 에만 갈 수 있음.  
            } else {

              targetFilter.setIn(+$target.attr('data-index'), filter);
              filter.setConnected(targetFilter, [
                {x: this.startXY.x, y: this.startXY.y },
                {x: center.x, y: center.y }
              ])
            }

          }
        }
      } else if (this.pointType === 'in') {
        if ($target.hasClass('out'))  {
          var center = this.getCenterXY($target);          
          var targetFilter = this.state.filters[+$targetNode.attr('data-index')]
          if (targetFilter) {

            if (filter.hasLight() && !targetFilter.isLight()) {
              // lighting  는 light 와  연결된다. 
            } else {
              filter.setIn(this.pointIndex, targetFilter);
              targetFilter.setConnected(filter, [
                {x: center.x, y: center.y}, 
                {x: this.startXY.x, y: this.startXY.y }
              ])
            }
                      
          }
        }
      }

      this.pointType = '';
  
    }

    this.load('$dragLinePanel');
    this.load('$connectedLinePanel');

    this.modifyFilter();    
  }

  move (dx, dy) {


    var filter = this.state.selectedFilter;
    if (filter) {
      this.startXY.dx = dx; 
      this.startXY.dy = dy; 

      if (this.pointType === 'in') {
        this.load('$dragLinePanel')
      } else if (this.pointType === 'out') {
        this.load('$dragLinePanel')
      } else {

        filter.reset({
          bound: { x: this.startXY.x + dx, y : this.startXY.y + dy }
        })
  
        this.$target.css({
          left: Length.px(filter.bound.x),
          top: Length.px(filter.bound.y),
        })

        this.inputPointList.forEach(it => {
          it.obj[it.index] = {x: it.point.x + dx, y: it.point.y + dy } 
        })
        
        this.load('$connectedLinePanel');
      }

    }

  }

  makeGraphPanel() {

    return this.state.filters.map((it, index) => {

      return /*html*/`
        <div class='filter-node ${OBJECT_TO_CLASS({
          'selected': index ===  this.state.selectedIndex
        })}' data-type="${it.type}" data-index="${index}" data-filter-id="${it.id}" style='left: ${it.bound.x}px;top: ${it.bound.y}px;'>
          <div class='label'>${it.type}</div>
          <div class='remove'>${icon.close}</div>
          <div class='preview'></div>
          <div class='in-list'>
            ${[...Array(it.getInCount())].map((itIn, inIndex) => {
              return /*html*/`<div class='in' data-index='${inIndex}'></div>`
            }).join('')}
          </div>
          
          <div class='out' data-index="0">${icon.chevron_right}</div>
          ${it.hasLight() ? /*html*/`<div class='light'  data-index="0"></div>` : ''}
        </div>
      `
    })
  }

  [EVENT('changeSVGFilterColorViewEditor')] (key, color, params) {
    this.trigger('changeRangeEditor', key, color, params)
  }


  [EVENT('changeFuncFilterEditor')] (key, value) {
    var filter =  this.state.selectedFilter;
    if (filter) {
      filter.reset({
        [key]: value
      })
    }
  
    this.modifyFilter();
  }    

  [EVENT('changeRangeEditor')] (key, value) {
    var filter =  this.state.selectedFilter;
    if (filter) {
      filter.reset({
        [key]: value
      })
    }
  
    this.modifyFilter();
  }  

  [EVENT('changeTextEditor')] (key, value) {
    var filter =  this.state.selectedFilter;
    if (filter) {
      filter.reset({
        [key]: value
      })
    }
  
    this.modifyFilter();
  }

  removeFilter (id) {

    var filters  = this.state.filters.filter(it => it.id != id);
    filters.forEach(it => {
      it.connected = it.connected.filter(c => c.id != id);
      it.in = it.in.filter(c => c.id != id);
    })

    if (this.state.selectedFilter.id === id) {
      this.state.selectedFilter = null; 
      this.state.selectedIndex = -1; 
    }

    this.setState({
      filters
    })

    this.modifyFilter();
  }

  [CLICK('$graphPanel .filter-node .remove')] (e) {
    var $target = e.$delegateTarget.closest('filter-node');
    var index = +$target.attr('data-index');
    var f = this.state.filters[index]

    this.removeFilter(f.id);
  }
}
