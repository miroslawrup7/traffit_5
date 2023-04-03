const recNumLoc = document.querySelector(".records-number");
const noResultsLoc = document.querySelector(".no-results");
const resultsLoc = document.querySelector(".results");
const awardedResultsLoc = document.querySelector(".awarded");
const pagesContainer = document.querySelector(".pages-container");
const pagesSwitchLoc = document.querySelector(".pages");
let pageButtonsLoc = document.querySelectorAll(".page");

const dropDownFilterLoc = document.querySelector(".drop-down-filters");
const dropDownLoc = document.querySelector(".drop-down-btn");
const dropDownBtnLoc = document.querySelector(".drop-down-btn img");
const moreFiltersLoc = document.querySelector(".more-filters");
const lessFiltersLoc = document.querySelector(".less-filters");

const recordsOnPageLoc = document.querySelector(".records-on-page");

const branchesLoc = document.querySelector(".branches");
const jobFormLoc = document.querySelector(".job-form");
const jobTypeLoc = document.querySelector(".job-type");
const langLoc = document.querySelector(".lang");
const countriesLoc = document.querySelector(".countries");
const citiesLoc = document.querySelector(".cities");

const locationMarkLoc = document.querySelector("#localization");
const locationDotLoc = document.querySelector("#loc-slider");
const locationSliderLoc = document.querySelector(
    ".distance-slider .slider-container .container"
);
const locationValuesLoc = document.querySelector(
    ".distance-slider .slider-values"
);
const displayValDistance = document.getElementById("range3");

const salaryMarkLoc = document.querySelector("#salary-mark");
const salarySliderLoc = document.querySelector(
    ".salary .slider-container .container"
);
const salaryValuesLoc = document.querySelector(".salary .slider-values");
const sliderOne = document.querySelector("#slider-1");
const sliderTwo = document.querySelector("#slider-2");
const displayValOne = document.getElementById("range1");
const displayValTwo = document.getElementById("range2");
const sliderTrack = document.querySelector(".salary .slider-track");
const pauseLoc = document.querySelector(".salary .pause");

const remoteLoc = document.querySelector("#remote");
const relocationLoc = document.querySelector("#relocation");

const searchInputLoc = document.querySelector(".search-input input");

const searchBtn = document.querySelector(".search-btn");

const clearFiltersLoc = document.querySelector(".clear-filters");
const clearFilterLoc = document.querySelectorAll(".lists .list .clear-list");

const salaryLoc = document.querySelector(".salary");
const remoteWrapperLoc = document.querySelector(".remote-wrapper");
const relocationWrapperLoc = document.querySelector(".relocation-wrapper");
const langWrapperLoc = document.querySelector("#lang").closest("div");
const locWrapperLoc = document.querySelector(".loc-container");
const brancheWrapperLoc = document.querySelector("#branches").closest("div");

let apiPage = 1;
let rawAPIArray = [];
let allRecordsArray = [];

let filterBranchesList = [];
let filterJobFormList = [];
let filterJobTypeList = [];
let filterLangList = [];
let filterMinSalary = 100000;
let filterMaxSalary = 0;
let filterCountriesList = {};

let recordsNumber = 0;
let firstRecordNumber = 0;
let recordsOnPage = 20;

let filterListMaxHeight = 0;

let filteredRecordsArray_11;

let filtersON = false;

searchInputLoc.value = "";
recordsOnPageLoc.value = 20;

locationMarkLoc.checked = false;
locationDotLoc.disabled = true;
countriesLoc.disabled = true;
citiesLoc.disabled = true;
locationDotLoc.value = 0;

salaryMarkLoc.checked = false;
sliderOne.disabled = true;
sliderTwo.disabled = true;

remoteLoc.checked = false;
relocationLoc.checked = false;

// Send data from iframe to parent ///////////////////////////////////////////

const setParentIframeHeight = () => {
    const iframeHeight = document.body.scrollHeight
    window.parent.postMessage(iframeHeight, "*");
}

// create FILTER DATA from API data ///////////////////////////////////////////////
const createDataForFilters = (
    branche,
    jobForm,
    jobType,
    lang,
    visibleRate,
    salaryFrom,
    salaryTo,
    country,
    city,
    lati,
    longi
) => {
   
    if (filterBranchesList.indexOf(branche) === -1 && branche !== undefined) {
        if (filterConfigData.branche_filter.length) {
            if (filterConfigData.branche_filter.indexOf(branche) !== -1) {
                filterBranchesList.push(branche);
            }
        } else {
            filterBranchesList.push(branche);
        }
       
    }

    if (jobForm) {
        jobForm.forEach(function (elem) {
            if (filterJobFormList.indexOf(elem) === -1) {
                filterJobFormList.push(elem);
            }
        });
    }

    if (filterJobTypeList.indexOf(jobType) === -1 && jobType !== undefined) {
        filterJobTypeList.push(jobType);
    }

    if (filterLangList.indexOf(lang) === -1) {

        if (filterConfigData.language_filter.length) {
            if (filterConfigData.language_filter.indexOf(lang) !== -1) {
                filterLangList.push(lang);
            }
        } else {
            filterLangList.push(lang);
        }
    }

    if (visibleRate) {
        if (salaryFrom < filterMinSalary) {
            filterMinSalary = salaryFrom;
        }
        if (salaryTo > filterMaxSalary) {
            filterMaxSalary = salaryTo;
        }
    }

    if (filterConfigData.location_country_filter.length) {
        
        if (filterConfigData.location_country_filter.indexOf(country) !== -1) {
            if (filterCountriesList[country]) {
                if (
                    filterCountriesList[country].findIndex(
                        (arr_el) => arr_el.city === city
                    ) === -1
                ) {
                    if (filterConfigData.location_city_filter.length) {
                        if (filterConfigData.location_city_filter.indexOf(city) !== -1) {
                            filterCountriesList[country].push({
                                city: city,
                                lati: lati,
                                longi: longi,
                            });
                        }
                    } else {
                        filterCountriesList[country].push({
                            city: city,
                            lati: lati,
                            longi: longi,
                        });
                    }
                }
            } else {
                filterCountriesList[country] = [];
                if (filterConfigData.location_city_filter.length) {
                    if (filterConfigData.location_city_filter.indexOf(city) !== -1) {
                        filterCountriesList[country].push({
                            city: city,
                            lati: lati,
                            longi: longi,
                        });
                    }
                } else {
                    filterCountriesList[country].push({
                        city: city,
                        lati: lati,
                        longi: longi,
                    });
                }
            }
        }

    } else {
        
        if (filterCountriesList[country]) {
            if (
                filterCountriesList[country].findIndex(
                    (arr_el) => arr_el.city === city
                ) === -1
            ) {
                filterCountriesList[country].push({
                    city: city,
                    lati: lati,
                    longi: longi,
                });
            }
        } else {
            filterCountriesList[country] = [];
            filterCountriesList[country].push({
                city: city,
                lati: lati,
                longi: longi,
            });
        }
    }
};

