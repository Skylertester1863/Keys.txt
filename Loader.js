// Rage v12 Ultra ModPE Script // Compatible con Toolbox / MCPE 0.15.10

var ctx = com.mojang.minecraftpe.MainActivity.currentMainActivity.get();
var mainGUI, contentLayout, reopenButton;
var guiColor = "#DD1A1A1A";

var toggles = {
    "Aimbot": false, "KillAura": false, "Fly": false, "Speed": false, "Full Bright": false, "Auto Tool": false,
    "X-Ray": false, "No Fall": false, "No Velocity": false, "Blink": false, "Player ESP": false, "Tracers": false,
    "Chest Tracers": false, "Fast Place": false, "Nuker": false, "Reach": false, "Long Jump": false, "No Clip": false,
    "High Jump": false, "Jesus": false, "Spider": false, "Speed Mine": false, "No Swing": false, "Criticals": false,
    "Fast Regen": false, "Glide": false, "Step": false, "Velocity Boost": false, "Auto Sprint": false,
    "Anti Blindness": false, "Name Tags": false, "ESP Outline": false, "Crosshair": false, "Hitbox": false,
    "Bow Aimbot": false, "Auto Eat": false, "Item ESP": false, "Radar": false, "Derp": false, "Headless": false,
    "Auto Jump": false, "Auto Armor": false, "Fast Break": false, "Fast Heal": false, "Scaffold": false,
    "Auto Tool Switch": false, "Sneak Bypass": false, "Chat Spam": false, "Coords HUD": false, "Potion Saver": false,
    "Wall Hack": false, "Silent Aim": false, "BlinkPos": { x: 0, y: 0, z: 0 }
};

function dip2px(ctx, dips) {
    return Math.ceil(dips * ctx.getResources().getDisplayMetrics().density);
}

function getRoundedDrawable(colorHex, radiusDp) {
    var radius = dip2px(ctx, radiusDp);
    var shape = new android.graphics.drawable.GradientDrawable();
    shape.setCornerRadius(radius);
    shape.setColor(android.graphics.Color.parseColor(colorHex));
    return shape;
}

function createSectionTitle(text) {
    var t = new android.widget.TextView(ctx);
    t.setText(text);
    t.setTextSize(14);
    t.setTextColor(android.graphics.Color.LTGRAY);
    t.setPadding(0, dip2px(ctx, 8), 0, dip2px(ctx, 4));
    return t;
}

function createSwitch(text) {
    var sw = new android.widget.Switch(ctx);
    sw.setText(text);
    sw.setTextColor(android.graphics.Color.WHITE);
    sw.setOnCheckedChangeListener(new android.widget.CompoundButton.OnCheckedChangeListener({
        onCheckedChanged: function(btn, isChecked) {
            toggles[text] = isChecked;

            if (text === "Blink" && isChecked)
                toggles.BlinkPos = { x: getPlayerX(), y: getPlayerY(), z: getPlayerZ() };

            // Efectos especiales
            if (text === "Speed Mine") {
                if (isChecked) Entity.addEffect(getPlayerEnt(), 3, 10000000, 4);
                else Entity.removeEffect(getPlayerEnt(), 3);
            }

            if (text === "Full Bright") {
                if (isChecked) Entity.addEffect(getPlayerEnt(), 16, 10000000, 3);
                else Entity.removeEffect(getPlayerEnt(), 16);
            }

            if (text === "Criticals") {
                if (isChecked) Entity.addEffect(getPlayerEnt(), 5, 10000000, 3);
                else Entity.removeEffect(getPlayerEnt(), 5);
            }

            if (text === "High Jump") {
                if (isChecked) Entity.addEffect(getPlayerEnt(), 8, 10000000, 3);
                else Entity.removeEffect(getPlayerEnt(), 8);
            }

            if (text === "Invisibility") {
                if (isChecked) Entity.addEffect(getPlayerEnt(), 14, 10000000, 1);
                else Entity.removeEffect(getPlayerEnt(), 14);
            }

            clientMessage(text + ": " + (isChecked ? "ON" : "OFF"));
        }
    }));
    return sw;
}

function createButton(text, func) {
    var btn = new android.widget.Button(ctx);
    btn.setText(text);
    btn.setTextColor(android.graphics.Color.WHITE);
    btn.setBackgroundDrawable(getRoundedDrawable("#555555", 12));
    btn.setOnClickListener(new android.view.View.OnClickListener({ onClick: func }));
    return btn;
}

