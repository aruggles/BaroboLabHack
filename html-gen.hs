{-# LANGUAGE OverloadedStrings #-}

import Prelude
import qualified Prelude as P
import Data.Monoid (mempty)

import Text.Blaze.Html5
import qualified Text.Blaze.Html5 as H
import Text.Blaze.Html5.Attributes hiding (challenge)
import qualified Text.Blaze.Html5.Attributes as A

import Text.Blaze.Html.Renderer.Pretty (renderHtml)

elem !. c = elem ! class_ c
elem !# i = elem ! A.id i

boilerplate navlist content scripts =
  let scripts' = mapM_ (\s -> script ! src s $ mempty) $ [
                    "js/vendor/jquery-1.10.2.min.js"
                    , "js/vendor/bootstrap.min.js" ] ++ scripts
  in do
    docTypeHtml ! lang "en" $ do
        H.head $ do
            meta ! charset "utf-8"
            H.title "BaroboLab - DEMO"
            link ! rel "stylesheet" ! href "css/bootstrap.min.css"
            link ! rel "stylesheet" ! href "css/main.css"
        body $ do
            nav ! class_ "app" $ do
                a ! href "index.html" $ img ! src "img/barobo_logo.png"
                ol ! class_ "nav nav-stacked nav-pills" $ sequence_ navlist
            section ! class_ "container" $ content
            scripts'

boilerplate' n c = boilerplate n c []

genHtml (file, html) = writeFile file $ renderHtml html

-- | Coerce that squirrely string literal
str :: String -> Html
str = toHtml

val :: String -> AttributeValue
val = toValue

labNavHdr =
    [ li $ a ! href "holt.html" $ img ! src "img/holt_california.png"
    , li $ a ! href "chap6.html" $ "Chapter 6"
    , hr ! class_ "hdr"
    ]

labNavFtr =
    [ hr ! class_ "ftr"
    , li $ a ! href "lab_overview.html" $ small ! class_ "text-muted" $ "Overview"
    ]

labNav, labNavInner :: String -> [Html]

labNavInner title =
    [ li $ a ! href "setup.html" $ H.div $ do
        "6.1:"
        small "Cops vs. Robbers"
    , li ! class_ "active" $ a ! href "#" $ toHtml title
    ]

labNav title =
    labNavHdr ++
    (labNavInner title) ++
    labNavFtr

labOverviewNav = labNavHdr ++ (labNavInner "Overview")

index = boilerplate'
    -- Keep space for the nav on other pages
    [ li ! class_ "invisible" $ "foo" ]
    (do
        a ! href "holt.html"
            $ img ! class_ "textbook btn btn-default"
                  ! A.id "holt_img" ! src "img/holt_california.png"
        a ! href "#"
            $ img ! class_ "textbook btn btn-default disabled"
                  ! src "img/ca_common_core.png"
    )

holt = boilerplate'
    [ li ! class_ "active" $ a ! href "holt.html" $ img ! src "img/holt_california.png"
    ]
    (ol ! class_ "nav nav-stacked nav-pills" $ do
        li ! class_ "disabled" $ a ! href "#" $ "Chapter 1"
        li ! class_ "disabled" $ a ! href "#" $ "Chapter 2"
        li ! class_ "disabled" $ a ! href "#" $ "Chapter 3"
        li ! class_ "disabled" $ a ! href "#" $ "Chapter 4"
        li ! class_ "disabled" $ a ! href "#" $ "Chapter 5"
        li $ a ! href "chap6.html" $ "Chapter 6"
    )

chap6 = boilerplate'
    [ li $ a ! href "holt.html" $ img ! src "img/holt_california.png"
    , li ! class_ "active" $ a ! href "#" $ "Chapter 6"
    ]
    (ul ! class_ "sections nav nav-stacked nav-pills" $ do
        li $ a ! href "setup.html" ! A.title commonCoreWords $ do
            small "6.1"
            "Solving Systems by Graphing"
            small $ "(Common Core 5.1)"
        li' "6.2"
        li' "6.3"
        li' "6.4"
        li' "6.5"
    )
  where
    li' v = li !. "disabled" $ a ! href "#" $ small v
    commonCoreWords = val $
      "A-RE1.6; Solve systems of linear equations exactly and approximately "
      ++ "(e.g., with graphs) focusing on pairs of linear equations in two "
      ++ "variables."