// create OBJECTS ARRAY from Raw API JSON ///////////////////////////////////////////////
const reworkData = (rawAPIArray) => {
    rawAPIArray.forEach((el) => {
        if (el.options.job_location) {
            parsedJobLocation = JSON.parse(el.options.job_location);
        }

        allRecordsArray.push({
            url: el.url,
            name: el.advert.name,
            branche: el.options.branches,
            lang: el.advert.language,
            jobType: el.options.job_type,
            visibleRate: parseInt(el.options._Widoczna_stawka),
            salaryFrom: parseInt(el.options._spodziewane_wynagrodzenie_od),
            salaryTo: parseInt(el.options._spodziewane_wynagrodzenie_do),
            remote: el.options.remote,
            relocation: el.options._relokacja,
            recruitmentType: el.options._rekrutacja_rodzaj,
            jobForm: el.options._forma_zatrudnienia,
            country: parsedJobLocation.country,
            city: parsedJobLocation.locality,
            lati: parseFloat(parsedJobLocation.latitude),
            longi: parseFloat(parsedJobLocation.longitude),
            description: el.advert.values,
            awarded: el.awarded,
        });

        createDataForFilters(
            el.options.branches,
            el.options._forma_zatrudnienia,
            el.options.job_type,
            el.advert.language,
            parseInt(el.options._Widoczna_stawka),
            parseInt(el.options._spodziewane_wynagrodzenie_od),
            parseInt(el.options._spodziewane_wynagrodzenie_do),
            parsedJobLocation.country,
            parsedJobLocation.locality,
            parseFloat(parsedJobLocation.latitude),
            parseFloat(parsedJobLocation.longitude)
        );
    });
};

// show RECORDS NUMBER ///////////////////////////////////////////////
const summariseDownload = (recordsNumber) => {
    recNumLoc.innerText = `Znaleziono ${recordsNumber} ogłoszeń`;
    if (!recordsNumber) {
        noResultsLoc.classList.add("active");
    } else {
        noResultsLoc.classList.remove("active");
    }
};

// show & hide MORE FILTERS //////////////////////////////////////////////////
const showHideFilters = () => {
    dropDownBtnLoc.classList.toggle("up");
    if (dropDownFilterLoc.classList.contains("show")) {
        dropDownFilterLoc.classList.remove("show");
        dropDownFilterLoc.style.maxHeight = String(0) + "px";
        moreFiltersLoc.classList.remove("hide");
        lessFiltersLoc.classList.remove("show");
        setTimeout(setParentIframeHeight, 1000);
    } else {
        dropDownFilterLoc.classList.add("show");
        dropDownFilterLoc.style.maxHeight = "1000px";
        moreFiltersLoc.classList.add("hide");
        lessFiltersLoc.classList.add("show");
        setTimeout(setParentIframeHeight, 1000);
    }
   
};

const hideFilter = () => {
    if (dropDownFilterLoc.classList.contains("show")) {
        dropDownBtnLoc.classList.toggle("up");
        dropDownFilterLoc.classList.remove("show");
        dropDownFilterLoc.style.maxHeight = String(0) + "px";
        moreFiltersLoc.classList.remove("hide");
        lessFiltersLoc.classList.remove("show");
    }
};

const dropDownBtnStart = () => {
    dropDownLoc.addEventListener("click", showHideFilters);

    dropDownLoc.classList.add("active");
};

const pagesContainerStart = () => {
    pagesContainer.classList.add("active");
};

// create RECORDS BOXES ///////////////////////////////////////////////
const createRecordBoxes = (recordsArray, firstRecordNumber, recordsOnPage) => {
    resultsLoc.replaceChildren();

    for (i = firstRecordNumber; i < recordsOnPage; i++) {
        // colouring of records by type of recruitment

        if (recordsArray[i]) {
            let borderColorClass = "";
            let textColorClass = "";

            if (!filterConfigData.recruitmentType_colorOnly.length) {
                if (recordsArray[i].recruitmentType === "PT") {
                    borderColorClass = "pt-border";
                    textColorClass = "pt-text";
                }
                if (recordsArray[i].recruitmentType === "RS") {
                    borderColorClass = "rs-border";
                    textColorClass = "rs-text";
                }
                if (recordsArray[i].recruitmentType === "WEW") {
                    borderColorClass = "wew-border";
                    textColorClass = "wew-text";
                }
            } else {
                if (
                    filterConfigData.recruitmentType_colorOnly.indexOf("PT") !==
                    -1
                ) {
                    if (recordsArray[i].recruitmentType === "PT") {
                        borderColorClass = "pt-border";
                        textColorClass = "pt-text";
                    }
                }

                if (
                    filterConfigData.recruitmentType_colorOnly.indexOf("RS") !==
                    -1
                ) {
                    if (recordsArray[i].recruitmentType === "RS") {
                        borderColorClass = "rs-border";
                        textColorClass = "rs-text";
                    }
                }

                if (
                    filterConfigData.recruitmentType_colorOnly.indexOf(
                        "WEW"
                    ) !== -1
                ) {
                    if (recordsArray[i].recruitmentType === "WEW") {
                        borderColorClass = "wew-border";
                        textColorClass = "wew-text";
                    }
                }
            }

            let formaZatrudnienia = "";

            if (recordsArray[i].jobForm) {
                recordsArray[i].jobForm.forEach(function (elem) {
                    formaZatrudnienia =
                        formaZatrudnienia + "<p>" + elem + "</p>";
                });
            }

            resultsLoc.insertAdjacentHTML(
                "beforeend",
                `<a href="${
                    recordsArray[i].url
                }" target="_blank"><div class="result ${borderColorClass}">
            <div class="top">
              
                    <div class="lang"><p>${recordsArray[i].lang}</p></div>
                    <div class="branche-name">
                        <div class="branche">${
                            recordsArray[i].branche
                                ? recordsArray[i].branche
                                : ""
                        }</div>
                        <div class="name ${textColorClass}">${
                    recordsArray[i].name
                }</div>
                   
                </div>
              
            </div>

            <div class="bottom">
                <div class="city-container">
                    <div class="city"><img src="./img/location_dot.svg">${
                        recordsArray[i].city
                    }</div>
                    </div>
                    <div class="details-container">
                    ${
                        recordsArray[i].jobType
                            ? "<div class='jobtype'>" +
                              recordsArray[i].jobType +
                              "</div>"
                            : ""
                    }
                    ${
                        recordsArray[i].visibleRate
                            ? recordsArray[i].salaryFrom &&
                              recordsArray[i].salaryTo
                                ? "<div class='salary'>" +
                                  recordsArray[i].salaryFrom +
                                  " - " +
                                  recordsArray[i].salaryTo +
                                  "</div>"
                                : ""
                            : ""
                    }
                    ${
                        recordsArray[i].remote
                            ? "<div class='remote'>zdalna</div>"
                            : ""
                    }
                    ${
                        recordsArray[i].relocation
                            ? "<div class='relocation'>relocation</div>"
                            : ""
                    }
                    <div class="employmentform">${formaZatrudnienia}</div>
                    </div>
                </div>
                   
                </div>
          

        </div></a>`
            );
        }
    }
};

