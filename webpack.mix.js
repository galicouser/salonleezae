const mix = require("laravel-mix");
const path = require('path')

// if(process.env.MIX_PUBLIC_PATH !== null && process.env.MIX_PUBLIC_PATH !== undefined && process.env.MIX_PUBLIC_PATH !== '') {
//     mix.setPublicPath('public')
//       .webpackConfig({
//         output: {publicPath: process.env.MIX_PUBLIC_PATH}
//       });
// }
mix.setPublicPath('resources')
    .webpackConfig({
        output: {
            publicPath: './resources' // Or use the environment variable if needed: process.env.MIX_PUBLIC_PATH || '/'
        }
    });
/**
 *
 * !Copy Assets
 *
 * -----------------------------------------------------------------------------
 */
// icon fonts
mix.copy(
  "node_modules/@fortawesome/fontawesome-free/webfonts/*",
  "resources/webfonts"
);
/**
 *
 * !Backend/Dashboard
 *
 * -----------------------------------------------------------------------------
 */
// Build Backend/Dashboard SASS
mix.sass("resources/sass/libs.scss", "resources/css/libs.min.css")
    .sass("resources/scss/hope-ui.scss", "resources/css")
    .sass("resources/scss/custom.scss", "resources/css")
    .sass("resources/scss/dark.scss", "resources/css")
    .sass("resources/scss/rtl.scss", "resources/css")
    .sass("resources/scss/customizer.scss", "resources/css")
    .sass("resources/scss/pro.scss", "resources/css");

// Backend/Dashboard Styles
mix.styles(
    [
        "resources/css/hope-ui.css",
        "resources/css/pro.css",
    ],
    "resources/css/backend.css"
);

mix.styles([
  "node_modules/@fortawesome/fontawesome-free/css/all.min.css"
], 'resources/css/icon.min.css')

// Backend/Dashboard Scripts
mix.js("resources/js/libs.js", "resources/js/core/libs.min.js")
    .js("resources/js/backend-custom.js", "resources/js/backend-custom.js");

mix.scripts(
    [
        "resources/js/core/libs.min.js",
        "resources/js/backend-custom.js",
    ],
    "resources/js/backend.js"
);

mix.alias({
    '@': path.join(__dirname, 'resources/js')
});
mix.js('resources/js/app.js', 'resources/js')
.sass('resources/sass/app.scss', 'resources/css');

mix.js("resources/js/setting-vue.js", "resources/js/setting-vue.min.js")

mix.js("resources/js/profile-vue.js", "resources/js/profile-vue.min.js")

mix.js("resources/js/import-export.js", "resources/js/import-export.min.js")

// Global Vue Script
mix.js('resources/js/vue/app.js', 'resources/js/vue.min.js').vue();
mix.js('resources/js/vue/booking-form.js', 'resources/js/booking-form.min.js').vue();

/**
 * !Module Based Script & Style Bundel
 * @path Modules/{module_name}/app.js (This Could be vue, react, vanila javascript)
 * @path Module/{module_name}/app.scss (There is all module css)
 *
 * !Final Build Path Should Be
 * @path resources/modules/{module_name}/script.js
 * @path resources/modules/{module_name}/style.js
 *
 * *USAGE IN BLADE FILE*
 * ? <link rel="stylesheet" href="{{ mix('modules/{module_name}/style.css') }}">
 * ? <script src="{{ mix('modules/{module_name}/script.js') }}"></script>
 */

const Modules = require("./modules_statuses.json");
const Fs = require("fs");

for (const key in Modules) {
    if (Object.hasOwnProperty.call(Modules, key)) {
        if (
            Fs.existsSync(
                `${__dirname}/Modules/${key}/Resources/assets/js/app.js`
            )
        ) {
            mix.js(
                `${__dirname}/Modules/${key}/Resources/assets/js/app.js`,
                `modules/${key.toLocaleLowerCase()}/script.js`
            )
                .vue()
                .sourceMaps();
        }
        if (
            Fs.existsSync(
                `${__dirname}/Modules/${key}//Resources/assets/sass/app.scss`
            )
        ) {
            mix.sass(
                `${__dirname}/Modules/${key}//Resources/assets/sass/app.scss`,
                `modules/${key.toLocaleLowerCase()}/style.css`
            ).sourceMaps();
        }
    }
}

// !For Production Build Added To Version on File for cache
if (mix.inProduction()) {
    mix.version();
}
