myApp.constant("menuTree", {
    home: {
        icon: "fa-home",
        query: {
            sparql: "",
            results: {
                clickable: true,
                menuMatch: "academic"
            }
        },
        academic: {
            icon: "fa-users",
            query: {
                sparql: "select ?teacher as ?title ?email as ?desc ?email as ?queryValue  where {?x rdf:type cin:academic . ?x cin:name ?teacher . ?x cin:email ?email} group by ?teacher order by ?teacher",
                results: {
                    clickable: true,
                    menuMatch: "profile"
                }
            },
            profile: {
                icon: "fa-user",
                query: {
                    sparql: "select ?title ?desc ?email as ?queryValue where { ?x rdf:type cin:academic . ?x cin:name ?nome . ?x cin:email '%%%' . ?x cin:email ?email . ?x ?title ?desc . {?x cin:name ?desc} UNION    {?x cin:office ?desc } UNION {?x cin:phone ?desc} UNION {?x cin:lattes ?desc} UNION {?x cin:homepage ?desc} UNION {?x cin:email ?desc}} group by ?nome",
                    results: {
                        clickable: false,
                        menuMatch: "none"
                    }
                }
            },
            publications: {
                icon: "fa-quote-right",
                query: {
                    sparql: "select ?type as ?title ?name as ?desc ?public as ?queryValue where {?x cin:email '%%%' . ?public ?idProfessor ?x . ?public rdf:type ?type . ?public cin:title ?name} group by ?name order by ?type",
                    results: {
                        clickable: true,
                        menuMatch: "none"
                    }
                }

            },
            projects: {
                icon: "fa-gears",
                query: {
                    sparql: "",
                    results: {
                        clickable: false,
                        menuMatch: "none"
                    }
                }
            },
            positions: {
                icon: "fa-suitcase",
                query: {
                    sparql: "",
                    results: {
                        clickable: false,
                        menuMatch: "none"
                    }
                }
            }
        },
        expertiseAreas: {
            icon: "fa-graduation-cap",
            query: {
                sparql: "select ?ea as ?title ?eaname as ?desc ?ea as ?queryValue where {?x rdf:type cin:academic . ?x cin:hasAreaExpertise ?ea . ?ea cin:name ?eaname} group by ?ea order by ?desc",
                results: {
                    clickable: false,
                    menuMatch: "none"
                }
            }

        },
        interestAreas: {
            icon: "fa-heart",
            query: {
                sparql: "select ?ia as ?title ?ianame as ?desc ?ia as ?queryValue where {?x rdf:type cin:academic . ?x cin:hasAreaInterest ?ia . ?ia cin:name ?ianame} group by ?ianame order by ?desc",
                results: {
                    clickable: false,
                    menuMatch: "none"
                }
            }
        }
    }

});