const filterAwarded = (configFilterArray, awardedRecordsArray, property) => {
    
    for (i = awardedRecordsArray.length-1; i>=0; i--) {

        let findFlag = false;
        configFilterArray.forEach((element)=>{
          
            if (awardedRecordsArray[i][property] === element) {
                findFlag = true;
            }
        })

        if (!findFlag) {
            awardedRecordsArray.splice(i, 1)
        }
    }

}

// create AWARDED RECORDS BOXES ///////////////////////////////////////////////
const createAwardedRecordBoxes = (recordsArray, filterConfigData) => {

    awardedResultsLoc.replaceChildren();

    let awardedRecordsArray = recordsArray.filter((elem) => {
        return elem.awarded;  
    });

    if (awardedRecordsArray.length > 0) {

        if (filterConfigData.remote_filter) {
            awardedRecordsArray = awardedRecordsArray.filter((elem) => {
                return elem.remote;
            });
        }
        
        if (filterConfigData.language_filter.length > 0) {
            filterAwarded(filterConfigData.language_filter, awardedRecordsArray, "lang");
        }

        if (filterConfigData.branche_filter.length > 0) {
            filterAwarded(filterConfigData.branche_filter, awardedRecordsArray, "branche");
        }

        if (filterConfigData.location_country_filter.length > 0) {
            filterAwarded(filterConfigData.location_country_filter, awardedRecordsArray, "country");
        }

        if (filterConfigData.location_city_filter.length > 0) {
            filterAwarded(filterConfigData.location_city_filter, awardedRecordsArray, "city");
        }

        if (filterConfigData.recruitmentType_filter.length > 0) {
            filterAwarded(filterConfigData.recruitmentType_filter, awardedRecordsArray, "recruitmentType");
        }

        for (i = firstRecordNumber; i < 10; i++) {
            if (awardedRecordsArray[i]) {
                let borderColorClass = "";
                let textColorClass = "";

                if (awardedRecordsArray[i].recruitmentType === "PT") {
                    borderColorClass = "pt-border";
                    textColorClass = "pt-text";
                }
                if (awardedRecordsArray[i].recruitmentType === "RS") {
                    borderColorClass = "rs-border";
                    textColorClass = "rs-text";
                }
                if (awardedRecordsArray[i].recruitmentType === "WEW") {
                    borderColorClass = "wew-border";
                    textColorClass = "wew-text";
                }

                let formaZatrudnienia = "";

                if (awardedRecordsArray[i].jobForm) {
                    awardedRecordsArray[i].jobForm.forEach(function (elem) {
                        formaZatrudnienia =
                            formaZatrudnienia + "<p>" + elem + "</p>";
                    });
                }

                awardedResultsLoc.insertAdjacentHTML(
                    "beforeend",
                    `<a href="${
                        awardedRecordsArray[i].url
                    }" target="_blank"><div class="result ${borderColorClass}">
                <div class="top">
                
                        <div class="lang">
                            <p>${awardedRecordsArray[i].lang}</p>
                        </div>
                        <div class="branche-name">
                            <div class="branche">${
                                awardedRecordsArray[i].branche
                                    ? awardedRecordsArray[i].branche
                                    : ""
                            }</div>
                            <div class="name ${textColorClass}">${
                        awardedRecordsArray[i].name
                    }</div>
                        </div>
                    
                </div>

                <div class="bottom">
                    <div class="city-container">
                        <div class="city"><img src="./img/location_dot.svg">${
                            awardedRecordsArray[i].city
                        }</div></div>
                        <div class="details-container">
                        ${
                            awardedRecordsArray[i].remote
                                ? "<div class='remote'>zdalna</div>"
                                : ""
                        }
                        ${
                            awardedRecordsArray[i].relocation
                                ? "<div class='relocation'>relocation</div>"
                                : ""
                        }
                        ${
                            awardedRecordsArray[i].jobType
                                ? "<div class='jobtype'>" +
                                awardedRecordsArray[i].jobType +
                                "</div>"
                                : ""
                        }
                        ${
                            awardedRecordsArray[i].visibleRate
                                ? awardedRecordsArray[i].salaryFrom &&
                                awardedRecordsArray[i].salaryTo
                                    ? "<div class='salary'>" +
                                    awardedRecordsArray[i].salaryFrom +
                                    " - " +
                                    awardedRecordsArray[i].salaryTo +
                                    "</div>"
                                    : ""
                                : ""
                        }
                        <div class="employmentform">${formaZatrudnienia}</div>
                        </div>
                    
                </div>

                <div class="ribbon-wrap">
                        <div class="ribbon">
                                <img src="./img/star.svg" alt="">
                                <img src="./img/star.svg" alt="">
                                <img src="./img/star.svg" alt="">
                            </div>
                        </div>
                </div>

                

            </div></a>`
                );
            }
        }
    }
};

let filterConfigData = {};

// consider configuration filters ////////////////////////
const getConfigFilter = () => {
    const response = fetch("./config/config.json");
    return response;
};

async function readConfigFilter() {
    try {
        const rawData = await getConfigFilter();
        filterConfigData = await rawData.json();
        createRecordsObjFromAPI(apiPage, filterConfigData);
    } catch (e) {
        console.error(e);
        createRecordsObjFromAPI(apiPage);
    }
}

readConfigFilter();