function loadContent(tab) {
    contentLayout.removeAllViews();
    var sections = {
        "Player": ["Aimbot", "KillAura", "Reach", "Bow Aimbot", "Criticals", "Hitbox", "Silent Aim"],
        "Movement": ["Fly", "Speed", "High Jump", "Long Jump", "Step", "No Clip", "Glide", "Spider", "Jesus", "Velocity Boost", "Auto Sprint", "Auto Jump"],
        "World": ["X-Ray", "Chest Tracers", "Tracers", "Player ESP", "ESP Outline", "Name Tags", "Item ESP", "Radar", "Wall Hack"],
        "Utility": ["Full Bright", "Auto Tool", "Auto Tool Switch", "Auto Armor", "Auto Eat", "Fast Place", "Fast Break", "Speed Mine", "Potion Saver", "Anti Blindness", "No Swing", "Coords HUD"],
        "Bypass": ["No Fall", "No Velocity", "Blink", "Sneak Bypass", "Fast Regen", "Fast Heal", "Chat Spam"],
        "Visual": ["Crosshair", "Derp", "Headless"]
    };

    if (tab === "CONFIG") {
        contentLayout.addView(createSectionTitle("GUI Color Options"));
        contentLayout.addView(createButton("Dark Red", function() {
            guiColor = "#DD1A1A1A"; recreateGUI();
        }));
        contentLayout.addView(createButton("Dark Gray", function() {
            guiColor = "#DD2B2B2B"; recreateGUI();
        }));
        contentLayout.addView(createButton("Black", function() {
            guiColor = "#DD000000"; recreateGUI();
        }));
        contentLayout.addView(createButton("Dark Blue", function() {
            guiColor = "#DD1A1A4A"; recreateGUI();
        }));
        return;
    }

    contentLayout.addView(createSectionTitle(tab));
    if (sections[tab]) {
        for (var i = 0; i < sections[tab].length; i++) {
            contentLayout.addView(createSwitch(sections[tab][i]));
        }
    }
}

function recreateGUI() {
    mainGUI.dismiss();
    createModernTabbedGUI();
}

function showReopenButton() {
    ctx.runOnUiThread(new java.lang.Runnable({
        run: function() {
            try {
                if (reopenButton) return;
                reopenButton = new android.widget.Button(ctx);
                reopenButton.setText("≡");
                reopenButton.setTextSize(20);
                reopenButton.setTextColor(android.graphics.Color.WHITE);
                reopenButton.setBackgroundDrawable(getRoundedDrawable("#88000000", 20));
                reopenButton.setPadding(10, 10, 10, 10);
                var layout = new android.widget.RelativeLayout(ctx);
                layout.addView(reopenButton);
                var window = new android.widget.PopupWindow(layout, dip2px(ctx, 60), dip2px(ctx, 60));
                reopenButton.setOnClickListener(new android.view.View.OnClickListener({
                    onClick: function() {
                        window.dismiss();
                        reopenButton = null;
                        createModernTabbedGUI();
                    }
                }));
                window.setFocusable(false);
                window.showAtLocation(ctx.getWindow().getDecorView(), android.view.Gravity.LEFT | android.view.Gravity.TOP, dip2px(ctx, 10), dip2px(ctx, 80));
            } catch (err) {
                print("Reopen button error: " + err);
            }
        }
    }));
}

function createModernTabbedGUI() {
    ctx.runOnUiThread(new java.lang.Runnable({
        run: function() {
            try {
                var mainLayout = new android.widget.LinearLayout(ctx);
                mainLayout.setOrientation(0);
                mainLayout.setBackgroundDrawable(getRoundedDrawable(guiColor, 16));

                var tabMenu = new android.widget.LinearLayout(ctx);
                tabMenu.setOrientation(1);
                tabMenu.setPadding(10, 10, 10, 10);
                tabMenu.setBackgroundDrawable(getRoundedDrawable("#FF2A2A2A", 16));

                ["Player", "Movement", "World", "Utility", "Bypass", "Visual", "CONFIG"].forEach(function(name) {
                    var btn = new android.widget.Button(ctx);
                    btn.setText(name);
                    btn.setTextColor(android.graphics.Color.WHITE);
                    btn.setBackgroundDrawable(getRoundedDrawable("#444444", 12));
                    btn.setOnClickListener(new android.view.View.OnClickListener({
                        onClick: function() {
                            loadContent(name);
                        }
                    }));
                    tabMenu.addView(btn);
                });

                contentLayout = new android.widget.LinearLayout(ctx);
                contentLayout.setOrientation(1);
                contentLayout.setPadding(20, 20, 20, 20);

                var scroll = new android.widget.ScrollView(ctx);
                scroll.addView(contentLayout);

                var topBar = new android.widget.LinearLayout(ctx);
                topBar.setOrientation(0);
                topBar.setGravity(android.view.Gravity.CENTER_VERTICAL);
                topBar.setPadding(20, 10, 20, 10);

                var title = new android.widget.TextView(ctx);
                title.setText("Rage v12 Ultra");
                title.setTextSize(16);
                title.setTextColor(android.graphics.Color.WHITE);
                title.setLayoutParams(new android.widget.LinearLayout.LayoutParams(0, -2, 1));

                var closeBtn = new android.widget.TextView(ctx);
                closeBtn.setText("✕");
                closeBtn.setTextColor(android.graphics.Color.LTGRAY);
                closeBtn.setTextSize(18);
                closeBtn.setOnClickListener(new android.view.View.OnClickListener({
                    onClick: function() {
                        mainGUI.dismiss();
                        showReopenButton();
                    }
                }));

                topBar.addView(title);
                topBar.addView(closeBtn);

                var rightLayout = new android.widget.LinearLayout(ctx);
                rightLayout.setOrientation(1);
                rightLayout.addView(topBar);
                rightLayout.addView(scroll);

                mainLayout.addView(tabMenu, new android.widget.LinearLayout.LayoutParams(dip2px(ctx, 100), -1));
                mainLayout.addView(rightLayout, new android.widget.LinearLayout.LayoutParams(dip2px(ctx, 425), -1));

                mainGUI = new android.widget.PopupWindow(mainLayout, dip2px(ctx, 530), dip2px(ctx, 360));
                mainGUI.setFocusable(false);
                mainGUI.showAtLocation(ctx.getWindow().getDecorView(), android.view.Gravity.CENTER, 0, 0);

                loadContent("Player");
            } catch (err) {
                print("GUI Error: " + err);
            }
        }
    }));
}

