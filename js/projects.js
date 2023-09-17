import"/js/api/ApiContainer.js";import $ from"https://cdn.jsdelivr.net/npm/jquery@3.7.1/+esm";import clamp from"https://cdn.jsdelivr.net/npm/clamp-js@0.7.0/+esm";import handlebars from"https://cdn.jsdelivr.net/npm/handlebars@4.7.8/+esm";import ProjectTypes from"/data/project_types.json"assert{type:"json"};import LangColours from"/data/colors.json"assert{type:"json"};import*as ElsaBase from"/js/base.js";const filters={type:{none:!1},language:{None:!1}},filter_template=await((async()=>{const e=await fetch("/template/filter_type.hbs"),t=await e.text();return handlebars.compile(t)})),init_repos_to_show=7;let initialised=!1,repos_to_show=init_repos_to_show,current_repos=[],search_term="",prev_filters="";function updateRepoList(e){if(!e?.length)return null;if(!initialised)for(const t of e){const e=t.language;e&&!filters.language.hasOwnProperty(e)&&(filters.language[e]=!1,$("#filter-list-lang").append(filter_template([[e,e]])))}const t=Object.entries(filters.type).filter((([,e])=>e)).map((([e])=>e)),r=Object.entries(filters.language).filter((([,e])=>e)).map((([e])=>e)),s=[];for(const o of e){if(t.length>0){const e=o.topics.filter((e=>e.startsWith("ghp-")));if(!(t.includes("none")&&0===e.length||t.some((t=>e.includes(t)))))continue}r.length>0&&!r.includes(o.language??"None")||(search_term&&-1===o.name.toLowerCase().indexOf(search_term)||s.push(o))}const o=[];let i=current_repos.length;for(const e of s){if(i===repos_to_show)break;current_repos.some((t=>t.id===e.id))||(e.href=`https://github.com/${e.full_name}`,e.project_image_url=`https://raw.githubusercontent.com/${e.full_name}/gh-pages/img/banner_preview.jpg`,e.has_pages&&(e.href=new URL(e.name,window.location.href).href),o.push(e),++i)}return current_repos.push(...o),$("#show-more-projects").toggleClass("disabled",!(current_repos.length<s.length)),s.length<e.length?$("#projects-total")[0].innerText=`Showing ${current_repos.length} of ${s.length} (${e.length})`:$("#projects-total")[0].innerText=`Showing ${current_repos.length} of ${s.length}`,initialised=!0,{colours:LangColours,data:o}}function setupFilterBox(){Object.keys(ProjectTypes).forEach((e=>filters.type[e]=!1)),$(document).on("keyup",(e=>{let t=$("#filter-popup-container");"none"!==t.css("display")&&"Escape"===e.key&&t.css("display","none")})),$("#filter-popup-container").on("click",(e=>{$(e.target).is("#filter-popup-container")&&closeFilterBox(!1)})),$("#btt-open-filters").on("click",openFilterBox),$("#btt-reset-filters").on("click",clearFilters),$("#filter-box-close-nosave").on("click",(()=>closeFilterBox(!1))),$("#filter-box-close-save").on("click",(()=>closeFilterBox(!0))),$("#filter-list-lang").append(filter_template([["None","None"]]));const e=[["none","None"]];e.push(...Object.entries(ProjectTypes).map((([e,t])=>[e,t.name]))),$("#filter-list-ptype").append(filter_template(e))}function openFilterBox(){$("#filter-list-ptype li input[type=checkbox]").each(((e,t)=>{$(t).prop("checked",filters.type[$(t).prop("value")])})),$("#filter-list-lang li input[type=checkbox]").each(((e,t)=>{$(t).prop("checked",filters.language[$(t).prop("value")])})),$("#filter-popup-container").toggleClass("open",!0)}function closeFilterBox(e){if(e){$("#filter-list-ptype li input[type=checkbox]").each(((e,t)=>{filters.type[$(t).prop("value")]=$(t).prop("checked")})),$("#filter-list-lang li input[type=checkbox]").each(((e,t)=>{filters.language[$(t).prop("value")]=$(t).prop("checked")}));const e=JSON.stringify(filters);prev_filters!==e&&(prev_filters=e,repos_to_show=init_repos_to_show,current_repos.length=0,$("#projects")[0].updateContents({callback:updateRepoList,onlyIfCached:!0}))}$("#filter-popup-container").toggleClass("open",!1),$("#btt-reset-filters").prop("disabled",!(Object.values(filters.type).some((e=>e))||Object.values(filters.language).some((e=>e))))}function clearFilters(){Object.keys(filters.type).forEach((e=>filters.type[e]=!1)),Object.keys(filters.language).forEach((e=>filters.language[e]=!1));const e=JSON.stringify(filters);prev_filters===e&&""===search_term||(search_term="",prev_filters=e,prev_filters=e,repos_to_show=init_repos_to_show,current_repos.length=0,$("#repo-search").val(""),$("#projects")[0].updateContents({callback:updateRepoList,onlyIfCached:!0})),$("#btt-reset-filters").prop("disabled",!0)}function openSearch(){const e=$("#repo-search");e.toggleClass("mobile",!0),e[0].focus(),$("#main-header").css("visibility","hidden"),$("#btt-init-search").css("visibility","hidden")}$((()=>{let e=!1;"visualViewport"in window&&window.visualViewport.addEventListener("resize",(t=>{if($("#repo-search").hasClass("mobile")){if(!e)return void $("#repo-search")[0].blur();e=!1}})),$("#btt-init-search").on("click",(()=>{openSearch(),e=!0})),$("#repo-search").on("focusout",(e=>{$("#repo-search").toggleClass("mobile",!1),$("#main-header").css("visibility","visible"),$("#btt-init-search").css("visibility","visible")})),$("#repo-search").on("keyup",(e=>{$(e.target).hasClass("mobile")&&"Enter"===e.key&&e.currentTarget.blur()}));const t=$("#projects");if($("#repo-search").on("input",(()=>{const e=$("#repo-search").val().toLowerCase().trim(),r=search_term;search_term=e,""!==e&&$("#btt-reset-filters").prop("disabled",!1),initialised&&r!==e&&(repos_to_show=init_repos_to_show,current_repos.length=0,t[0].updateContents({callback:updateRepoList,onlyIfCached:!0}))})),$("#show-more-projects").on("click",(e=>{$(e.target).hasClass("disabled")||(repos_to_show+=init_repos_to_show,t[0].updateContents({callback:updateRepoList,append:!0,onlyIfCached:!0}))})),setupFilterBox(),t[0].error){$(t[0]).removeClass("loading");const e=$("#projects-error")[0];e.textContent="Error loading repositories",e.style.display="revert"}else t.on("requestdone",(e=>{if($(e.target).removeClass("loading"),!e.detail)return;$("#btt-open-filters").prop("disabled",!1);const t=$("#projects-error")[0];if(e.detail?.error)return console.debug(e.detail.error),t.innerText="Error loading repositories",void(t.style.display="revert");if(0===current_repos.length)return t.innerText="No repositories found",void(t.style.display="revert");t.style.display="none",search_term&&$("article.project-article",e.target).each(((e,t)=>{const r=$($("p.project-title",t)[0]);r.hasClass("marked-search")&&$("span",r).contents().unwrap();const s=search_term.replace(/[/\-\\^$*+?.()|[\]{}]/g,"\\$&"),o=new RegExp("("+s+")","i");r.html(r.text().replace(o,'<span style="background-color: #ffffff55">$1</span>')),r.toggleClass("marked-search",!0)})),t.style.display="none",$("#show-more-projects").css("display","table");const r=$("article.project-article > div section p");if(r.length>0)for(const e of r)clamp(e,{clamp:2});$("article.project-article",e.target).on("click",(e=>{window.open(new URL(e.currentTarget.dataset.name,window.location.href),"_self")}))})),t[0].updateContents({callback:updateRepoList,hbs_init:e=>ElsaBase.setupBasicProjectsHandlebarsEvents(e,ProjectTypes)})}));