// gets DATA FROM API ///////////////////////////////////////////////
const getAPI = (apiPage) => {
    const response = fetch(
        "https://grupaprogres.traffit.com/public/job_posts/published", // deactivate in local mode
        //"response.json" // activate in local mode
        {
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
                "X-Request-Page-Size": "100",
                "X-Request-Current-Page": apiPage,
                "X-Request-Sort": '{"sort_by": "id", "direction": "ASC"}',
            },
        }
    );

    return response;
};

const loopOnAPI = (jsonData, filterConfigData) => {
    if (jsonData.length > 0) {
        // deactivate in local mode
        rawAPIArray = rawAPIArray.concat(jsonData); // deactivate in local mode
        // rawAPIArray = jsonData; // activate in local mode
        apiPage++; // deactivate in local mode
        createRecordsObjFromAPI(apiPage, filterConfigData); // deactivate in local mode
    } else {
        // deactivate in local mode
        reworkData(rawAPIArray);
        recordsNumber = rawAPIArray.length;
        summariseDownload(recordsNumber);
        // createRecordBoxes(allRecordsArray, firstRecordNumber, recordsOnPage);
        createAwardedRecordBoxes(allRecordsArray, filterConfigData);
        setPages(recordsNumber);
        createFilterLists(filterConfigData);
        dropDownBtnStart();
        pagesContainerStart();
        createFilteredRecordsArray();
    } // deactivate in local mode
};

async function createRecordsObjFromAPI(apiPage, filterConfigData) {
    const rawData = await getAPI(apiPage);
    const jsonData = await rawData.json();
    loopOnAPI(jsonData, filterConfigData);
}

// create HTML FILTERS LISTS //////////////////////////////////////////////////////
const createFilterLists = (filterConfigData) => {
    // include external filter config ///////////////////

    if (!filterConfigData.salary_visible) {
        salaryLoc.classList.add("unactive");
    }

    if (!filterConfigData.relocation_visible) {
        relocationWrapperLoc.classList.add("unactive");
    }

    if (!filterConfigData.language_visible) {
        langWrapperLoc.classList.add("unactive");
    }

    if (!filterConfigData.remote_visible) {
        remoteWrapperLoc.classList.add("unactive");
    }

    if (!filterConfigData.location_visible) {
        locWrapperLoc.classList.add("unactive");
    }

    if (!filterConfigData.branche_visible) {
        brancheWrapperLoc.classList.add("unactive");
    }

    let isSamsungBrowser = navigator.userAgent.match(/SamsungBrowser/i);
    let isChromeBrowser = navigator.userAgent.match(/Chrome/i);

    if (filterBranchesList.length > 0) {
        filterBranchesList.sort(function (a, b) {
            return a.localeCompare(b);
        });
        rowHeight = filterBranchesList.length * 21 + 3;
        filterListMaxHeight = rowHeight;
        if (getMobileOperatingSystem() === "unknown") {
            branchesLoc.style.height = String(rowHeight) + "px";
        } else if (isSamsungBrowser || isChromeBrowser) {
            branchesLoc.style.height = "50px";
        } else {
            branchesLoc.style.height = String(rowHeight) + "px";
        }
        filterBranchesList.forEach(function (el) {
            branchesLoc.insertAdjacentHTML(
                "beforeend",
                `<option value="${el}">${el}</option>`
            );
        });
    }

    if (filterJobFormList.length > 0) {
        filterJobFormList.sort(function (a, b) {
            return a.localeCompare(b);
        });
        rowHeight = filterJobFormList.length * 21 + 3;
        if (getMobileOperatingSystem() === "unknown") {
            jobFormLoc.style.height = String(rowHeight) + "px";
        } else if (isSamsungBrowser || isChromeBrowser) {
            jobFormLoc.style.height = "50px";
        } else {
            jobFormLoc.style.height = String(rowHeight) + "px";
        }
        filterJobFormList.forEach(function (el) {
            jobFormLoc.insertAdjacentHTML(
                "beforeend",
                `<option value="${el}">${el}</option>`
            );
        });
    }

    if (filterJobTypeList.length > 0) {
        filterJobTypeList.sort(function (a, b) {
            return a.localeCompare(b);
        });
        rowHeight = filterJobTypeList.length * 21 + 3;
        if (getMobileOperatingSystem() === "unknown") {
            jobTypeLoc.style.height = String(rowHeight) + "px";
        } else if (isSamsungBrowser || isChromeBrowser) {
            jobTypeLoc.style.height = "50px";
        } else {
            jobTypeLoc.style.height = String(rowHeight) + "px";
        }
        filterJobTypeList.forEach(function (el) {
            jobTypeLoc.insertAdjacentHTML(
                "beforeend",
                `<option value="${el}">${el}</option>`
            );
        });
    }

    if (filterLangList.length > 0) {
        filterLangList.sort(function (a, b) {
            return a.localeCompare(b);
        });
        rowHeight = filterLangList.length * 21 + 3;
        if (getMobileOperatingSystem() === "unknown") {
            langLoc.style.height = String(rowHeight) + "px";
        } else if (isSamsungBrowser || isChromeBrowser) {
            langLoc.style.height = "50px";
        } else {
            langLoc.style.height = String(rowHeight) + "px";
        }
        filterLangList.forEach(function (el) {
            langLoc.insertAdjacentHTML(
                "beforeend",
                `<option value="${el}">${el}</option>`
            );
        });
    }

    if (Object.keys(filterCountriesList).length > 0) {
        countriesLoc.insertAdjacentHTML(
            "beforeend",
            `<option value="" class="placeholder">Państwo</option>`
        );

        citiesLoc.insertAdjacentHTML(
            "beforeend",
            `<option value="" class="placeholder">Miasto</option>`
        );

        function compare(a, b) {
            return a.city.localeCompare(b.city);
        }

        for (let key in filterCountriesList) {
            filterCountriesList[key].sort(compare);
        }

        filterCountriesList = Object.keys(filterCountriesList)
            .sort()
            .reduce((accumulator, key) => {
                accumulator[key] = filterCountriesList[key];
                return accumulator;
            }, {});

        let allCitiesObj = [];
        for (let key in filterCountriesList) {
            countriesLoc.insertAdjacentHTML(
                "beforeend",
                `<option value="${key}">${key}</option>`
            );
            allCitiesObj = allCitiesObj.concat(filterCountriesList[key]);
        }

        let allCitiesArray = [];
        allCitiesObj.forEach((el) => {
            allCitiesArray.push(el.city);
        });

        allCitiesArray.sort(function (a, b) {
            return a.localeCompare(b);
        });

        allCitiesArray.forEach(function (el) {
            citiesLoc.insertAdjacentHTML(
                "beforeend",
                `<option value="${el}" class="active">${el} </option>`
            );
        });
    }

    sliderOne.min = filterMinSalary.toString();
    sliderTwo.min = filterMinSalary.toString();
    sliderOne.max = filterMaxSalary.toString();
    sliderTwo.max = filterMaxSalary.toString();
    sliderOne.value = filterMinSalary.toString();
    sliderTwo.value = filterMaxSalary.toString();
    slideOne();
    slideTwo();
};

