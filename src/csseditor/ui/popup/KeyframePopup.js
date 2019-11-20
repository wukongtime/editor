import { EVENT } from "../../../util/UIElement";
import OffsetEditor from "../property-editor/OffsetEditor";
import { INPUT } from "../../../util/Event";
import BasePopup from "./BasePopup";
import { editor } from "../../../editor/editor";

export default class KeyframePopup extends BasePopup {

  getTitle () {
    return editor.i18n('keyframe.popup.title')
  }

  components() {
    return {
      OffsetEditor
    }
  }

  initState() {
    return {
      name: 'none',
      offsets: []
    };
  }

  updateData(opt) {
    this.setState(opt, false); 
    this.emit("changeKeyframePopup", this.state);
  }

  getBody() {
    return /*html*/`
    <div class='keyframe-popup' ref='$popup'>
      <div class="box">
        ${this.templateForName()}
        ${this.templateForOffset()}
      </div>
    </div>`;
  }

  templateForOffset () {
    return /*html*/`
      <div>
        <OffsetEditor ref='$offsetEditor' />
      </div>
    `
  }

  templateForName() {
    return /*html*/`
      <div class='name'>
        <label>Name</label>
        <div class='input grid-1'>
          <input type='text' value='${this.state.name}' ref='$name'/>
        </div>
      </div>
    `
  }

  [INPUT('$name')] (e) {
    if (this.refs.$name.value.match(/^[a-zA-Z0-9\b]+$/)) {
      this.updateData({name : this.refs.$name.value })
    } else {
      e.preventDefault()
      e.stopPropagation()
      return false;
    }
  }
  
  getOffsetData () {
    var offsets = this.state.offsets.map(it => it)

    return { offsets }
  }

  refresh() {

    this.refs.$name.val(this.state.name);
    this.emit('showOffsetEditor', this.getOffsetData())
  }

  [EVENT('changeOffsetEditor')] (data) {
    this.updateData(data);
  }

  [EVENT("showKeyframePopup")](data) {
    this.setState(data);
    this.refresh();

    this.show(240);

  }

  [EVENT("hideKeyframePopup")]() {
    this.$el.hide();
  }
}