section6_1 = boilerplate'
    [ li $ a ! href "holt.html" $ img ! src "img/holt_california.png"
    , li $ a ! href "chap6.html" $ "Chapter 6"
    , li ! class_ "active" $ a ! href "#" $ "Section 6.1"
    ]
    (ul ! class_ "nav nav-stacked nav-pills" $ do
        li ! class_ "disabled" $ a ! href "#" $ "x vs. t"
        li $ a ! href "setup.html" $ "Cops vs. Robbers"
        li ! class_ "disabled" $ a ! href "#" $ "Slow Runners vs. Fast Runners"
    )

lab_overview = boilerplate'
    labOverviewNav
    (do
        table ! class_ "table table-striped overviewPics" $ do
            tr $ do
                td $ img ! src "img/labsetup.png"
                td $ H.div ! class_ "stepDescr" $ "Set up the lab."
            tr $ do
                td $ img ! src "img/prediction.png"
                td $ H.div ! class_ "stepDescr"
                    $ str $ "Read the question and introduce the charts. After "
                        ++ "entering a guess, press Next."
            tr $ do
                td $ img ! src "img/charts.png"
                td $ H.div ! class_ "stepDescr"
                    $ str $ "The robots will advance. The charts can be reset "
                        ++ "and students can guess again!"
        a ! class_ "pull-right btn btn-primary" ! href "setup.html" $ "Go to first step"
    )

charts = boilerplate
    (labNav "Guess")
    (do
        H.div ! class_ "row chartRow" $ do
            figure ! class_ "col-xs-3" $ do
                figcaption "Position"
                H.div ! A.id "pos" ! class_ "chart" $ mempty
            figure ! class_ "col-xs-8 col-xs-offset-1" $ do
                figcaption "Position vs. Time"
                H.div ! A.id "xvst" ! class_ "chart" $ mempty
                small ! class_ "xtitle" $ "time (s)"
        H.form ! class_ "form-inline" $ do
          H.div ! class_ "form-group" $ do
              H.label ! for "intersect" $ "When does the cop catch the robber?"
              input ! A.id "guess" ! type_ "text"
                    ! name "intersect"
          H.div ! class_ "form-group" $ do
              button ! class_ "btn btn-default" ! type_ "button" ! A.id "demoBtn" $ "Retry"
              button ! class_ "btn btn-info" ! type_ "button" ! A.id "resetBtn" $ "Reset"
              button ! class_ "btn btn-danger" ! type_ "button" ! A.id "stopBtn" $ "STOP!"
          H.div ! class_ "fwdBack" $ do
              a ! class_ "btn btn-default" ! href "prediction.html" $ "Back"
              a ! href "challenge.html" ! class_ "pull-right btn btn-primary" $ "Next"
    )
    ["js/flot/jquery.flot.js", "js/vendor/bootbox.min.js", "js/copVsRobber.js"]

setup = boilerplate'
    (labNav "Setup")
    (do
        p $ str $ "To run this curriculum application, please setup the "
            ++ "robots according to the following image."
        img ! src "img/setup.png" ! class_ "center-block fullContent"
        a ! href "prediction.html"
          ! class_ "pull-right btn btn-large btn-primary" $ "Next"
    )

prediction = boilerplate'
    (labNav "Prediction")
    (do
      p $ do
          "Suppose the"
          H.span ! A.style "color: blue" $ "cop"
          "Linkbot starts at position\n      -2 and the"
          H.span ! A.style "color: red" $ "robber"
          "Linkbot starts at position 4."
      p $ do
          str $ "The cop Linkbot travels at two meters per second (2 m/s), and "
            ++ "the robber Linkbot travels at half a meter per second (0.5 "
            ++ "m/s)."
      H.form ! action "charts.html" $ do
          H.div ! class_ "form-group" $ do
              H.label ! for "guess" $
                  "How long does it take the cop to catch the robber?"
              input ! class_ "form-control" ! type_ "text" ! name "intersect"
                    ! placeholder "time in seconds"
          input ! class_ "btn btn-primary pull-right" ! type_ "submit"
                ! value "Next"
      a ! href "setup.html" ! class_ "btn btn-default" $ "Back"
    )

challenge = boilerplate
    (labNav "Challenge")
    (do
      h2 $ "Factoring Challenge"
      H.div ! A.id "challengeApp" $ mempty
    )
    ["js/vendor/serenade.0.5.0.js", "js/challenge/sr-view-app.js", "js/challenge.js"]

main = mapM_ genHtml [
    ("html/index.html", index)
    , ("html/holt.html", holt)
    , ("html/chap6.html", chap6)
    , ("html/section6-1.html", section6_1)
    , ("html/lab_overview.html", lab_overview)
    , ("html/charts.html", charts)
    , ("html/setup.html", setup)
    , ("html/prediction.html", prediction)
    , ("html/challenge.html", challenge)
    ]