// filter the data to create FILTERED OBJECTS ARRAY ///////////////////////////////
const createFilteredRecordsArray = () => {
    const branchesChildrenLoc = document.querySelectorAll(".branches option");
    const jobFormChildrenLoc = document.querySelectorAll(".job-form option");
    const jobTypeChildrenLoc = document.querySelectorAll(".job-type option");
    const langChildrenLoc = document.querySelectorAll(".lang option");
    const countriesChildrenLoc = document.querySelectorAll(".countries option");
    const citiesChildrenLoc = document.querySelectorAll(".cities option");

    let filteredRecordsArray = allRecordsArray;

    // selectedBranches ////////////////

    let selectedBranches = [];

    if (
        filterConfigData.branche_filter.length 
        // && !filterConfigData.branche_visible
    ) {
        selectedBranches = filterConfigData.branche_filter;
    } else {
        selectedBranches = Array.from(branchesChildrenLoc)
            .filter(function (elem) {
                return elem.selected;
            })
            .map(function (elem) {
                return elem.value;
            });
    }

    let filteredRecordsArray_1 = [];

    if (selectedBranches.length !== 0) {
        filteredRecordsArray.forEach((el, index) => {
            let addFlag = false;

            selectedBranches.forEach((selectedFiltr) => {
                if (el.branche === selectedFiltr) {
                    addFlag = true;
                }
            });

            if (addFlag) {
                filteredRecordsArray_1.push(el);
            }
        });
    } else {
        filteredRecordsArray_1 = filteredRecordsArray;
    }

    // selectedJobForms ////////////////

    let selectedJobForms = Array.from(jobFormChildrenLoc)
        .filter(function (elem) {
            return elem.selected;
        })
        .map(function (elem) {
            return elem.value;
        });

    let filteredRecordsArray_2 = [];

    if (selectedJobForms.length !== 0) {
        filteredRecordsArray_1.forEach((el, index) => {
            if (el.jobForm) {
                let addFlag = false;

                selectedJobForms.forEach((selectedFiltr) => {
                    if (el.jobForm.indexOf(selectedFiltr) !== -1) {
                        addFlag = true;
                    }
                });

                if (addFlag) {
                    filteredRecordsArray_2.push(el);
                }
            }
        });
    } else {
        filteredRecordsArray_2 = filteredRecordsArray_1;
    }

    // selectedJobTypes////////////////

    let selectedjobTypes = Array.from(jobTypeChildrenLoc)
        .filter(function (elem) {
            return elem.selected;
        })
        .map(function (elem) {
            return elem.value;
        });

    let filteredRecordsArray_3 = [];

    if (selectedjobTypes.length !== 0) {
        filteredRecordsArray_2.forEach((el, index) => {
            let addFlag = false;

            selectedjobTypes.forEach((selectedFiltr) => {
                if (el.jobType === selectedFiltr) {
                    addFlag = true;
                }
            });

            if (addFlag) {
                filteredRecordsArray_3.push(el);
            }
        });
    } else {
        filteredRecordsArray_3 = filteredRecordsArray_2;
    }

    // selectedLangs ////////////////
    let selectedLangs = [];

    if (
        filterConfigData.language_filter.length 
        // && !filterConfigData.language_visible
    ) {
        selectedLangs = filterConfigData.language_filter;
    } else {
        selectedLangs = Array.from(langChildrenLoc)
            .filter(function (elem) {
                return elem.selected;
            })
            .map(function (elem) {
                return elem.value;
            });
    }

    let filteredRecordsArray_4 = [];

    if (selectedLangs.length !== 0) {
        filteredRecordsArray_3.forEach((el, index) => {
            let addFlag = false;

            selectedLangs.forEach((selectedFiltr) => {
                if (el.lang === selectedFiltr) {
                    addFlag = true;
                }
            });

            if (addFlag) {
                filteredRecordsArray_4.push(el);
            }
        });
    } else {
        filteredRecordsArray_4 = filteredRecordsArray_3;
    }

    // selectedSalary ////////////////

    let selectedValOne;
    let selectedValTwo;
    if (salaryMarkLoc.checked) {
        selectedValOne = parseInt(displayValOne.innerText);
        selectedValTwo = parseInt(displayValTwo.innerText);
    }

    let filteredRecordsArray_5 = [];

    if (salaryMarkLoc.checked) {
        filteredRecordsArray_4.forEach((el, index) => {
            let addFlag = false;

            if (el.visibleRate) {
                if (el.salaryTo && el.salaryFrom) {
                    if (
                        el.salaryTo >= selectedValOne &&
                        el.salaryFrom <= selectedValTwo
                    ) {
                        addFlag = true;
                    }
                }
                if (el.salaryTo && !el.salaryFrom) {
                    if (el.salaryTo >= selectedValOne) {
                        addFlag = true;
                    }
                }
                if (!el.salaryTo && el.salaryFrom) {
                    if (el.salaryFrom <= selectedValTwo) {
                        addFlag = true;
                    }
                }
            }

            if (addFlag) {
                filteredRecordsArray_5.push(el);
            }
        });
    } else {
        filteredRecordsArray_5 = filteredRecordsArray_4;
    }

    // selectedCountry ////////////////

    let selectedCountry = [];

    if (
        filterConfigData.location_country_filter.length 
        // && !filterConfigData.location_visible
    ) {
        selectedCountry = filterConfigData.location_country_filter;
    } else {
        if (locationMarkLoc.checked) {
            selectedCountry = Array.from(countriesChildrenLoc)
                .filter(function (elem) {
                    if (elem.value) {
                        return elem.selected;
                    }
                })
                .map(function (elem) {
                    if (elem.value) {
                        return elem.value;
                    }
                });
        }
    }

    let filteredRecordsArray_6 = [];

    if (
        locationMarkLoc.checked ||
        (filterConfigData.location_country_filter.length 
            // && !filterConfigData.location_visible
            )
    ) {
        if (selectedCountry.length) {
            filteredRecordsArray_5.forEach((el, index) => {
                let addFlag = false;

                selectedCountry.forEach((selectedFiltr) => {
                    if (el.country === selectedFiltr) {
                        addFlag = true;
                    }
                });

                if (addFlag) {
                    filteredRecordsArray_6.push(el);
                }
            });
        } else {
            filteredRecordsArray_6 = filteredRecordsArray_5;
        }
    } else {
        filteredRecordsArray_6 = filteredRecordsArray_5;
    }

    // selectedCity & selectedDistance ////////////////

    let selectedCity = [];

    if (
        filterConfigData.location_city_filter.length
        // && !filterConfigData.location_visible
    ) {
        selectedCity = filterConfigData.location_city_filter;
    } else {
        if (locationMarkLoc.checked) {
            selectedCity = Array.from(citiesChildrenLoc)
                .filter(function (elem) {
                    if (elem.value) {
                        return elem.selected;
                    }
                })
                .map(function (elem) {
                    if (elem.value) {
                        return elem.value;
                    }
                });
        }
    }

    let filteredRecordsArray_7 = [];

    if (
        locationMarkLoc.checked ||
        (filterConfigData.location_city_filter.length 
            // && !filterConfigData.location_visible
            )
    ) {
        if (selectedCity.length) {
            let selectedDistance = 0;

            selectedDistance = parseInt(locationDotLoc.value);

            let lati;
            let longi;
            let min_lati;
            let max_lati;
            let min_longi;
            let max_longi;

            filteredRecordsArray_6.forEach((el, index) => {
                if (el.city === selectedCity[0]) {
                    lati = el.lati;
                    longi = el.longi;

                    min_lati = lati - selectedDistance * 0.009044;
                    max_lati = lati + selectedDistance * 0.009044;
                    min_longi =
                        longi -
                        (selectedDistance * 0.0089831) /
                            Math.cos((lati * Math.PI) / 180);
                    max_longi =
                        longi +
                        (selectedDistance * 0.0089831) /
                            Math.cos((lati * Math.PI) / 180);
                }
            });

            filteredRecordsArray_6.forEach((el, index) => {
                let addFlag = false;

                if (
                    el.lati <= max_lati &&
                    el.lati >= min_lati &&
                    el.longi <= max_longi &&
                    el.longi >= min_longi
                ) {
                    addFlag = true;
                }

                if (addFlag) {
                    filteredRecordsArray_7.push(el);
                }
            });
        } else {
            filteredRecordsArray_7 = filteredRecordsArray_6;
        }
    } else {
        filteredRecordsArray_7 = filteredRecordsArray_6;
    }

    // selectedRemote ////////////////

    let filteredRecordsArray_8 = [];

    if (
        remoteLoc.checked ||
        (filterConfigData.remote_filter 
            // && !filterConfigData.remote_visible
            )
    ) {
        filteredRecordsArray_7.forEach((el, index) => {
            let addFlag = false;

            if (el.remote) {
                addFlag = true;
            }

            if (addFlag) {
                filteredRecordsArray_8.push(el);
            }
        });
    } else {
        filteredRecordsArray_8 = filteredRecordsArray_7;
    }

    // selectedRelocation ////////////////

    let filteredRecordsArray_9 = [];

    if (relocationLoc.checked) {
        filteredRecordsArray_8.forEach((el, index) => {
            let addFlag = false;

            if (el.relocation) {
                addFlag = true;
            }

            if (addFlag) {
                filteredRecordsArray_9.push(el);
            }
        });
    } else {
        filteredRecordsArray_9 = filteredRecordsArray_8;
    }

    // searchText ////////////////

    let filteredRecordsArray_10 = [];

    let searchText = searchInputLoc.value;

    if (searchText) {
        filteredRecordsArray_9.forEach((el, index) => {
            let addFlag = false;

            let position;

            el.description.forEach(function (elem) {
                if (elem.value && elem.field_id !== "geolocation") {
                    position = elem.value
                        .toLowerCase()
                        .search(searchText.toLowerCase());
                    if (position !== -1) {
                        addFlag = true;
                    }
                }
            });

            position = el.name.toLowerCase().search(searchText.toLowerCase());
            if (position !== -1) {
                addFlag = true;
            }

            if (addFlag) {
                filteredRecordsArray_10.push(el);
            }
        });
    } else {
        filteredRecordsArray_10 = filteredRecordsArray_9;
    }

    // selectedRecruitmentType (coloring of records) ////////////////
    filteredRecordsArray_11 = [];
    
    let selectedRecruitmentType = [];

    if (filterConfigData.recruitmentType_filter.length) {
        selectedRecruitmentType = filterConfigData.recruitmentType_filter;
    }

    if (selectedRecruitmentType.length !== 0) {
        filteredRecordsArray_10.forEach((el, index) => {
            let addFlag = false;

            selectedRecruitmentType.forEach((selectedFiltr) => {
                if (el.recruitmentType === selectedFiltr) {
                    addFlag = true;
                }
            });

            if (addFlag) {
                filteredRecordsArray_11.push(el);
            }
        });
    } else {
        filteredRecordsArray_11 = filteredRecordsArray_10;
    }

    recordsNumber = filteredRecordsArray_11.length;
    summariseDownload(recordsNumber);
    createRecordBoxes(filteredRecordsArray_11, 0, recordsOnPage);
    setPages(recordsNumber);
    filtersON = true;
    hideFilter();
    
    setTimeout(setParentIframeHeight, 1000);
    
};

