(this["webpackJsonpgraphene-editor"]=this["webpackJsonpgraphene-editor"]||[]).push([[0],{113:function(e,t,n){},115:function(e,t,n){"use strict";n.r(t);var o=n(2),i=n(0),a=n.n(i),s=n(26),r=n.n(s),c=n(12),l=n(14),d=n(13),u=n(44),p=n(10),h=function(e){Object(l.a)(n,e);var t=Object(d.a)(n);function n(e){var i;return Object(c.a)(this,n),(i=t.call(this,e)).render=function(){return[Object(o.jsx)(p.a,{x:i.props.x,y:i.props.y,radius:15/i.props.scale,fill:i.state.hovered?i.getColor():"",onMouseEnter:function(){return i.setState({hovered:!0})},onMouseLeave:function(){return i.setState({hovered:!1})},onClick:function(){return i.handleClick()}}),Object(o.jsx)(p.a,{x:i.props.x,y:i.props.y,radius:8/i.props.scale,fill:i.getColor(),onMouseEnter:function(){return i.setState({hovered:!0})},onMouseLeave:function(){return i.setState({hovered:!1})},onClick:function(){return i.handleClick()}})]},i.getColor=function(){return i.props.selected?"red":"black"},i.updateScale=function(e){i.setState({scale:e})},i.handleClick=function(){i.props.addToSelection(i.props.id)},i.state={hovered:!1,scale:e.scale},i}return n}(a.a.Component),f=function(e){Object(l.a)(n,e);var t=Object(d.a)(n);function n(e){var i;return Object(c.a)(this,n),(i=t.call(this,e)).render=function(){return[Object(o.jsx)(p.c,{points:i.props.points,stroke:i.state.hovered?i.getColor():"",strokeWidth:12/i.props.scale,onMouseEnter:function(){return i.setState({hovered:!0})},onMouseLeave:function(){return i.setState({hovered:!1})},onClick:function(){return i.handleClick()}}),Object(o.jsx)(p.c,{points:i.props.points,stroke:i.getColor(),strokeWidth:(i.state.hovered?5:4)/i.props.scale,onMouseEnter:function(){return i.setState({hovered:!0})},onMouseLeave:function(){return i.setState({hovered:!1})},onClick:function(){return i.handleClick()}})]},i.getColor=function(){return i.props.selected?"red":"black"},i.updateScale=function(e){},i.handleClick=function(){i.props.addToSelection(i.props.id)},i.state={hovered:!1},i}return n}(a.a.Component),g=function(e){Object(l.a)(n,e);var t=Object(d.a)(n);function n(e){var i;return Object(c.a)(this,n),(i=t.call(this,e)).componentDidMount=function(){window.addEventListener("click",i.handleClick),window.addEventListener("resize",i.onResize),window.addEventListener("wheel",i.zoomStage),window.addEventListener("mousedown",i.startDragging),window.addEventListener("mouseup",i.stopDragging),window.addEventListener("mousemove",i.dragMove),i.createCanvas()},i.createCanvas=function(){var e=2*window.innerWidth/3/i.props.width,t=2*window.innerHeight/3/i.props.height;i.defaultScale=Math.min(e,t),i.setState({offsetx:i.props.width/2,offsety:i.props.height/2,currentScale:Math.min(e,t),minScale:Math.min(e,t),centeringX:0,centeringY:0},(function(){var e=i.getScreenPositionFromStage(i.props.width/2,i.props.height/2);console.log(e),i.setState({centeringX:(window.innerWidth-e.x)/i.state.currentScale/2,centeringY:(window.innerHeight-e.y)/i.state.currentScale/2},(function(){i.setState({squares:i.currentSquares()})}))}))},i.startDragging=function(e){i.setState({dragStart:i.getStagePositionFromScreen(e.pageX,e.pageY)},(function(){i.setState({dragging:!0})}))},i.dragMove=function(e){if(i.state.dragging){var t=i.state.dragStart,n=i.getStagePositionFromScreen(e.pageX,e.pageY);i.setState({dragged:{x:i.state.dragged.x+n.x-t.x,y:i.state.dragged.y+n.y-t.y},dragStart:n})}},i.stopDragging=function(e){i.setState({dragging:!1},(function(){}))},i.render=function(){return Object(o.jsx)("div",{id:"canvas-container",children:Object(o.jsxs)(p.e,{width:i.state.totalWidth,height:i.state.totalHeight,scaleX:i.defaultScale,scaleY:i.defaultScale,ref:function(e){return i.stage=e},children:[Object(o.jsxs)(p.b,{x:i.state.centeringX,y:i.state.centeringY,children:[Object(o.jsx)(p.d,{width:i.props.width,height:i.props.height,stroke:"black",strokeWidth:.02,fill:"rgb(220, 220, 220"}),i.props.connections.map((function(e){return i.getConnectionData(e).map((function(e){return Object(o.jsx)(f,{id:e.id,scale:i.state.currentScale,points:e.points,selected:"connection"===i.props.selection.type&&i.props.selection.id===e.id,addToSelection:function(e){return i.addConnectionToSelection(e)}},e.key)}))})),i.props.atoms.map((function(e){var t=i.coordinateToScreenCoordinate(e.x,e.y);return Object(o.jsx)(h,{id:e.id,scale:i.state.currentScale,x:t.x,y:t.y,selected:"atom"===i.props.selection.type&&i.props.selection.ids.includes(e.id),addToSelection:function(e){return i.addAtomToSelection(e)}},e.id)}))]}),Object(o.jsxs)(p.b,{children:[Object(o.jsx)(p.d,{width:i.state.centeringX,height:10*i.props.height,fill:"#fff"}),Object(o.jsx)(p.d,{x:i.state.centeringX+i.props.width,width:i.state.centeringX,height:10*i.props.height,fill:"#fff"}),Object(o.jsx)(p.d,{width:10*i.props.width,height:i.state.centeringY,fill:"#fff"}),Object(o.jsx)(p.d,{y:i.state.centeringY+i.props.height,width:10*i.props.width,height:i.state.centeringY,fill:"#fff"})]})]})})},i.zoomStage=function(e){if(!i.state.mouseOverMenu&&!i.state.mouseOverTimeline&&null!==i.stage){var t=1;e.deltaY<0&&(t+=.4),e.deltaY>0&&(t-=.4);var n=i.getCurrentScale()*t;i.zoomStageTo(window.innerWidth/2,window.innerHeight/2,n)}},i.zoomStageTo=function(e,t,n){if(n<i.state.minScale&&(n=i.state.minScale),null!==i.stage){var o=i.getCurrentScale(),a=i.getCurrentPosition(),s=[e-(e-a.x)*n/o,t-(t-a.y)*n/o];i.setState({currentScale:n}),i.stage.to({scaleX:n,scaleY:n,x:s[0],y:s[1],duration:.1,onFinish:function(){}})}},i.currentSquares=function(){for(var e=i.getStagePositionFromScreen(0,0),t=i.getStagePositionFromScreen(window.innerWidth,window.innerHeight),n=Math.floor(e.x/i.props.height-1),o=Math.ceil(t.x/i.props.height+1),a=Math.floor(e.y/i.props.width-1),s=Math.ceil(t.y/i.props.width+1),r=[],c=n;c<=o;c++)r.push(c);for(var l=[],d=a;d<=s;d++)l.push(d);return console.log({rows:r,columns:l}),{rows:r,columns:l}},i.handleClick=function(e){},i.getStagePositionFromScreen=function(e,t){var n=i.state.currentScale,o=i.getCurrentPosition(),a=(e-o.x)/n,s=(t-o.y)/n;return{x:a-i.state.offsetx-i.state.centeringX,y:s-i.state.offsety-i.state.centeringY}},i.getScreenPositionFromStage=function(e,t){var n=i.state.currentScale,o=i.getCurrentPosition(),a=(e+i.state.offsetx+i.state.centeringX)*n,s=(t+i.state.offsety+i.state.centeringY)*n;return{x:a+o.x,y:s+o.y}},i.connectionIndexByID=function(e){for(var t=0;t<i.props.connections.length;t++)if(i.props.connections[t].id===e)return t;return null},i.atomIndexByID=function(e){for(var t=0;t<i.props.atoms.length;t++)if(i.props.atoms[t].id===e)return t;return null},i.getConnectionData=function(e){var t=i.props.atoms[i.atomIndexByID(e.a)],n=i.props.atoms[i.atomIndexByID(e.b)],o=Object(u.a)({},t),a=Object(u.a)({},n),s=!1,r=i.coordinateToScreenCoordinate(t.x,t.y),c=i.coordinateToScreenCoordinate(a.x,a.y),l=i.coordinateToScreenCoordinate(o.x,o.y),d=i.coordinateToScreenCoordinate(n.x,n.y),p=c.x-r.x,h=c.y-r.y;p>i.props.width/2?(c.x-=i.props.width,l.x+=i.props.width,s=!0):p<-i.props.width/2&&(c.x+=i.props.width,l.x-=i.props.width,s=!0),h>i.props.height/2?(c.y-=i.props.height,l.y+=i.props.height,s=!0):h<-i.props.height/2&&(c.y+=i.props.height,l.y-=i.props.height,s=!0);var f=[{key:e.id,id:e.id,points:[r.x,r.y,c.x,c.y]}];return s&&f.push({key:e.id+1e10,id:e.id,points:[l.x,l.y,d.x,d.y]}),f},i.coordinateToScreenCoordinate=function(e,t){var n=(e+i.state.offsetx+i.state.dragged.x)%i.props.width,o=(t+i.state.offsety+i.state.dragged.y)%i.props.height;return{x:n=(n+i.props.width)%i.props.width,y:o=(o+i.props.height)%i.props.height}},i.onResize=function(){},i.getCurrentScale=function(){var e=i.defaultScale;try{e=i.stage.scaleX()}catch(t){console.log(t)}return e},i.getCurrentPosition=function(){var e={x:0,y:0};try{e=i.stage.absolutePosition()}catch(t){}return e},i.addAtomToSelection=function(e){i.props.addAtomToSelection(e)},i.addConnectionToSelection=function(e){i.props.addConnectionToSelection(e)},i.defaultScale=50,i.state={dragging:!1,selection:{},offsetx:0,offsety:0,squares:{rows:[0],columns:[0]},centeringX:0,centeringY:0,totalWidth:window.innerWidth,totalHeight:window.innerHeight,currentScale:50,minScale:50,dragStart:{x:0,y:0},dragged:{x:0,y:0},createCanvas:function(){return i.createCanvas()}},i.stage=a.a.createRef(),i}return n}(a.a.Component),m=n(130),x=n(56),v=n.n(x),b=n(57),y=n.n(b),S=n(59),j=n.n(S),w=n(58),C=n.n(w),O=n(61),B=n.n(O),T=n(60),I=n.n(T),A=n(54),k=n(39),z=function(e){Object(l.a)(n,e);var t=Object(d.a)(n);function n(e){var o;return Object(c.a)(this,n),(o=t.call(this,e)).startUpload=function(){o.uploader.click()},o.uploadFile=o.uploadFile.bind(Object(k.a)(o)),o.uploader=a.a.createRef(),o}return Object(A.a)(n,[{key:"uploadFile",value:function(e){var t=this,n=e.target.files[0];console.log(n),n&&n.text().then((function(e){console.log(e),t.props.loadText(e),document.getElementsByName("fileInput")[0].value=""}))}},{key:"render",value:function(){var e=this;return Object(o.jsx)("span",{id:"file-upload-container",children:Object(o.jsx)("input",{type:"file",name:"fileInput",ref:function(t){return e.uploader=t},onChange:this.uploadFile})})}}]),n}(a.a.Component),D=function(e){Object(l.a)(n,e);var t=Object(d.a)(n);function n(e){var i;return Object(c.a)(this,n),(i=t.call(this,e)).render=function(){return Object(o.jsx)("div",{id:"menu-container",children:Object(o.jsxs)("div",{className:"vertical-center",children:[Object(o.jsx)("div",{className:"button-container",children:Object(o.jsxs)(m.a,{disabled:!i.canAddConnection(),size:"medium",style:{fontSize:14},"aria-label":"add",onClick:function(){return i.addConnectionBetweenSelectedAtoms()},children:[Object(o.jsx)(v.a,{size:"large"}),Object(o.jsx)("span",{className:"button-text",children:"ADD CONNECTION"})]})}),Object(o.jsx)("div",{className:"button-container",children:Object(o.jsxs)(m.a,{disabled:!i.canRemoveConnection(),size:"medium",style:{fontSize:14},"aria-label":"remove",onClick:function(){return i.removeSelectedConnection()},children:[Object(o.jsx)(y.a,{size:"large"}),Object(o.jsx)("span",{className:"button-text",children:"REMOVE CONNECTION"})]})}),Object(o.jsx)("div",{className:"button-container",children:Object(o.jsxs)(m.a,{disabled:!i.canReplaceByAtom(),size:"medium",style:{fontSize:14},"aria-label":"replace-by-one",onClick:function(){return i.replaceSelectionByAtom()},children:[Object(o.jsx)(C.a,{size:"large"}),Object(o.jsx)("span",{className:"button-text",children:"REPLACE TRIO BY ATOM"})]})}),Object(o.jsx)("div",{className:"button-container",children:Object(o.jsxs)(m.a,{disabled:!i.canReplaceByTrio(),size:"medium",style:{fontSize:14},"aria-label":"replace-by-three",onClick:function(){return i.replaceSelectionByTrio()},children:[Object(o.jsx)(j.a,{size:"large"}),Object(o.jsx)("span",{className:"button-text",children:"REPLACE ATOM BY TRIO"})]})}),Object(o.jsx)("div",{className:"button-container",children:Object(o.jsxs)(m.a,{size:"medium",onClick:function(){i.fileInput.startUpload()},style:{fontSize:14},"aria-label":"upload",children:[Object(o.jsx)(I.a,{size:"large"}),Object(o.jsx)("span",{className:"button-text",children:"IMPORT FILE"}),Object(o.jsx)(z,{ref:function(e){return i.fileInput=e},loadText:function(e){return i.loadText(e)}})]})}),Object(o.jsx)("div",{className:"button-container",children:Object(o.jsxs)(m.a,{size:"medium",onClick:function(){i.downloadFile()},style:{fontSize:14},"aria-label":"download",children:[Object(o.jsx)(B.a,{size:"large"}),Object(o.jsx)("span",{className:"button-text",children:"EXPORT FILE"})]})})]})})},i.canReplaceByTrio=function(){return"atom"===i.props.selection.type&&1===i.props.selection.ids.length},i.canReplaceByAtom=function(){return"atom"===i.props.selection.type&&3===i.props.selection.ids.length},i.connectionIndexByAtoms=function(e,t){for(var n=0;n<i.props.connections.length;n++)if(i.props.connections[n].a===e&&i.props.connections[n].b===t||i.props.connections[n].b===e&&i.props.connections[n].a===t)return n;return null},i.canAddConnection=function(){return"atom"===i.props.selection.type&&2===i.props.selection.ids.length&&null===i.connectionIndexByAtoms(i.props.selection.ids[0],i.props.selection.ids[1])},i.canRemoveConnection=function(){return"connection"===i.props.selection.type},i.removeSelectedConnection=function(){i.props.removeSelectedConnection()},i.addConnectionBetweenSelectedAtoms=function(){i.props.addConnectionBetweenSelectedAtoms()},i.replaceSelectionByAtom=function(){i.props.replaceSelectionByAtom()},i.replaceSelectionByTrio=function(){i.props.replaceSelectionByTrio()},i.loadText=function(e){i.props.loadText(e)},i.downloadFile=function(){i.props.downloadFile()},i.state={},i.fileInput=a.a.createRef(),i}return n}(a.a.Component),F=function(e){Object(l.a)(n,e);var t=Object(d.a)(n);function n(e){var i;return Object(c.a)(this,n),(i=t.call(this,e)).totalConnections=0,i.totalAtoms=0,i.render=function(){return Object(o.jsxs)("div",{children:[Object(o.jsx)(g,{ref:function(e){return i.canvas=e},selection:i.state.selection,atoms:i.state.atoms,connections:i.state.connections,width:i.state.width,height:i.state.height,addAtomToSelection:function(e){return i.addAtomToSelection(e)},addConnectionToSelection:function(e){return i.addConnectionToSelection(e)}}),Object(o.jsx)(D,{selection:i.state.selection,atoms:i.state.atoms,connections:i.state.connections,removeSelectedConnection:function(){return i.removeSelectedConnection()},addConnectionBetweenSelectedAtoms:function(){return i.addConnectionBetweenSelectedAtoms()},replaceSelectionByAtom:function(){return i.replaceSelectionByAtom()},replaceSelectionByTrio:function(){return i.replaceSelectionByTrio()},loadText:function(e){return i.loadText(e)},downloadFile:function(){return i.downloadFile()}})]})},i.loadText=function(e){for(var t=e.split("\n"),n=parseFloat(t[0]),o=parseFloat(t[1]),a=[],s=[],r=4;r<t.length;r++){var c=t[r].split(/\s+/);4===c.length?(a.push({id:parseInt(c[0]),x:parseFloat(c[1]),y:parseFloat(c[2]),z:parseFloat(c[3])}),i.totalAtoms++):3===c.length&&(s.push({id:parseInt(c[0]),a:parseInt(c[1]),b:parseInt(c[2])}),i.totalConnections++)}i.setState({atoms:a,connections:s,width:n,height:o},(function(){i.canvas.createCanvas()}))},i.downloadFile=function(){var e="";e+=i.state.width+"\n",e+=i.state.height+"\n",e+="\n\n";for(var t=0;t<i.state.atoms.length;t++){var n=i.state.atoms[t];e+=n.id+" "+n.x+" "+n.y+" "+n.z+"\n"}for(var o=0;o<i.state.connections.length;o++){var a=i.state.connections[o];e+=a.id+" "+a.a+" "+a.b+"\n"}var s=document.createElement("a");s.setAttribute("href","data:text/plain;charset=utf-8,"+encodeURIComponent(e)),s.setAttribute("download","graphene-sample"),s.style.display="none",document.body.appendChild(s),s.click(),document.body.removeChild(s)},i.addAtomToSelection=function(e){var t=i.state.selection;if("atom"===t.type){if(t.ids.includes(e)){var n=t.ids.indexOf(e);t.ids.splice(n,1)}else t.ids.push(e);i.setState({selection:t})}else i.setState({selection:{type:"atom",ids:[e]}})},i.addConnectionToSelection=function(e){var t=i.state.selection;"connection"===t.type&&t.id===e?i.setState({selection:{}}):i.setState({selection:{type:"connection",id:e}})},i.removeSelectedConnection=function(){var e=i.state.selection.id;console.log("removing connection "+e),i.removeConnectionByID(e)},i.removeConnectionByID=function(e){var t=i.connectionIndexByID(e),n=i.state.connections;n.splice(t,1),i.setState({selection:{},connections:n})},i.removeAtomByID=function(e){var t=i.atomIndexByID(e),n=i.state.atoms;n.splice(t,1),i.setState({selection:{},atoms:n})},i.addConnectionBetweenSelectedAtoms=function(){var e=i.state.connections;e.push({id:i.totalConnections++,a:i.state.selection.ids[0],b:i.state.selection.ids[1]}),i.setState({connections:e})},i.addConnectionBetweenAtoms=function(e,t){var n=i.state.connections;n.push({id:i.totalConnections++,a:e.id,b:t.id}),i.setState({connections:n})},i.closestToNumber=function(e,t){for(var n=t[0],o=Math.abs(t[0]-e),i=0;i<t.length;i++)Math.abs(t[i]-e)<o&&(n=t[i],o=Math.abs(t[i]-e));return n},i.distanceBetween=function(e,t){return i.distanceTo(e,t.x,t.y)},i.distanceTo=function(e,t,n){var o=i.closestToNumber(t,[e.x,e.x-i.state.width,e.x+i.state.width]),a=i.closestToNumber(n,[e.y,e.y-i.state.height,e.y+i.state.height]);return Math.sqrt((t-o)*(t-o)+(n-a)*(n-a))},i.closestAtom=function(e,t){for(var n=i.state.atoms[0],o=1e10,a=0;a<i.state.atoms.length;a++){var s=i.distanceTo(i.state.atoms[a],e,t);s<o&&(o=s,n=i.state.atoms[a])}return n},i.replaceSelectionByAtom=function(){for(var e=i.state.atoms,t=i.state.connections,n=i.totalAtoms,o=i.state.selection.ids,a={x:0,y:0,z:0},s=0,r=0,c=0,l=0;l<o.length;l++){var d=i.atomIndexByID(o[l]),u=e[d];a={x:(s+=i.closestToNumber(a.x,[u.x,u.x-i.state.width,u.x+i.state.width])/3)*(3-l),y:(r+=i.closestToNumber(a.y,[u.y,u.y-i.state.height,u.y+i.state.height])/3)*(3-l),z:(c+=u.z/3)*(3-l)},e.splice(d,1)}e.push({id:n,x:s,y:r,z:c});for(var p=[],h=0;h<i.state.selection.ids.length;h++)for(var f=i.state.selection.ids[h],g=t.length-1;g>=0;g--){var m=t[g];m.a===f&&(p.includes(m.b)?i.removeConnectionByID(m.id):(m.a=n,p.push(m.b))),m.b===f&&(p.includes(m.a)?i.removeConnectionByID(m.id):(m.b=n,p.push(m.a)))}i.totalAtoms++,i.setState({selection:{},atoms:e,connections:t})},i.replaceSelectionByTrio=function(){for(var e=i.state.atoms,t=i.state.connections,n=i.state.selection.ids[0],o=1e10,a=0;a<t.length;a++){var s=t[a];if(s.a===n){var r=i.distanceBetween(e[i.atomIndexByID(n)],e[i.atomIndexByID(s.b)]);r<o&&(o=r)}if(s.b===n){var c=i.distanceBetween(e[i.atomIndexByID(n)],e[i.atomIndexByID(s.a)]);c<o&&(o=c)}}var l=e[i.atomIndexByID(n)];i.removeAtomByID(n);var d=l.x,u=l.y,p=l.z,h={id:i.totalAtoms++,x:d+o/2,y:u,z:p},f={id:i.totalAtoms++,x:d-o/2,y:u,z:p},g={id:i.totalAtoms++,x:d,y:u-o/2,z:p};e.push(h),e.push(f),e.push(g),i.addConnectionBetweenAtoms(h,f),i.addConnectionBetweenAtoms(f,g),i.addConnectionBetweenAtoms(g,h);for(var m=0;m<t.length;m++){var x=t[m],v=null;if(x.a===n&&(v=x.b),x.b===n&&(v=x.a),null!==v){var b=e[i.atomIndexByID(v)],y=h,S=i.distanceBetween(b,h);i.distanceBetween(b,f)<S&&(y=f,S=i.distanceBetween(b,f)),i.distanceBetween(b,g)<S&&(y=g),x.a===n&&(x.a=y.id),x.b===n&&(x.b=y.id)}}i.setState({selection:{},atoms:e,connections:t})},i.connectionIndexByID=function(e){for(var t=0;t<i.state.connections.length;t++)if(i.state.connections[t].id===e)return t;return null},i.atomIndexByID=function(e){for(var t=0;t<i.state.atoms.length;t++)if(i.state.atoms[t].id===e)return t;return null},i.state={selection:{},atoms:[],connections:[],width:5,height:5},i.canvas=a.a.createRef(),i}return n}(a.a.Component),M=function(e){e&&e instanceof Function&&n.e(3).then(n.bind(null,131)).then((function(t){var n=t.getCLS,o=t.getFID,i=t.getFCP,a=t.getLCP,s=t.getTTFB;n(e),o(e),i(e),a(e),s(e)}))};n(113);r.a.render(Object(o.jsx)(a.a.StrictMode,{children:Object(o.jsx)(F,{})}),document.getElementById("root")),M()}},[[115,1,2]]]);
//# sourceMappingURL=main.ebb4ff19.chunk.js.map