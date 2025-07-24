clientMessage("✅ Loader.js cargado con éxito!");

// Ejemplo opcional: crear un botón GUI (solo si quieres)
var ctx = com.mojang.minecraftpe.MainActivity.currentMainActivity.get();

ctx.runOnUiThread(new java.lang.Runnable({
  run: function () {
    try {
      var btn = new android.widget.Button(ctx);
      btn.setText("creativo");
      btn.setOnClickListener(new android.view.View.OnClickListener({
        onClick: function () {
          Player.setGameMode(1);
          clientMessage("Sucess");
        }
      }));

      var layout = new android.widget.LinearLayout(ctx);
      layout.addView(btn);

      var dialog = new android.app.Dialog(ctx);
      dialog.setContentView(layout);
      dialog.show();
    } catch (e) {
      clientMessage("Error: " + e);
    }
  }
}));
