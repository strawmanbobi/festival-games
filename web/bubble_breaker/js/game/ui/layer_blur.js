var LayerBlur = cc.Layer.extend({
  ctor: function (blurRadius, maskColor) {
      this._super();

      if(!('opengl' in cc.sys.capabilities)){
        return cc.log('no support opengl shader');
      }
      // create shader program
      var program = cc.GLProgram.create(s_gassian_blur_vsh, s_gassian_blur_fsh);
      program.addAttribute(cc.ATTRIBUTE_NAME_POSITION, cc.VERTEX_ATTRIB_POSITION);
      program.addAttribute(cc.ATTRIBUTE_NAME_COLOR, cc.VERTEX_ATTRIB_COLOR);
      program.addAttribute(cc.ATTRIBUTE_NAME_TEX_COORD, cc.VERTEX_ATTRIB_TEX_COORDS);
      program.link();
      program.updateUniforms();

      // define custom uniforms
      var resolutionUni = program.getUniformLocationForName("resolution");
      var radiusUni = program.getUniformLocationForName("radius");
      var dirUni = program.getUniformLocationForName("dir");

      // draw current scene into render_texture
      var bgTex = cc.RenderTexture.create(cc.visibleRect.width, cc.visibleRect.height);
      bgTex.begin();
      cc.director.getRunningScene().visit();
      bgTex.end();

      // step 1: do horizontal blur on bgTex

      // setup uniform
      program.use();
      program.setUniformLocationF32(resolutionUni, cc.visibleRect.width);
      program.setUniformLocationWith2f(dirUni, 1, 0);
      program.setUniformLocationF32(radiusUni, blurRadius);

      var horizontalBlur = cc.Sprite.create(bgTex.getSprite().getTexture());
      horizontalBlur.attr({anchorX: 0, anchorY: 0});
      horizontalBlur.shaderProgram = program;

      var horizontalBlurTex = cc.RenderTexture.create(cc.visibleRect.width, cc.visibleRect.height);
      horizontalBlurTex.begin();
      horizontalBlur.visit();
      horizontalBlurTex.end();

      // step 2: do vertical blur on horizontalBlurTex
      program.use();
      program.setUniformLocationF32(resolutionUni, cc.visibleRect.height);
      program.setUniformLocationWith2f(dirUni, 0, 1);

      var verticalBlur = cc.Sprite.create(horizontalBlurTex.getSprite().getTexture());
      verticalBlur.attr({anchorX: 0, anchorY: 1, scaleY: -1});
      verticalBlur.shaderProgram = program;

      bgTex.begin();
      verticalBlur.visit();
      bgTex.end();

      // blurred
      var result = cc.Sprite.create(bgTex.getSprite().getTexture());
      result.attr({anchorX: 0, anchorY: 0});
      this.addChild(result);

      // add mask color if needed
      if (maskColor) {
          this.addChild(
              cc.LayerColor.create(maskColor, cc.visibleRect.width, cc.visibleRect.height)
          );
      }
  }
});

LayerBlur.defaultBlurRadius = 0.75;
LayerBlur.create = function (blurRadius, maskColor) {
  return new LayerBlur(blurRadius, maskColor);
};