function modTick() {
    if (toggles.Blink) setPosition(getPlayerEnt(), toggles.BlinkPos.x, toggles.BlinkPos.y, toggles.BlinkPos.z);
    if (toggles.Fly) setVelY(getPlayerEnt(), 0.4);
    if (toggles.Speed) {
        var yaw = getYaw() * Math.PI / 180;
        setVelX(getPlayerEnt(), -Math.sin(yaw) * 0.6);
        setVelZ(getPlayerEnt(), Math.cos(yaw) * 0.6);
    }
    if (toggles.NoFall && getVelY(getPlayerEnt()) < 0) setVelY(getPlayerEnt(), 0);
    if (toggles.NoVelocity) {
        setVelX(getPlayerEnt(), 0);
        setVelZ(getPlayerEnt(), 0);
    }
    if (toggles.KillAura || toggles.Aimbot) {
        var ents = Entity.getAll();
        for (var i = 0; i < ents.length; i++) {
            var e = ents[i];
            if (!Entity.isPlayer(e) || e === getPlayerEnt()) continue;
            var dx = Entity.getX(e) - getPlayerX();
            var dy = Entity.getY(e) - getPlayerY();
            var dz = Entity.getZ(e) - getPlayerZ();
            var dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
            if (toggles.Aimbot && dist < 6) {
                var yaw = -Math.atan2(dx, dz) * 180 / Math.PI;
                var pitch = Math.atan2(dy, Math.sqrt(dx * dx + dz * dz)) * 180 / Math.PI;
                setRot(yaw, pitch);
            }
            if (toggles.KillAura && dist <= 4) {
                Entity.setVelX(e, 0);
                Entity.setVelY(e, 0);
                Entity.setVelZ(e, 0);
                attackEntity(getPlayerEnt(), e);
            }
        }
    }
}

function modRender() {
    if (toggles["Full Bright"]) Level.setBrightness(15);
    if (toggles["Player ESP"] || toggles.Tracers || toggles["Chest Tracers"]) {
        var ents = Entity.getAll();
        for (var i = 0; i < ents.length; i++) {
            var e = ents[i];
            if (!Entity.isPlayer(e) || e === getPlayerEnt()) continue;
            var x = Entity.getX(e) - getPlayerX();
            var y = Entity.getY(e) - getPlayerY();
            var z = Entity.getZ(e) - getPlayerZ();
            if (toggles["Player ESP"])
                Renderer.drawBox(x - 0.3, y, z - 0.3, x + 0.3, y + 1.8, z + 0.3, 1, 255, 0, 0, 255);
            if (toggles.Tracers)
                Renderer.drawLine(0, 1.5, 0, x, y + 1, z, 2, 0, 255, 0, 255);
        }
        if (toggles["Chest Tracers"]) {
            var tiles = TileEntity.list;
            for (var i = 0; i < tiles.length; i++) {
                var tile = tiles[i];
                if (tile.getEntityTypeId && tile.getEntityTypeId() === 54) {
                    var cx = tile.getX() - getPlayerX();
                    var cy = tile.getY() - getPlayerY();
                    var cz = tile.getZ() - getPlayerZ();
                    Renderer.drawLine(0, 1.5, 0, cx + 0.5, cy + 0.5, cz + 0.5, 2, 255, 255, 0, 255);
                }
            }
        }
    }
}

createModernTabbedGUI();
