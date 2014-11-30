myApp.constant("menuTree", {
    home: {
        title: {
            en_US: "Home",
            pt_BR: "Início"
        },
        icon: "fa-home",
        query: {
            sparql: "",
            results: {
                clickable: true,
                menuMatch: "academic"
            }
        },
        academic: {
            title: {
                en_US: "Teachers",
                pt_BR: "Docentes"
            },
            icon: "fa-users",
            query: {
                sparql: "select ?teacher as ?title ?email as ?desc ?email as ?queryValue  where {?x rdf:type cin:academic . ?x cin:name ?teacher . ?x cin:email ?email} group by ?teacher order by ?teacher",
                results: {
                    clickable: true,
                    menuMatch: "profile"
                }
            },
            profile: {
                title: {
                    en_US: "Profile",
                    pt_BR: "Perfil"
                },
                icon: "fa-user",
                query: {
                    sparql: "select ?title ?desc ?email as ?queryValue where { ?x rdf:type cin:academic . ?x cin:name ?nome . ?x cin:email '%%%' . ?x cin:email ?email . ?x ?title ?desc . {?x cin:office ?desc } UNION {?x cin:phone ?desc} UNION {?x cin:lattes ?desc} UNION {?x cin:homepage ?desc} UNION {?x cin:email ?desc}} group by ?nome",
                    results: {
                        clickable: false,
                        menuMatch: "none"
                    }
                }
            },
            publications: {
                title: {
                    en_US: "Publications",
                    pt_BR: "Publicações"
                },
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
                title: {
                    en_US: "Projects",
                    pt_BR: "Projetos"
                },
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
                title: {
                    en_US: "Positions",
                    pt_BR: "Cargos"
                },
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
            title: {
                en_US: "Areas of Expertise",
                pt_BR: "Áreas de Atuação"
            },
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
            title: {
                en_US: "Areas of Interest",
                pt_BR: "Áreas de Interesse"
            },
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
