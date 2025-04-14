/* Tells to TypeScript that all .vue files are Vue components 
   and avoids the "any" type error, what happened in main.ts file.*/
declare module "*.vue" {
    import { DefineComponent } from "vue";
    const component: DefineComponent<{}, {}, any>;
    export default component;
}