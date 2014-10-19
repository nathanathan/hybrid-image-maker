$(function(){
ImageChooser = Backbone.View.extend({
    urlChange : _.debounce(function(evt) {
        console.log('test')
        var img = this.$('.url').val();
        var that = this;
        
        if(!img || img === this.prevVal) return;
        
        this.$('#img-error').empty();
        
        this.prevVal = img;
        
        var match = img.match(/(\/([^.]+\.[^.]+))$/i);
        //If there is no file ext we assume jpeg
        var ext = 'jpeg';
        var name = 'img.' + ext;
        if(match) {
            name = match[match.length - 1];
            ext = name.split('.')[1];
        }
   
        var xhr = new XMLHttpRequest();
        xhr.open('GET', img, true);
        xhr.responseType = 'arraybuffer';
        xhr.onload = xhr.onerror = function(e) {
            if(xhr.status !== 200) {
                console.log(xhr);
                if(!xhr.statusText) {
                    that.$('#img-error').text("Could not load image: It may be hosted on a domain that doesn't allow CORs");
                } else {
                    that.$('#img-error').text('Could not load image: ' + xhr.statusText);
                }
                return;
            }
            that.model.set({
                name: name,
                dataURL: 'data:image/' + ext + ';base64,' + base64ArrayBuffer.encode(e.currentTarget.response)
            });
            
            that.render();
        };
        xhr.send();
    
    }, 600),
    uploadfile : function(evt) {console.log('test');
        var that = this;
        this.$("#img-error").empty();
        var files = evt.target.files;
        var file = files[0];
        var reader = new FileReader();
        reader.onload = function(e) {
            that.model.set({
                name: file.name,
                dataURL: e.target.result
            });
            that.render();
        };
        try {
            reader.readAsDataURL(file);
        } catch(e) {
            $("#img-error").append("<p>Could not read file.</p>");
            throw e;
        }
        
        //Clear the file input so the form can be updated:
        this.$('.uploadfile').val("");
    },
    render: function(){
        if(this.model.has('dataURL')) {
            this.$(".image-out").html(
                '<img src="' + this.model.get('dataURL') + '" ></img>' +
                '<a class="clear btn">clear</a>'
            );
        } else {
            this.$(".image-out").html("");
        }
    },
    clear : function(){
        this.model.clear();
        this.render();
    },
    events : {
        'keypress .url' : 'urlChange',
        'blur .url' : 'urlChange',
        'paste .url' : 'urlChange',
        'change .uploadfile' : 'uploadfile',
        'click .clear' : 'clear'
    }
});
ImageA = new Backbone.Model()
new ImageChooser({
    el: $('#image-a'),
    model: ImageA
});
ImageA.on('change', function(){
    loadImage(ImageA.get('dataURL'));
});
});