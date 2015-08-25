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
                    sparql: "select ?type as ?title fn:concat(?name, fn:concat('.<i> ', fn:concat(?local, fn:concat('</i> [', fn:concat(?issued, ']'))))) as ?desc ?public as ?queryValue ?type as ?group where {?x cin:email '%%%' . ?public ?idProfessor ?x . ?public rdf:type ?type . ?public cin:title ?name . ?public cin:issued ?issued . MINUS { ?public rdf:type cin:newsitem } . OPTIONAL { ?public cin:local ?local} } group by ?name order by DESC(?issued)",
                    results: {
                        clickable: true,
                        menuMatch: "publication"
                    }
                },
                publication: {
                    icon: "fa-file-text-o",
                    query: {
                        sparql: "select distinct str(?prop) as ?title str(?val) as ?desc ?val as ?queryValue where { <%%%> ?prop ?val FILTER isLiteral(?val)}",

                        results: {
                            clickable: false,
                            menuMatch: "none"
                        }

                    }

                }

            },
            news: {
                icon: "fa-newspaper-o",
                query: {
                    sparql: "select ?date as ?title ?tit as ?desc ?not as ?queryValue where {?not cin:cite ?doc . ?doc cin:email '%%%' . ?not cin:date ?date . ?not cin:title ?tit} group by ?title order by ?title",
                    results: {
                        clickable: true,
                        menuMatch: "newsItem"
                    }
                },
                newsItem: {
                    icon: "fa-newspaper-o",
                    query: {
                        sparql: "select distinct str(?prop) as ?title str(?val) as ?desc ?val as ?queryValue where { <%%%> ?prop ?val FILTER isLiteral(?val)}",

                        results: {
                            clickable: false,
                            menuMatch: "none"
                        }
                    }
                }
            },
            orientations: {
                icon: "fa-users",
                query: {
                    sparql: "SELECT DISTINCT ?nome as ?title fn:concat(?titulo, fn:concat('. ', ?semester)) as ?desc ?tese as ?queryValue ?t as ?group WHERE { ?tese rdf:type ?t . ?prof cin:email '%%%'. ?aluno cin:isSupervisedBy ?prof . ?aluno cin:creator ?tese . ?tese cin:title ?titulo . ?aluno cin:name ?nome . ?aluno cin:email ?emailAluno . OPTIONAL {?tese cin:semester ?semester} }",
                    results: {
                        clickable: true,
                        menuMatch: "thesis"
                    }
                },
                thesis: {
                    icon: "fa-indent",
                    query: {
                        sparql: "select distinct str(?prop) as ?title str(?val) as ?desc ?val as ?queryValue where {{<%%%> ?prop ?val FILTER isLiteral(?val)} UNION {?aluno cin:creator <%%%> . ?aluno cin:name ?val . ?aluno ?prop ?val} UNION {?aluno cin:creator <%%%> . ?aluno cin:email ?val . ?aluno ?prop ?val}}",
                        results: {
                            clickable: false,
                            menuMatch: "none"
                        }
                    }
                }

            },
            expertiseAreasByTeacher:{
              icon: "fa-graduation-cap",
                query: {
                    sparql: "select ?eaname as ?desc ?ea as ?queryValue where {?x cin:email '%%%' . ?x rdf:type cin:academic . ?x cin:hasAreaExpertise ?ea . ?ea cin:name ?eaname} group by ?ea order by ?desc",
                    results: {
                        clickable: true,
                        menuMatch: "academicPerArea"
                    }
                }

            },
            interestAreas: {
                icon: "fa-heart",
                query: {
                    sparql: "select distinct ?ianame as ?desc ?ia as ?queryValue where {?x cin:email '%%%' . ?x rdf:type cin:academic . ?x cin:hasAreaInterest ?ia . ?ia cin:name ?ianame} group by ?ianame order by ?desc",
                    results: {
                        clickable: false,
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
                sparql: "select ?eaname as ?desc ?ea as ?queryValue where {?x rdf:type cin:academic . ?x cin:hasAreaExpertise ?ea . ?ea cin:name ?eaname} group by ?ea order by ?desc",
                results: {
                    clickable: true,
                    menuMatch: "academicPerArea"
                }
            },
            academicPerArea: {
                icon: "fa-users",
                query: {
                    sparql: "select distinct ?name as ?title ?email as ?desc ?email as ?queryValue where {?x rdf:type cin:academic . ?x cin:hasAreaExpertise <%%%> . ?x cin:name ?name . ?x cin:email ?email} order by ?name",
                    results: {
                        clickable: true,
                        menuMatch: "profile"
                    }
                }
            }

        }
    }

});
