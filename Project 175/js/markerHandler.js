var modelList = []

AFRAME.registerComponent("markerhandler", {
  init: async function () {
    var models = await this.getModels();

    this.el.addEventListener("markerFound", () => {
      var modelName = this.el.getAttribute("model_name");
      var barcodeValue = this.el.getAttribute("value");
      modelsArray.push({ model_name: modelName, barcode_value: barcodeValue });

      // Changing Model Visiblity
      models[barcodeValue]["models"].map(item => {
        var model = document.querySelector(`#${item.model_name}-${barcodeValue}`);
        model.setAttribute("visible", false);
      });

      // Changing Atom Visiblity
      var model = document.querySelector(`#${modelName}-${barcodeValue}`);
      atom.setAttribute("visible", true);
    });

    this.el.addEventListener("markerLost", () => {
      var modelName = this.el.getAttribute("model_name");
      var index = modelsArray.findIndex(x => x.model_name === modelName);
      if (index > -1) {
        modelsArray.splice(index, 1);
      }
    });
  },


  tick: async function () {
    if(modelList.length > 1){
        var isBaseModelPresent = this.isModelPresentInArray(modelList,"base")
        var messageText = document.querySelector("#message-text")

        if(!isBaseModelPresent){
            messageText.setAttribute("visible",true)
        } else {
            if(models === null){
                models = await this.getModels()
            }
        }
    }
  },

  isModelPresentInArray: function(){
    for(var i of arr){
        if(i.model_name === val){
            return true
        }
    }
    return false
  },
  
  getModelGeometry: function (models, modelName) {
    var barcodes = Object.keys(models)
    for (var barcode of barcodes){
        if(models[barcode].model_name === modelName){
            return {
                position: models[barcode]["placement_position"],
                rotation: models[barcode]["placement_rotation"],
                scale: models[barcode]["placement_scale"],
                model_url: models[barcode]["model_url"]
            }
        }
    }
  },
  getModels: function () {
    
  },
  placeTheModel: function (modelName, models) {
    var isListContainModel = this.isModelPresentInArray(modelList, modelName)
    if(isListContainModel){
        var distance = null
        var marker1 = document.querySelector(`#marker-base`)
        var marker2 = document.querySelector(`#marker-${modelName}`)

        distance = this.getDistance(marker1, marker2)
        if(distance < 1.25){
            var modelEl = document.querySelector(`#${modelName}`)
            modelEl.setAttribute("visible",false)

            var isModelPlaced = document.querySelector(`#model-${modelName}`)
            if(isModelPlaced === null){
                var el = document.createmodel("a-entity")
                var modelGeometry = this.getModelGeometry(models, modelName)
                el.setAttribute("id",`model-${modelName}`)
                el.setAttribute("gltf-model",`url(${modelGeometry.model_url})`)
                el.setAttribute("position",modelGeometry.position)
                el.setAttribute("rotation",modelGeometry.rotation)
                el.setAttribute("scale",modelGeometry.scale)
                marker1.appendChild(el)
            }
        }
    }
  },
  getDistance: function (elA, elB) {
    return elA.object3D.position.distanceTo(elB.object3D.position)
  },
});