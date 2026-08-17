/**
 * ======================================================
 * e-Learn MUPA
 * ------------------------------------------------------
 * SPA Router
 * Version : 1.0.0
 * ======================================================
 */

const Router = {

    routes: {},

    /**
     * Register Route
     */
    register(path, callback){

        this.routes[path]=callback;

    },

    /**
     * Navigate
     */
    go(path){

        window.location.hash=path;

    },

    /**
     * Start Router
     */
    start(){

        window.addEventListener(

            "hashchange",

            ()=>this.load()

        );

        this.load();

    },

    /**
     * Load Page
     */
    load(){

        const page=

            location.hash.replace("#","")

            ||"dashboard";

        if(this.routes[page]){

            this.routes[page]();

        }else{

            console.warn(

                "Route tidak ditemukan:",

                page

            );

        }

    }

};