// SEARCH LISTENER /////////////////////////////////////////////////////////////
searchBtn.addEventListener("click", createFilteredRecordsArray);

// COUNTRY & CITY LISTENER /////////////////////////////////////////////////////////////
locationMarkLoc.addEventListener("change", function (e) {
    if (e.target.checked) {
        if (citiesLoc.value) {
            locationSliderLoc.classList.remove("unactive");
            locationValuesLoc.classList.remove("unactive");
            locationDotLoc.disabled = false;
        }

        countriesLoc.disabled = false;
        citiesLoc.disabled = false;
    } else {
        locationSliderLoc.classList.add("unactive");
        locationValuesLoc.classList.add("unactive");
        locationDotLoc.disabled = true;

        countriesLoc.disabled = true;
        citiesLoc.disabled = true;
    }
});

function slideDistance() {
    displayValDistance.textContent = locationDotLoc.value;
}

const activateCities = () => {
    citiesLoc.querySelectorAll("option").forEach((el) => {
        if (countriesLoc.value) {
            if (
                filterCountriesList[countriesLoc.value].findIndex(
                    (sel_el) => sel_el.city === el.value
                ) !== -1
            ) {
                el.classList.add("active");
            } else {
                el.classList.remove("active");
            }
        } else {
            el.classList.add("active");
        }
    });
};

