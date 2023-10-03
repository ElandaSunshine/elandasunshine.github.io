import"/js/api/ApiContainer.js";import $ from"https://cdn.jsdelivr.net/npm/jquery@3.7.1/+esm";import clamp from"https://cdn.jsdelivr.net/npm/clamp-js@0.7.0/+esm";import moment from"https://cdn.jsdelivr.net/npm/moment@2.29.4/+esm";import ProjectTypes from"/data/project_types.json";import LangColours from"/data/colors.json";import*as ElsaBase from"/js/base.js";const max_repos=3;function setupProjectTemplate(e){if(0===e.length)return{colours:LangColours,data:[]};e.sort(((e,t)=>t.stargazers_count-e.stargazers_count)),e.length=Math.min(3,e.length);for(const t of e)t.href=`https://github.com/${t.full_name}`,t.project_image_url=`https://raw.githubusercontent.com/${t.full_name}/gh-pages/img/banner_preview.jpg`,t.has_pages&&(t.href=new URL(t.name,window.location.href).href);return{colours:LangColours,data:e}}function setupPostTemplate(e){if(!e)return null;for(const t of e.posts??[])t.excerpt=t.excerpt.replaceAll(/(<([^>]+)>)/gi,"");return e.posts}$((()=>{{const e=$("#projects");if(e[0].error){$(e[0]).removeClass("loading");const t=$("#projects-error")[0];t.textContent="Error loading repositories",t.style.display="revert"}else e.on("requestdone",(e=>{if($(e.target).removeClass("loading"),!e.detail)return;const t=$("#projects-error")[0];if(e.detail?.error)return console.debug(e.detail.error),t.innerText="Error loading repositories",void(t.style.display="revert");if(e.detail?.processed?.length)return t.innerText="No repositories found",void(t.style.display="revert");t.style.display="none",$("#show-more-projects").css("display","table");const r=$("article.project-article > div section p");if(r.length>0)for(const e of r)clamp(e,{clamp:2});$("article",e.target).on("click",(e=>{window.open(new URL(e.currentTarget.dataset.name,window.location.href),"_self")}))})),e[0].updateContents({callback:setupProjectTemplate,hbs_init:e=>ElsaBase.setupBasicProjectsHandlebarsEvents(e,ProjectTypes)})}{const e=$("#posts");if(e[0].error){$(e[0]).removeClass("loading");const t=$("#posts-error")[0];t.textContent="Error loading latest posts",t.style.display="revert"}else e.on("requestdone",(e=>{if($(e.target).removeClass("loading"),!e.detail)return;const t=$("#posts-error")[0];if(e.detail?.error)return console.debug(e.detail.error),t.innerText="Error loading latest posts",void(t.style.display="revert");if(!e.detail?.processed?.length)return t.innerText="No posts found",void(t.style.display="revert");t.style.display="none",$("#show-more-posts").css("display","table"),$("article",e.target).on("click",(e=>{window.open(new URL("blog/"+e.currentTarget.dataset.postId,window.location.href),"_self")}));const r=$("article.blog-article > div.blog-main");if(r.length>0)for(const e of r)clamp($("h2",e)[0],{clamp:4}),clamp($("p.description",e)[0],{clamp:5})}));e[0].updateContents({endpoint:"posts/",callback:setupPostTemplate,hbs_init:e=>{e.registerHelper("getMoment",(e=>moment(new Date(e)).fromNow())),e.registerHelper("getCategory",(e=>Object.values(e)[0].name))}})}}));