countriesLoc.addEventListener("change", function () {
    activateCities();

    if (countriesLoc.value) {
        if (
            filterCountriesList[countriesLoc.value].find(
                (el) => el.city !== citiesLoc.value
            )
        ) {
            citiesLoc.value = filterCountriesList[countriesLoc.value][0].city;
            locationSliderLoc.classList.remove("unactive");
            locationValuesLoc.classList.remove("unactive");
            locationDotLoc.disabled = false;
        }
    } else {
        citiesLoc.value = citiesLoc[0].value;
        locationSliderLoc.classList.add("unactive");
        locationValuesLoc.classList.add("unactive");
        locationDotLoc.disabled = true;
    }
});

citiesLoc.addEventListener("change", function () {
    Object.keys(filterCountriesList).find((key) => {
        if (
            filterCountriesList[key].findIndex(
                (sel_el) => sel_el.city === citiesLoc.value
            ) !== -1
        ) {
            if (countriesLoc.value !== key) {
                countriesLoc.value = key;
                activateCities();
            }
        }
    });
    if (!citiesLoc.value) {
        locationSliderLoc.classList.add("unactive");
        locationValuesLoc.classList.add("unactive");
        locationDotLoc.disabled = true;
    } else {
        locationSliderLoc.classList.remove("unactive");
        locationValuesLoc.classList.remove("unactive");
        locationDotLoc.disabled = false;
    }
});

// SALARY LISTENER ////////////////////////////////////////////////////////////////////
let minGap = 0;

function slideOne() {
    if (parseInt(sliderTwo.value) - parseInt(sliderOne.value) <= minGap) {
        sliderOne.value = parseInt(sliderTwo.value) - minGap;
    }
    displayValOne.textContent = sliderOne.value;

    if (sliderOne.value === sliderTwo.value) {
        sliderOne.style.zIndex = "1";
    } else {
        sliderOne.style.zIndex = "0";
    }

    fillColor();
}

function slideTwo() {
    if (parseInt(sliderTwo.value) - parseInt(sliderOne.value) <= minGap) {
        sliderTwo.value = parseInt(sliderOne.value) + minGap;
    }
    displayValTwo.textContent = sliderTwo.value;
    if (displayValTwo.textContent === "100000") {
        salaryMarkLoc.disabled = true;
        displayValOne.textContent = "";
        displayValTwo.textContent = "";
        pauseLoc.textContent = "";
    }
    fillColor();
}

function fillColor() {
    percent1 =
        ((sliderOne.value - sliderOne.min) / (sliderOne.max - sliderOne.min)) *
        100;
    percent2 =
        ((sliderTwo.value - sliderOne.min) / (sliderOne.max - sliderOne.min)) *
        100;
    sliderTrack.style.background = `linear-gradient(to right, #dadae5 ${percent1}%, #fe7320ff ${percent1}%, #fe7320ff ${percent2}%, #dadae5 ${percent2}%)`;
}

sliderOne.value = filterMaxSalary.toString();
sliderTwo.value = filterMinSalary.toString();

salaryMarkLoc.addEventListener("change", function (e) {
    if (e.target.checked) {
        salarySliderLoc.classList.remove("unactive");
        salaryValuesLoc.classList.remove("unactive");
        sliderOne.disabled = false;
        sliderTwo.disabled = false;
    } else {
        salarySliderLoc.classList.add("unactive");
        salaryValuesLoc.classList.add("unactive");
        sliderOne.disabled = true;
        sliderTwo.disabled = true;
    }
});

// PAGES /////////////////////////////////////////////////////////////
const changePage = (pageBtn) => {
    pageButtonsLoc.forEach((el) => {
        el.classList.remove("active");
    });
    pageBtn.classList.add("active");
    let firstRecord =
        recordsOnPage * parseInt(pageBtn.innerText) - recordsOnPage;
    let lastRecord = recordsOnPage * parseInt(pageBtn.innerText);

    filtersON
        ? createRecordBoxes(filteredRecordsArray_11, firstRecord, lastRecord)
        : createRecordBoxes(allRecordsArray, firstRecord, lastRecord);
    globActivePageNo = parseInt(pageBtn.innerText);
    setTimeout(setParentIframeHeight(), 500);
};

let globActivePageNo;

const movePrevPagesBtns = () => {
    let firstDispalyedPageNo = parseInt(
        Array.from(document.querySelectorAll(".page")).shift().innerText
    );
    let lastDispalyedPageNo = parseInt(
        Array.from(document.querySelectorAll(".page")).pop().innerText
    );

    let activePageNo;
    activePageNo = document.querySelector(".page.active");

    if (activePageNo) {
        activePageNo = parseInt(activePageNo.innerText);
    }

    if (firstDispalyedPageNo > 1) {
        pagesSwitchLoc.replaceChildren();

        for (n = firstDispalyedPageNo - 1; n <= lastDispalyedPageNo - 1; n++) {
            if (!activePageNo) {
                activePageNo = globActivePageNo;
            }
            if (activePageNo && n === activePageNo) {
                pagesSwitchLoc.insertAdjacentHTML(
                    "beforeend",
                    `<div class="page active">${n}</div>`
                );
            } else {
                pagesSwitchLoc.insertAdjacentHTML(
                    "beforeend",
                    `<div class="page">${n}</div>`
                );
            }
        }

        if (lastDispalyedPageNo < pagesQuantityCalc + 1) {
            pagesSwitchLoc.insertAdjacentHTML(
                "beforeend",
                `<div class="next active"><img src="./img/chevron-right.svg" alt="" /></div>`
            );
            let nextBtnLoc = document.querySelector(".next");
            nextBtnLoc.addEventListener("click", () => {
                moveNextPagesBtns();
            });
        } else {
            pagesSwitchLoc.insertAdjacentHTML(
                "beforeend",
                `<div class="next"><img src="" alt="" /></div>`
            );
        }

        if (firstDispalyedPageNo > 2) {
            pagesSwitchLoc.insertAdjacentHTML(
                "afterbegin",
                `<div class="prev active"><img src="./img/chevron-left.svg" alt="" /></div>`
            );
            let prevBtnLoc = document.querySelector(".prev");
            prevBtnLoc.addEventListener("click", () => {
                movePrevPagesBtns();
            });
        } else {
            pagesSwitchLoc.insertAdjacentHTML(
                "afterbegin",
                `<div class="prev"><img src="" alt="" /></div>`
            );
        }

        pageButtonsLoc = document.querySelectorAll(".page");
        pageButtonsLoc.forEach((el) => {
            el.addEventListener("click", (e) => {
                changePage(e.target);
            });
        });
    }
};

const moveNextPagesBtns = () => {
    let firstDispalyedPageNo = parseInt(
        Array.from(document.querySelectorAll(".page")).shift().innerText
    );
    let lastDispalyedPageNo = parseInt(
        Array.from(document.querySelectorAll(".page")).pop().innerText
    );

    let activePageNo;
    activePageNo = document.querySelector(".page.active");
    if (activePageNo) {
        activePageNo = parseInt(activePageNo.innerText);
        globActivePageNo = activePageNo;
    }

    if (lastDispalyedPageNo < pagesQuantityCalc) {
        pagesSwitchLoc.replaceChildren();

        for (n = firstDispalyedPageNo + 1; n <= lastDispalyedPageNo + 1; n++) {
            if (!activePageNo) {
                activePageNo = globActivePageNo;
            }
            if (activePageNo && n === activePageNo) {
                pagesSwitchLoc.insertAdjacentHTML(
                    "beforeend",
                    `<div class="page active">${n}</div>`
                );
            } else {
                pagesSwitchLoc.insertAdjacentHTML(
                    "beforeend",
                    `<div class="page">${n}</div>`
                );
            }
        }

        if (lastDispalyedPageNo < pagesQuantityCalc - 1) {
            pagesSwitchLoc.insertAdjacentHTML(
                "beforeend",
                `<div class="next active"><img src="./img/chevron-right.svg" alt="" /></div>`
            );
            let nextBtnLoc = document.querySelector(".next");
            nextBtnLoc.addEventListener("click", () => {
                moveNextPagesBtns();
            });
        } else {
            pagesSwitchLoc.insertAdjacentHTML(
                "beforeend",
                `<div class="next"><img src="" alt="" /></div>`
            );
        }

        if (firstDispalyedPageNo > 0) {
            pagesSwitchLoc.insertAdjacentHTML(
                "afterbegin",
                `<div class="prev active"><img src="./img/chevron-left.svg" alt="" /></div>`
            );
            let prevBtnLoc = document.querySelector(".prev");
            prevBtnLoc.addEventListener("click", () => {
                movePrevPagesBtns();
            });
        } else {
            pagesSwitchLoc.insertAdjacentHTML(
                "afterbegin",
                `<div class="prev"><img src="" alt="" /></div>`
            );
        }

        pageButtonsLoc = document.querySelectorAll(".page");
        pageButtonsLoc.forEach((el) => {
            el.addEventListener("click", (e) => {
                changePage(e.target);
            });
        });
    }
};

// RWD /////////////////////////////////////////////////////////////
function getWidth() {
    return Math.max(
        document.body.scrollWidth,
        document.documentElement.scrollWidth,
        document.body.offsetWidth,
        document.documentElement.offsetWidth,
        document.documentElement.clientWidth
    );
}

function getHeight() {
    return Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.offsetHeight,
        document.documentElement.clientHeight
    );
}

let maxPageBtns;

if (getWidth() < 500) {
    maxPageBtns = 6;
}
if (getWidth() >= 500 && getWidth() < 700) {
    maxPageBtns = 8;
}
if (getWidth() > 700 && getWidth() < 900) {
    maxPageBtns = 10;
}
if (getWidth() > 900 && getWidth() < 1024) {
    maxPageBtns = 15;
}
if (getWidth() > 1024) {
    maxPageBtns = 20;
}

let pagesQuantityCalc;

const setPages = (recordsNumber) => {
    pagesQuantityCalc = Math.ceil(recordsNumber / recordsOnPage);

    if (pagesQuantityCalc > maxPageBtns) {
        pagesSwitchLoc.replaceChildren();

        for (n = 1; n <= maxPageBtns; n++) {
            if (n === 1) {
                pagesSwitchLoc.insertAdjacentHTML(
                    "beforeend",
                    `<div class="page active">${n}</div>`
                );
            } else {
                pagesSwitchLoc.insertAdjacentHTML(
                    "beforeend",
                    `<div class="page">${n}</div>`
                );
            }
        }
        pagesSwitchLoc.insertAdjacentHTML(
            "beforeend",
            `<div class="next active"><img src="./img/chevron-right.svg" alt="" /></div>`
        );
        let nextBtnLoc = document.querySelector(".next");
        nextBtnLoc.addEventListener("click", () => {
            moveNextPagesBtns();
        });
    } else {
        pagesSwitchLoc.replaceChildren();

        for (n = 1; n <= pagesQuantityCalc; n++) {
            if (n === 1) {
                pagesSwitchLoc.insertAdjacentHTML(
                    "beforeend",
                    `<div class="page active">${n}</div>`
                );
            } else {
                pagesSwitchLoc.insertAdjacentHTML(
                    "beforeend",
                    `<div class="page">${n}</div>`
                );
            }
        }

        pagesSwitchLoc.insertAdjacentHTML(
            "beforeend",
            `<div class="next"><img src="" alt="" /></div>`
        );
    }

    pagesSwitchLoc.insertAdjacentHTML(
        "afterbegin",
        `<div class="prev"><img src="" alt="" /></div>`
    );

    pageButtonsLoc = document.querySelectorAll(".page");
    pageButtonsLoc.forEach((el) => {
        el.addEventListener("click", (e) => {
            changePage(e.target);
        });
    });
};

// change RECORDS QUANTITY ON PAGE //////////////////////////////////////////////////
recordsOnPageLoc.addEventListener("change", (e) => {
    recordsOnPage = parseInt(e.target.value);

    filtersON
        ? createRecordBoxes(filteredRecordsArray_11, 0, recordsOnPage)
        : createRecordBoxes(allRecordsArray, 0, recordsOnPage);
    setPages(recordsNumber);

    setParentIframeHeight();
});


// CLEAR FILTERS //////////////////////////////////////////////////
const clearFilters = () => {
    searchInputLoc.value = "";
    window.location.reload();
};

clearFiltersLoc.addEventListener("click", clearFilters);

clearFilterLoc.forEach((elemFiltr) => {
    elemFiltr.addEventListener("click", () => {
        let optArray = elemFiltr.nextElementSibling.querySelectorAll("option");
        optArray.forEach((elOpt) => {
            if (elOpt.selected) {
                elOpt.selected = false;
            }
        });
    });
});

// Determine the mobile operating system
function getMobileOperatingSystem() {
    var userAgent = navigator.userAgent || navigator.vendor || window.opera;

    if (/android/i.test(userAgent)) {
        return "Android";
    }

    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        return "iOS";
    }

    return "unknown";
}
