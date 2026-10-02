// Generated local candidate; paired with 現行フロント互換候補.json.
export const diagnosticDisplayPilot = {
  "normalizationVersion": "diagnostic-common-sentences-v10-all",
  "schemaVersion": "12.0.0-review.1",
  "dataVersion": "2026-09-28",
  "entries": {
    "hokkaido-sapporo-general-solar": {
      "prefecture": "01",
      "municipality": "01100",
      "recordId": "scheme-fdda08946fd2f14d98ec",
      "targetYear": "2026年度",
      "branch": {
        "branch_id": "hokkaido-sapporo-general-solar",
        "diagnostic_rule_ids": [
          "hokkaido-sapporo-general-solar"
        ],
        "target_equipment": [
          "太陽光パネル"
        ],
        "application_start": [
          {
            "branch_id": "second_round",
            "label": "第2回補助申込",
            "date": "2026-09-01"
          }
        ],
        "application_end": [
          {
            "branch_id": "second_round",
            "label": "第2回補助申込",
            "date": "2026-11-04"
          }
        ],
        "application_status": "受付中",
        "amount": {
          "display_text": "太陽光のモジュール合計出力を小数点以下2桁まで切り捨て，1kW当たり2万円．上限13万9,000円，千円未満切捨て．",
          "evidence_status": "confirmed"
        },
        "official_conditions": [
          "出力1.5kW以上．所定の蓄電池又は電気自動車（V2H必須）への接続が必要．新品・固定設備で余剰売電又は全量自家消費．",
          "税抜の対象機器購入・設置費が補助額以下の場合は対象外．国などの他制度との併用は可能．",
          "市税非滞納，同年度1世帯1回．太陽光は札幌市エコエネクラブへの入会が必要．",
          "2026年2月7日以降設置完了．完了届は取得翌日・抽選予定翌日から各90日の遅い方，最終期限2027年2月5日．第2回は予算超過時に抽選．"
        ],
        "gaps": [],
        "evidence_urls": [
          "https://www.city.sapporo.jp/kankyo/energy/hojo/kiki.html",
          "https://www.city.sapporo.jp/kankyo/energy/hojo/qanda.html",
          "https://www.city.sapporo.jp/kankyo/energy/hojo/documents/saiene_pamphlet_2026.pdf"
        ],
        "checked_at": "2026-09-28",
        "display_basis": "retained_reviewed_display",
        "migration_status": "pending_review",
        "legacy_municipal_rule_ids": []
      },
      "catalogAmount": {
        "raw_text": "モジュール合計出力kWを0.01切捨て×20000円，千円未満切捨て，上限139000円．",
        "display_text": "太陽光のモジュール合計出力を小数点以下2桁まで切り捨て，1kW当たり2万円．上限13万9,000円，千円未満切捨て．",
        "evidence_status": "confirmed"
      },
      "rules": [
        {
          "id": "hokkaido-sapporo-general-solar",
          "government_level": "municipality",
          "prefecture_code": "01",
          "municipality_code": "01100",
          "program_name": "2026年度札幌市再エネ省エネ機器導入補助金制度",
          "housing_ages": [
            "existing",
            "new"
          ],
          "equipment_packages": [
            "solar_plus_standard_battery"
          ],
          "application_status": "accepting",
          "diagnostic_scope": {
            "status": "in_scope",
            "in_scope_housing_ages": [
              "existing",
              "new"
            ],
            "excluded_branch_ids": [],
            "basis": "本文・Q&A・R8パンフ2～5頁から原式・併用・共通条件を確認．要領取得Cache miss，原本byte SHA/PDF目視未確認．税抜機器購入設置費が補助額以下なら対象外という費用適格判定はbackend/frontend独立実装検収済み．単純な費用上限へ置換しない． PV単独では既設B/EVを創作せず，PV+B枝として整理する．接続Bは本補助のB要件を満たす必要がある．"
          },
          "expense_scopes": [
            "solar"
          ],
          "conflict_program_ids": [],
          "official_urls": [
            "https://www.city.sapporo.jp/kankyo/energy/hojo/kiki.html",
            "https://www.city.sapporo.jp/kankyo/energy/hojo/qanda.html",
            "https://www.city.sapporo.jp/kankyo/energy/hojo/documents/saiene_pamphlet_2026.pdf"
          ],
          "confirmed_at": "2026-09-28",
          "calculation_assumptions": [
            "1.5kW以上．既設又は新設B又はEV（V2H必須）へ接続．余剰売電又は全量自家消費，北海道電力NW系統連系可，敷地内固定，新品．",
            "2026/2/7以降設置完了．第1回は7/8終了，全件受理．第2回は予算超過時のみ抽選（11/18予定）．完了届期限は取得翌日から90日と抽選予定翌日から90日の遅い方，ただし2027/2/5上限．申込期限と区別． PVは札幌市エコエネクラブ入会． 共通：居住又は期限内転入，市税非滞納，同年度1世帯1回，暴力団等非該当．設備付新築分譲集合住宅は対象外．法定耐用年数内処分は事前承認・返還．",
            "併用不可：国等の他制度との併用は可能（パンフ3頁）．CO2削減効果の他事業登録は取消が必要，電力・ガス会社へ譲渡不可（5頁）．\n上限：PV139000円，B64000円．対象機器の購入・設置費（税抜）が補助額以下の場合は対象外（単純な費用クリップと異なる）．",
            "入力外適格条件・受付残予算及び併用禁止未確認は既承認の充足仮定，公式受給保証ではない．",
            "単一容量入力を各公式容量基準へ対応させる．モジュール/PCS異容量を確認済みとはしない．",
            "対象費は設備ごとのモデル費用．税区分が明記されない枝は税込対応の既承認仮定．"
          ],
          "required_confirmations": [
            "本文・Q&A・R8パンフ2～5頁から原式・併用・共通条件を確認．要領取得Cache miss，原本byte SHA/PDF目視未確認．税抜機器購入設置費が補助額以下なら対象外という費用適格判定はbackend/frontend独立実装検収済み．単純な費用上限へ置換しない． PV単独では既設B/EVを創作せず，PV+B枝として整理する．接続Bは本補助のB要件を満たす必要がある．",
            "申請時の受付・残予算・製品資格・施工条件を別途確認する．"
          ],
          "source_ids": [
            "hokkaido-sapporo-general-solar-source-1",
            "hokkaido-sapporo-general-solar-source-2",
            "hokkaido-sapporo-general-solar-source-3"
          ],
          "confirmed_battery_purchase_cost_min_exclusive_yen": 100000,
          "machine_rule": "kansai_municipal_formula",
          "fit_compatible": true,
          "formula_components": [
            {
              "scope": "solar",
              "equipment_packages": [
                "solar_plus_standard_battery"
              ],
              "formula_type": "capacity_rate",
              "capacity_source": "solar_kw",
              "capacity_preprocessing": "floor_0_01",
              "capacity_cap": null,
              "unit_amount_yen": 20000,
              "cost_scope": "solar",
              "cost_tax": "exclusive",
              "cap_yen": 139000,
              "rounding_unit_yen": 1000,
              "eligible_cost_must_exceed_grant": true,
              "solar_output_min_kw": 1.5,
              "battery_capacity_min_kwh": 2
            }
          ]
        }
      ],
      "institutionalSource": "43dffe045490fd1717a2e2de38997de2357759b5bead62efe3d7b41db995c1b5",
      "sections": [
        {
          "label": "太陽光",
          "text": "太陽光の出力1kWあたり2万円です．",
          "supplement": [
            "（算定対象）出力の基準：モジュール合計出力",
            "（上限）13万9,000円",
            "（端数処理）0.01kW未満切り捨て",
            "（端数処理）1,000円未満切り捨て"
          ]
        }
      ],
      "text": "太陽光の出力1kWあたり2万円です．",
      "supplement": [
        "（算定対象）出力の基準：モジュール合計出力",
        "（上限）13万9,000円",
        "（端数処理）0.01kW未満切り捨て",
        "（端数処理）1,000円未満切り捨て"
      ],
      "commonSupplement": [],
      "equipment": "太陽光のみ"
    },
    "hokkaido-sapporo-general-battery": {
      "prefecture": "01",
      "municipality": "01100",
      "recordId": "scheme-fdda08946fd2f14d98ec",
      "targetYear": "2026年度",
      "branch": {
        "branch_id": "hokkaido-sapporo-general-battery",
        "diagnostic_rule_ids": [
          "hokkaido-sapporo-general-battery"
        ],
        "target_equipment": [
          "蓄電池"
        ],
        "application_start": [
          {
            "branch_id": "second_round",
            "label": "第2回補助申込",
            "date": "2026-09-01"
          }
        ],
        "application_end": [
          {
            "branch_id": "second_round",
            "label": "第2回補助申込",
            "date": "2026-11-04"
          }
        ],
        "application_status": "受付中",
        "amount": {
          "display_text": "蓄電池の定格容量を小数点以下1桁まで切り捨て，1kWh当たり1万6,000円．上限6万4,000円，千円未満切捨て．",
          "evidence_status": "confirmed"
        },
        "official_conditions": [
          "合計出力1.5kW以上の太陽光へ接続．リチウムイオンなどの所定機器で容量2kWh以上，税抜本体購入費1台10万円以上．コンセント充電は不可．",
          "税抜の対象機器購入・設置費が補助額以下の場合は対象外．国などの他制度との併用は可能．",
          "市税非滞納，同年度1世帯1回．2026年2月7日以降設置完了．",
          "完了届は取得翌日・抽選予定翌日から各90日の遅い方，最終期限2027年2月5日．第2回は予算超過時に抽選．"
        ],
        "gaps": [],
        "evidence_urls": [
          "https://www.city.sapporo.jp/kankyo/energy/hojo/kiki.html",
          "https://www.city.sapporo.jp/kankyo/energy/hojo/qanda.html",
          "https://www.city.sapporo.jp/kankyo/energy/hojo/documents/saiene_pamphlet_2026.pdf"
        ],
        "checked_at": "2026-09-28",
        "display_basis": "retained_reviewed_display",
        "migration_status": "pending_review",
        "legacy_municipal_rule_ids": []
      },
      "catalogAmount": {
        "raw_text": "定格容量kWhを0.1切捨て×16000円，千円未満切捨て，上限64000円．",
        "display_text": "蓄電池の定格容量を小数点以下1桁まで切り捨て，1kWh当たり1万6,000円．上限6万4,000円，千円未満切捨て．",
        "evidence_status": "confirmed"
      },
      "rules": [
        {
          "id": "hokkaido-sapporo-general-battery",
          "government_level": "municipality",
          "prefecture_code": "01",
          "municipality_code": "01100",
          "program_name": "2026年度札幌市再エネ省エネ機器導入補助金制度",
          "housing_ages": [
            "existing",
            "new"
          ],
          "equipment_packages": [
            "solar_plus_standard_battery"
          ],
          "application_status": "accepting",
          "diagnostic_scope": {
            "status": "in_scope",
            "in_scope_housing_ages": [
              "existing",
              "new"
            ],
            "excluded_branch_ids": [],
            "basis": "本文・Q&A・R8パンフ2～5頁から原式・併用・共通条件を確認．要領取得Cache miss，原本byte SHA/PDF目視未確認．税抜機器購入設置費が補助額以下なら対象外という費用適格判定はbackend/frontend独立実装検収済み．単純な費用上限へ置換しない．"
          },
          "expense_scopes": [
            "battery"
          ],
          "conflict_program_ids": [],
          "official_urls": [
            "https://www.city.sapporo.jp/kankyo/energy/hojo/kiki.html",
            "https://www.city.sapporo.jp/kankyo/energy/hojo/qanda.html",
            "https://www.city.sapporo.jp/kankyo/energy/hojo/documents/saiene_pamphlet_2026.pdf"
          ],
          "confirmed_at": "2026-09-28",
          "calculation_assumptions": [
            "合計1.5kW以上の既設又は新設PVと接続．リチウムイオン（バインド電池含む），PCS直結・コンセント充電不可，容量2.0kWh以上，本体購入費1台10万円以上税抜．定格容量はQ&A23で明記．",
            "2026/2/7以降設置完了．第1回は7/8終了，全件受理．第2回は予算超過時のみ抽選（11/18予定）．完了届期限は取得翌日から90日と抽選予定翌日から90日の遅い方，ただし2027/2/5上限．申込期限と区別． 共通：居住又は期限内転入，市税非滞納，同年度1世帯1回，暴力団等非該当．設備付新築分譲集合住宅は対象外．法定耐用年数内処分は事前承認・返還．",
            "併用不可：国等の他制度との併用は可能（パンフ3頁）．CO2削減効果の他事業登録は取消が必要，電力・ガス会社へ譲渡不可（5頁）．\n上限：PV139000円，B64000円．対象機器の購入・設置費（税抜）が補助額以下の場合は対象外（単純な費用クリップと異なる）．",
            "入力外適格条件・受付残予算及び併用禁止未確認は既承認の充足仮定，公式受給保証ではない．",
            "単一容量入力を各公式容量基準へ対応させる．モジュール/PCS異容量を確認済みとはしない．",
            "対象費は設備ごとのモデル費用．税区分が明記されない枝は税込対応の既承認仮定．"
          ],
          "required_confirmations": [
            "本文・Q&A・R8パンフ2～5頁から原式・併用・共通条件を確認．要領取得Cache miss，原本byte SHA/PDF目視未確認．税抜機器購入設置費が補助額以下なら対象外という費用適格判定はbackend/frontend独立実装検収済み．単純な費用上限へ置換しない．",
            "申請時の受付・残予算・製品資格・施工条件を別途確認する．"
          ],
          "source_ids": [
            "hokkaido-sapporo-general-battery-source-1",
            "hokkaido-sapporo-general-battery-source-2",
            "hokkaido-sapporo-general-battery-source-3"
          ],
          "confirmed_battery_purchase_cost_min_exclusive_yen": 100000,
          "machine_rule": "kansai_municipal_formula",
          "fit_compatible": true,
          "formula_components": [
            {
              "scope": "battery",
              "equipment_packages": [
                "solar_plus_standard_battery"
              ],
              "formula_type": "capacity_rate",
              "capacity_source": "battery_kwh",
              "capacity_preprocessing": "floor_0_1",
              "capacity_cap": null,
              "unit_amount_yen": 16000,
              "cost_scope": "battery",
              "cost_tax": "exclusive",
              "cap_yen": 64000,
              "rounding_unit_yen": 1000,
              "eligible_cost_must_exceed_grant": true,
              "solar_output_min_kw": 1.5,
              "battery_capacity_min_kwh": 2
            }
          ]
        }
      ],
      "institutionalSource": "b9b200d0057a6868e8e1705115faff714b5438ae5b2a5be2c3cec9a937d6e59d",
      "sections": [
        {
          "label": "蓄電池",
          "text": "蓄電池の容量1kWhあたり1万6,000円です．",
          "supplement": [
            "（算定対象）容量の基準：定格容量",
            "（上限）6万4,000円",
            "（端数処理）0.1kWh未満切り捨て",
            "（端数処理）1,000円未満切り捨て"
          ]
        }
      ],
      "text": "蓄電池の容量1kWhあたり1万6,000円です．",
      "supplement": [
        "（算定対象）容量の基準：定格容量",
        "（上限）6万4,000円",
        "（端数処理）0.1kWh未満切り捨て",
        "（端数処理）1,000円未満切り捨て"
      ],
      "commonSupplement": [],
      "equipment": "蓄電池のみ"
    },
    "hokkaido-hakodate-solar": {
      "prefecture": "01",
      "municipality": "01202",
      "recordId": "scheme-d4e76f747d3caf16551f",
      "targetYear": "2026年度",
      "branch": {
        "branch_id": "hokkaido-hakodate-solar",
        "diagnostic_rule_ids": [
          "hokkaido-hakodate-solar"
        ],
        "target_equipment": [
          "太陽光パネル"
        ],
        "application_start": [
          {
            "branch_id": "current",
            "label": "現行募集",
            "date": "2026-04-01"
          }
        ],
        "application_end": [
          {
            "branch_id": "current",
            "label": "現行募集",
            "date": "2027-03-01"
          }
        ],
        "application_status": "受付中",
        "amount": {
          "display_text": "太陽光の購入・設置対象経費の2分の1，千円未満切捨て，上限5万円です．対象経費の税込・税抜の区分は未確認です．",
          "evidence_status": "partial"
        },
        "official_conditions": [],
        "gaps": [],
        "evidence_urls": [
          "https://www.city.hakodate.hokkaido.jp/docs/2020032700097/",
          "https://www.city.hakodate.hokkaido.jp/docs/2020032700097/file_contents/file_20263253115447_1.pdf",
          "https://www.city.hakodate.hokkaido.jp/docs/2020032700097/file_contents/file_20263253115732_1.pdf",
          "https://www.city.hakodate.hokkaido.jp/docs/2020032700097/file_contents/file_20267131162740_1.pdf"
        ],
        "checked_at": "2026-09-28",
        "display_basis": "preparing",
        "migration_status": "pending_review",
        "legacy_municipal_rule_ids": []
      },
      "catalogAmount": {
        "raw_text": "PV・蓄電池それぞれの購入・設置対象経費×1/2を千円未満切捨て，各上限50,000円．対象費用の税込・税抜区分は未確認．",
        "display_text": "太陽光の購入・設置対象経費の2分の1，千円未満切捨て，上限5万円です．対象経費の税込・税抜の区分は未確認です．",
        "evidence_status": "partial"
      },
      "rules": [
        {
          "id": "hokkaido-hakodate-solar",
          "government_level": "municipality",
          "prefecture_code": "01",
          "municipality_code": "01202",
          "program_name": "令和8年度函館市新エネルギーシステム導入補助金",
          "housing_ages": [
            "existing",
            "new"
          ],
          "equipment_packages": [
            "solar_only",
            "solar_plus_standard_battery"
          ],
          "application_status": "accepting",
          "diagnostic_scope": {
            "status": "in_scope",
            "in_scope_housing_ages": [
              "existing",
              "new"
            ],
            "excluded_branch_ids": [],
            "basis": "公式R8本文・要綱・手引き・QA確認．手引きには子育てグリーンの旧注記，更新QA20ではみらいエコ2026を明示する差分を保持．税区分・残予算は未確認．原本byte SHA/PDF目視未実施．"
          },
          "expense_scopes": [
            "solar"
          ],
          "conflict_program_ids": [],
          "official_urls": [
            "https://www.city.hakodate.hokkaido.jp/docs/2020032700097/",
            "https://www.city.hakodate.hokkaido.jp/docs/2020032700097/file_contents/file_20263253115447_1.pdf",
            "https://www.city.hakodate.hokkaido.jp/docs/2020032700097/file_contents/file_20263253115732_1.pdf",
            "https://www.city.hakodate.hokkaido.jp/docs/2020032700097/file_contents/file_20267131162740_1.pdf"
          ],
          "confirmed_at": "2026-09-28",
          "calculation_assumptions": [
            "新品・非リース．PV：モジュール出力合計を0.01kW切捨て，2kW以上50kW未満，自家消費を主目的，固定設置，同一敷地発電合計50kW未満．B：リチウムイオン又は鉛との接続，PCS等一体，PV又はガスコージェネへ接続，固定式．",
            "自己所有自宅又は新築・取得，年度内居住，実績報告時本人又は同一家族の住民登録．市税未納なし・暴力団等除外．着工2週間前申請，決定前着工・建売引渡し不可，領収日翌日から30日以内報告．",
            "併用不可：同一設備への国・公共団体等の他補助．PV/Bは別設備として各1回可能（QA7）．QA20のみらいエコ新築は当該PV/B費を含まないため併用可能．\n上限：設備別50000円．",
            "入力外適格条件・受付残予算及び併用禁止未確認は既承認の充足仮定，公式受給保証ではない．",
            "単一容量入力を各公式容量基準へ対応させる．モジュール/PCS異容量を確認済みとはしない．",
            "対象費は設備ごとのモデル費用．税区分が明記されない枝は税込対応の既承認仮定．"
          ],
          "required_confirmations": [
            "公式R8本文・要綱・手引き・QA確認．手引きには子育てグリーンの旧注記，更新QA20ではみらいエコ2026を明示する差分を保持．税区分・残予算は未確認．原本byte SHA/PDF目視未実施．",
            "申請時の受付・残予算・製品資格・施工条件を別途確認する．"
          ],
          "source_ids": [
            "hokkaido-hakodate-solar-source-1",
            "hokkaido-hakodate-solar-source-2",
            "hokkaido-hakodate-solar-source-3",
            "hokkaido-hakodate-solar-source-4"
          ],
          "machine_rule": "kansai_municipal_formula",
          "fit_compatible": true,
          "formula_components": [
            {
              "scope": "solar",
              "equipment_packages": [
                "solar_only",
                "solar_plus_standard_battery"
              ],
              "formula_type": "cost_fraction",
              "fraction_numerator": 1,
              "fraction_denominator": 2,
              "cost_scope": "solar",
              "cost_tax": "approved_assumption_inclusive",
              "cap_yen": 50000,
              "rounding_unit_yen": 1000,
              "solar_output_min_kw": 2,
              "solar_output_max_kw_exclusive": 50
            }
          ]
        }
      ],
      "institutionalSource": "24230edae5e34178762e0a9cc7f3decf20b3fb68dea5aa06453ef95ec168b642",
      "sections": [
        {
          "label": "太陽光",
          "text": "太陽光の購入・設置対象経費の2分の1です．",
          "supplement": [
            "（上限）5万円",
            "（端数処理）1,000円未満切り捨て",
            "（未確認事項）対象経費の税込・税抜の区分"
          ]
        }
      ],
      "text": "太陽光の購入・設置対象経費の2分の1です．",
      "supplement": [
        "（上限）5万円",
        "（端数処理）1,000円未満切り捨て",
        "（未確認事項）対象経費の税込・税抜の区分"
      ],
      "commonSupplement": [],
      "equipment": "太陽光のみ"
    },
    "hokkaido-hakodate-battery": {
      "prefecture": "01",
      "municipality": "01202",
      "recordId": "scheme-d4e76f747d3caf16551f",
      "targetYear": "2026年度",
      "branch": {
        "branch_id": "hokkaido-hakodate-battery",
        "diagnostic_rule_ids": [
          "hokkaido-hakodate-battery"
        ],
        "target_equipment": [
          "蓄電池"
        ],
        "application_start": [
          {
            "branch_id": "current",
            "label": "現行募集",
            "date": "2026-04-01"
          }
        ],
        "application_end": [
          {
            "branch_id": "current",
            "label": "現行募集",
            "date": "2027-03-01"
          }
        ],
        "application_status": "受付中",
        "amount": {
          "display_text": "蓄電池の購入・設置対象経費の2分の1，千円未満切捨て，上限5万円です．対象経費の税込・税抜の区分は未確認です．",
          "evidence_status": "partial"
        },
        "official_conditions": [],
        "gaps": [],
        "evidence_urls": [
          "https://www.city.hakodate.hokkaido.jp/docs/2020032700097/",
          "https://www.city.hakodate.hokkaido.jp/docs/2020032700097/file_contents/file_20263253115447_1.pdf",
          "https://www.city.hakodate.hokkaido.jp/docs/2020032700097/file_contents/file_20263253115732_1.pdf",
          "https://www.city.hakodate.hokkaido.jp/docs/2020032700097/file_contents/file_20267131162740_1.pdf"
        ],
        "checked_at": "2026-09-28",
        "display_basis": "preparing",
        "migration_status": "pending_review",
        "legacy_municipal_rule_ids": []
      },
      "catalogAmount": {
        "raw_text": "PV・蓄電池それぞれの購入・設置対象経費×1/2を千円未満切捨て，各上限50,000円．対象費用の税込・税抜区分は未確認．",
        "display_text": "蓄電池の購入・設置対象経費の2分の1，千円未満切捨て，上限5万円です．対象経費の税込・税抜の区分は未確認です．",
        "evidence_status": "partial"
      },
      "rules": [
        {
          "id": "hokkaido-hakodate-battery",
          "government_level": "municipality",
          "prefecture_code": "01",
          "municipality_code": "01202",
          "program_name": "令和8年度函館市新エネルギーシステム導入補助金",
          "housing_ages": [
            "existing",
            "new"
          ],
          "equipment_packages": [
            "solar_plus_standard_battery"
          ],
          "application_status": "accepting",
          "diagnostic_scope": {
            "status": "in_scope",
            "in_scope_housing_ages": [
              "existing",
              "new"
            ],
            "excluded_branch_ids": [],
            "basis": "公式R8本文・要綱・手引き・QA確認．手引きには子育てグリーンの旧注記，更新QA20ではみらいエコ2026を明示する差分を保持．税区分・残予算は未確認．原本byte SHA/PDF目視未実施．"
          },
          "expense_scopes": [
            "battery"
          ],
          "conflict_program_ids": [
            "national-zeh-new-detached-2026-battery",
            "national-mirai-eco-renovation-2026-battery"
          ],
          "official_urls": [
            "https://www.city.hakodate.hokkaido.jp/docs/2020032700097/",
            "https://www.city.hakodate.hokkaido.jp/docs/2020032700097/file_contents/file_20263253115447_1.pdf",
            "https://www.city.hakodate.hokkaido.jp/docs/2020032700097/file_contents/file_20263253115732_1.pdf",
            "https://www.city.hakodate.hokkaido.jp/docs/2020032700097/file_contents/file_20267131162740_1.pdf"
          ],
          "confirmed_at": "2026-09-28",
          "calculation_assumptions": [
            "新品・非リース．PV：モジュール出力合計を0.01kW切捨て，2kW以上50kW未満，自家消費を主目的，固定設置，同一敷地発電合計50kW未満．B：リチウムイオン又は鉛との接続，PCS等一体，PV又はガスコージェネへ接続，固定式．",
            "自己所有自宅又は新築・取得，年度内居住，実績報告時本人又は同一家族の住民登録．市税未納なし・暴力団等除外．着工2週間前申請，決定前着工・建売引渡し不可，領収日翌日から30日以内報告．",
            "併用不可：同一設備への国・公共団体等の他補助．PV/Bは別設備として各1回可能（QA7）．QA20のみらいエコ新築は当該PV/B費を含まないため併用可能．\n上限：設備別50000円．",
            "入力外適格条件・受付残予算及び併用禁止未確認は既承認の充足仮定，公式受給保証ではない．",
            "単一容量入力を各公式容量基準へ対応させる．モジュール/PCS異容量を確認済みとはしない．",
            "対象費は設備ごとのモデル費用．税区分が明記されない枝は税込対応の既承認仮定．"
          ],
          "required_confirmations": [
            "公式R8本文・要綱・手引き・QA確認．手引きには子育てグリーンの旧注記，更新QA20ではみらいエコ2026を明示する差分を保持．税区分・残予算は未確認．原本byte SHA/PDF目視未実施．",
            "申請時の受付・残予算・製品資格・施工条件を別途確認する．"
          ],
          "source_ids": [
            "hokkaido-hakodate-battery-source-1",
            "hokkaido-hakodate-battery-source-2",
            "hokkaido-hakodate-battery-source-3",
            "hokkaido-hakodate-battery-source-4"
          ],
          "machine_rule": "kansai_municipal_formula",
          "fit_compatible": true,
          "formula_components": [
            {
              "scope": "battery",
              "equipment_packages": [
                "solar_plus_standard_battery"
              ],
              "formula_type": "cost_fraction",
              "fraction_numerator": 1,
              "fraction_denominator": 2,
              "cost_scope": "battery",
              "cost_tax": "approved_assumption_inclusive",
              "cap_yen": 50000,
              "rounding_unit_yen": 1000
            }
          ]
        }
      ],
      "institutionalSource": "057fec9c259c3fa40cc2e9f9ae02e428b7564b2a2744b7280b7e6251557467b3",
      "sections": [
        {
          "label": "蓄電池",
          "text": "蓄電池の購入・設置対象経費の2分の1です．",
          "supplement": [
            "（上限）5万円",
            "（端数処理）1,000円未満切り捨て",
            "（未確認事項）対象経費の税込・税抜の区分"
          ]
        }
      ],
      "text": "蓄電池の購入・設置対象経費の2分の1です．",
      "supplement": [
        "（上限）5万円",
        "（端数処理）1,000円未満切り捨て",
        "（未確認事項）対象経費の税込・税抜の区分"
      ],
      "commonSupplement": [],
      "equipment": "蓄電池のみ"
    },
    "hokkaido-abashiri-solar": {
      "prefecture": "01",
      "municipality": "01211",
      "recordId": "scheme-9d71d180b29991959294",
      "targetYear": "2026年度",
      "branch": {
        "branch_id": "hokkaido-abashiri-solar",
        "diagnostic_rule_ids": [
          "hokkaido-abashiri-solar"
        ],
        "target_equipment": [
          "太陽光パネル"
        ],
        "application_start": [
          {
            "branch_id": "r8",
            "label": "申込",
            "date": "2026-04-01"
          }
        ],
        "application_end": [
          {
            "branch_id": "r8",
            "label": "申込",
            "date": "2027-03-31"
          }
        ],
        "application_status": "受付中",
        "amount": {
          "display_text": "太陽光の対象工事費の10％，千円未満切捨て，上限10万円です．申請する対象工事の合計が税込10万円以上であることが必要です．複数の対象工事をまとめて申請できますが，設備ごとの率・上限は別です．補助率を掛ける費用の税込・税抜の区分は未確認です．",
          "evidence_status": "partial"
        },
        "official_conditions": [],
        "gaps": [],
        "evidence_urls": [
          "https://www.city.abashiri.hokkaido.jp/soshiki/19/1514.html",
          "https://www.city.abashiri.hokkaido.jp/uploaded/attachment/14184.pdf"
        ],
        "checked_at": "2026-09-28",
        "display_basis": "preparing",
        "migration_status": "pending_review",
        "legacy_municipal_rule_ids": []
      },
      "catalogAmount": {
        "raw_text": "PV・蓄電池それぞれの対象工事費×10％を千円未満切捨て，各上限100,000円．申請対象工事は合計税込100,000円以上．複数対象工事は合算申請できるが，各設備の率・上限は別．率計算に使う費用の税区分は未確認．",
        "display_text": "太陽光の対象工事費の10％，千円未満切捨て，上限10万円です．申請する対象工事の合計が税込10万円以上であることが必要です．複数の対象工事をまとめて申請できますが，設備ごとの率・上限は別です．補助率を掛ける費用の税込・税抜の区分は未確認です．",
        "evidence_status": "partial"
      },
      "rules": [
        {
          "id": "hokkaido-abashiri-solar",
          "government_level": "municipality",
          "prefecture_code": "01",
          "municipality_code": "01211",
          "program_name": "令和8年度網走市住環境改善資金補助制度（再エネタイプ）",
          "housing_ages": [
            "existing",
            "new"
          ],
          "equipment_packages": [
            "solar_only",
            "solar_plus_standard_battery"
          ],
          "application_status": "accepting",
          "diagnostic_scope": {
            "status": "in_scope",
            "in_scope_housing_ages": [
              "existing",
              "new"
            ],
            "excluded_branch_ids": [],
            "basis": "本人居住所有住宅（同居者申請の例外あり），市内施工者，年度内契約・報告，市税非滞納，暴力団等除外，各分類同一年度・申請者・住戸1回．完工後申請可，着工前後写真必須．税込最低額と費用率算定の税区分を区別し，費用率算定の税区分は公式明記未確認のため既承認の税込対応仮定．容量閾値の記載は確認本文にはなし．原本byte・PDF目視未確認． 最低税込工事10万円はPV単独ならPV費，併設ならPV+B合計費で判定し，各補助額・上限・千円切捨ては設備別．概要書p1申請者要件(3)，p2複数工事合算可を確認．入力外の別工事費は補完しない．"
          },
          "expense_scopes": [
            "solar"
          ],
          "conflict_program_ids": [],
          "official_urls": [
            "https://www.city.abashiri.hokkaido.jp/soshiki/19/1514.html",
            "https://www.city.abashiri.hokkaido.jp/uploaded/attachment/14184.pdf"
          ],
          "confirmed_at": "2026-09-28",
          "calculation_assumptions": [
            "固定の住宅用設備．新築時設置・更新を含み，中古品を除く．",
            "個別条件と確認範囲は根拠・留保欄にも保持する．",
            "併用不可：国・道・市他補助は受給できない場合あり，要相手制度確認．介護等の給付対象工事部分，市リフォーム貸付の償還未了工事部分は対象外．複数対象工事は合算申請可，各設備上限は個別．\n上限：PV100000円，B100000円．",
            "入力外適格条件・受付残予算及び併用禁止未確認は既承認の充足仮定，公式受給保証ではない．",
            "単一容量入力を各公式容量基準へ対応させる．モジュール/PCS異容量を確認済みとはしない．",
            "対象費は設備ごとのモデル費用．税区分が明記されない枝は税込対応の既承認仮定．"
          ],
          "required_confirmations": [
            "本人居住所有住宅（同居者申請の例外あり），市内施工者，年度内契約・報告，市税非滞納，暴力団等除外，各分類同一年度・申請者・住戸1回．完工後申請可，着工前後写真必須．税込最低額と費用率算定の税区分を区別し，費用率算定の税区分は公式明記未確認のため既承認の税込対応仮定．容量閾値の記載は確認本文にはなし．原本byte・PDF目視未確認． 最低税込工事10万円はPV単独ならPV費，併設ならPV+B合計費で判定し，各補助額・上限・千円切捨ては設備別．概要書p1申請者要件(3)，p2複数工事合算可を確認．入力外の別工事費は補完しない．",
            "申請時の受付・残予算・製品資格・施工条件を別途確認する．"
          ],
          "source_ids": [
            "hokkaido-abashiri-solar-source-1",
            "hokkaido-abashiri-solar-source-2"
          ],
          "machine_rule": "kansai_municipal_formula",
          "fit_compatible": true,
          "formula_components": [
            {
              "scope": "solar",
              "equipment_packages": [
                "solar_only"
              ],
              "formula_type": "cost_fraction",
              "fraction_numerator": 1,
              "fraction_denominator": 10,
              "cost_scope": "solar",
              "cost_tax": "approved_assumption_inclusive",
              "cap_yen": 100000,
              "rounding_unit_yen": 1000,
              "eligible_cost_min_yen": 100000,
              "eligible_cost_min_scope": "solar"
            },
            {
              "scope": "solar",
              "equipment_packages": [
                "solar_plus_standard_battery"
              ],
              "formula_type": "cost_fraction",
              "fraction_numerator": 1,
              "fraction_denominator": 10,
              "cost_scope": "solar",
              "cost_tax": "approved_assumption_inclusive",
              "cap_yen": 100000,
              "rounding_unit_yen": 1000,
              "eligible_cost_min_yen": 100000,
              "eligible_cost_min_scope": "combined"
            }
          ]
        }
      ],
      "institutionalSource": "cdd5e2f15a71377b2a64bbbf880f8f95dbd8443b1c6150795e491ee088988374",
      "sections": [
        {
          "label": "太陽光",
          "text": "太陽光の対象工事費の10分の1です．",
          "supplement": [
            "（上限）10万円",
            "（端数処理）1,000円未満切り捨て"
          ]
        }
      ],
      "text": "太陽光の対象工事費の10分の1です．",
      "supplement": [
        "（上限）10万円",
        "（端数処理）1,000円未満切り捨て"
      ],
      "commonSupplement": [
        "（未確認事項）補助率を掛ける費用の税込・税抜の区分"
      ],
      "equipment": "太陽光",
      "savedSourceDetails": true
    },
    "hokkaido-abashiri-battery": {
      "prefecture": "01",
      "municipality": "01211",
      "recordId": "scheme-9d71d180b29991959294",
      "targetYear": "2026年度",
      "branch": {
        "branch_id": "hokkaido-abashiri-battery",
        "diagnostic_rule_ids": [
          "hokkaido-abashiri-battery"
        ],
        "target_equipment": [
          "蓄電池"
        ],
        "application_start": [
          {
            "branch_id": "r8",
            "label": "申込",
            "date": "2026-04-01"
          }
        ],
        "application_end": [
          {
            "branch_id": "r8",
            "label": "申込",
            "date": "2027-03-31"
          }
        ],
        "application_status": "受付中",
        "amount": {
          "display_text": "蓄電池の対象工事費の10％，千円未満切捨て，上限10万円です．申請する対象工事の合計が税込10万円以上であることが必要です．複数の対象工事をまとめて申請できますが，設備ごとの率・上限は別です．補助率を掛ける費用の税込・税抜の区分は未確認です．",
          "evidence_status": "partial"
        },
        "official_conditions": [],
        "gaps": [],
        "evidence_urls": [
          "https://www.city.abashiri.hokkaido.jp/soshiki/19/1514.html",
          "https://www.city.abashiri.hokkaido.jp/uploaded/attachment/14184.pdf"
        ],
        "checked_at": "2026-09-28",
        "display_basis": "preparing",
        "migration_status": "pending_review",
        "legacy_municipal_rule_ids": []
      },
      "catalogAmount": {
        "raw_text": "PV・蓄電池それぞれの対象工事費×10％を千円未満切捨て，各上限100,000円．申請対象工事は合計税込100,000円以上．複数対象工事は合算申請できるが，各設備の率・上限は別．率計算に使う費用の税区分は未確認．",
        "display_text": "蓄電池の対象工事費の10％，千円未満切捨て，上限10万円です．申請する対象工事の合計が税込10万円以上であることが必要です．複数の対象工事をまとめて申請できますが，設備ごとの率・上限は別です．補助率を掛ける費用の税込・税抜の区分は未確認です．",
        "evidence_status": "partial"
      },
      "rules": [
        {
          "id": "hokkaido-abashiri-battery",
          "government_level": "municipality",
          "prefecture_code": "01",
          "municipality_code": "01211",
          "program_name": "令和8年度網走市住環境改善資金補助制度（再エネタイプ）",
          "housing_ages": [
            "existing",
            "new"
          ],
          "equipment_packages": [
            "solar_plus_standard_battery"
          ],
          "application_status": "accepting",
          "diagnostic_scope": {
            "status": "in_scope",
            "in_scope_housing_ages": [
              "existing",
              "new"
            ],
            "excluded_branch_ids": [],
            "basis": "本人居住所有住宅（同居者申請の例外あり），市内施工者，年度内契約・報告，市税非滞納，暴力団等除外，各分類同一年度・申請者・住戸1回．完工後申請可，着工前後写真必須．税込最低額と費用率算定の税区分を区別し，費用率算定の税区分は公式明記未確認のため既承認の税込対応仮定．容量閾値の記載は確認本文にはなし．原本byte・PDF目視未確認． 最低税込工事10万円はPV単独ならPV費，併設ならPV+B合計費で判定し，各補助額・上限・千円切捨ては設備別．概要書p1申請者要件(3)，p2複数工事合算可を確認．入力外の別工事費は補完しない．"
          },
          "expense_scopes": [
            "battery"
          ],
          "conflict_program_ids": [],
          "official_urls": [
            "https://www.city.abashiri.hokkaido.jp/soshiki/19/1514.html",
            "https://www.city.abashiri.hokkaido.jp/uploaded/attachment/14184.pdf"
          ],
          "confirmed_at": "2026-09-28",
          "calculation_assumptions": [
            "固定の住宅用設備．新築時設置・更新を含み，中古品を除く．",
            "個別条件と確認範囲は根拠・留保欄にも保持する．",
            "併用不可：国・道・市他補助は受給できない場合あり，要相手制度確認．介護等の給付対象工事部分，市リフォーム貸付の償還未了工事部分は対象外．複数対象工事は合算申請可，各設備上限は個別．\n上限：PV100000円，B100000円．",
            "入力外適格条件・受付残予算及び併用禁止未確認は既承認の充足仮定，公式受給保証ではない．",
            "単一容量入力を各公式容量基準へ対応させる．モジュール/PCS異容量を確認済みとはしない．",
            "対象費は設備ごとのモデル費用．税区分が明記されない枝は税込対応の既承認仮定．"
          ],
          "required_confirmations": [
            "本人居住所有住宅（同居者申請の例外あり），市内施工者，年度内契約・報告，市税非滞納，暴力団等除外，各分類同一年度・申請者・住戸1回．完工後申請可，着工前後写真必須．税込最低額と費用率算定の税区分を区別し，費用率算定の税区分は公式明記未確認のため既承認の税込対応仮定．容量閾値の記載は確認本文にはなし．原本byte・PDF目視未確認． 最低税込工事10万円はPV単独ならPV費，併設ならPV+B合計費で判定し，各補助額・上限・千円切捨ては設備別．概要書p1申請者要件(3)，p2複数工事合算可を確認．入力外の別工事費は補完しない．",
            "申請時の受付・残予算・製品資格・施工条件を別途確認する．"
          ],
          "source_ids": [
            "hokkaido-abashiri-battery-source-1",
            "hokkaido-abashiri-battery-source-2"
          ],
          "machine_rule": "kansai_municipal_formula",
          "fit_compatible": true,
          "formula_components": [
            {
              "scope": "battery",
              "equipment_packages": [
                "solar_plus_standard_battery"
              ],
              "formula_type": "cost_fraction",
              "fraction_numerator": 1,
              "fraction_denominator": 10,
              "cost_scope": "battery",
              "cost_tax": "approved_assumption_inclusive",
              "cap_yen": 100000,
              "rounding_unit_yen": 1000,
              "eligible_cost_min_yen": 100000,
              "eligible_cost_min_scope": "combined"
            }
          ]
        }
      ],
      "institutionalSource": "a09b7143a22c120d7b3183e141236405d5dc255051a56c66d7bf163c4c15a93f",
      "sections": [
        {
          "label": "蓄電池",
          "text": "蓄電池の対象工事費の10分の1です．",
          "supplement": [
            "（上限）10万円",
            "（端数処理）1,000円未満切り捨て"
          ]
        }
      ],
      "text": "蓄電池の対象工事費の10分の1です．",
      "supplement": [
        "（上限）10万円",
        "（端数処理）1,000円未満切り捨て"
      ],
      "commonSupplement": [
        "（未確認事項）補助率を掛ける費用の税込・税抜の区分"
      ],
      "equipment": "蓄電池",
      "savedSourceDetails": true
    },
    "hokkaido-kitahiroshima-solar": {
      "prefecture": "01",
      "municipality": "01234",
      "recordId": "scheme-8e35e5d0896f4d8a4d90",
      "targetYear": "2026年度",
      "branch": {
        "branch_id": "hokkaido-kitahiroshima-solar",
        "diagnostic_rule_ids": [
          "hokkaido-kitahiroshima-solar"
        ],
        "target_equipment": [
          "太陽光パネル"
        ],
        "application_start": [
          {
            "branch_id": "r8",
            "label": "令和8年度申込",
            "date": "2026-04-01"
          }
        ],
        "application_end": [
          {
            "branch_id": "r8",
            "label": "令和8年度申込",
            "date": "2026-07-31"
          }
        ],
        "application_status": "受付対象外",
        "amount": {
          "display_text": "太陽電池モジュールの最大出力1kW当たり1万円，上限3万円です．出力と金額の端数処理は未確認です．",
          "evidence_status": "partial"
        },
        "official_conditions": [],
        "gaps": [],
        "evidence_urls": [
          "https://www.city.kitahiroshima.hokkaido.jp/hotnews/detail/00145684.html",
          "https://www.city.kitahiroshima.hokkaido.jp/hotnews/files/00145600/00145684/shinnseinotebiki0804.pdf"
        ],
        "checked_at": "2026-09-28",
        "display_basis": "preparing",
        "migration_status": "pending_review",
        "legacy_municipal_rule_ids": []
      },
      "catalogAmount": {
        "raw_text": "モジュール最大出力kW×10,000円，上限30,000円．出力及び金額の端数処理は未確認．",
        "display_text": "太陽電池モジュールの最大出力1kW当たり1万円，上限3万円です．出力と金額の端数処理は未確認です．",
        "evidence_status": "partial"
      },
      "rules": [
        {
          "id": "hokkaido-kitahiroshima-solar",
          "government_level": "municipality",
          "prefecture_code": "01",
          "municipality_code": "01234",
          "program_name": "令和8年度住宅用再生可能エネルギー及び省エネルギー機器設置補助金",
          "housing_ages": [
            "existing",
            "new"
          ],
          "equipment_packages": [
            "solar_only",
            "solar_plus_standard_battery"
          ],
          "application_status": "closed",
          "diagnostic_scope": {
            "status": "in_scope",
            "in_scope_housing_ages": [
              "existing",
              "new"
            ],
            "excluded_branch_ids": [],
            "basis": "現行公式の募集終了確認により非算入．手引きの追加募集可能性だけで復活しない．制度ルール不明：PV丸め・費用税区分・B容量定義を別留保．PDF原本・画像検証及び市全体探索未完了．"
          },
          "expense_scopes": [
            "solar",
            "battery"
          ],
          "conflict_program_ids": [],
          "official_urls": [
            "https://www.city.kitahiroshima.hokkaido.jp/hotnews/detail/00145684.html",
            "https://www.city.kitahiroshima.hokkaido.jp/hotnews/files/00145600/00145684/shinnseinotebiki0804.pdf"
          ],
          "confirmed_at": "2026-09-28",
          "calculation_assumptions": [
            "本人居住又は居住予定，所有者が異なる場合承諾必要，市町村税非滞納．",
            "新品PV，min(モジュール公称最大出力,PCS定格出力)<10kW，低圧逆潮流，JIS相当．対象費は列挙機器．",
            "8/31掲載公式で募集終了．3/31以前着工又は建売引渡除外．翌3/9まで設置と申請兼報告．抽選前設置は当選後30日，抽選後設置は設置後30日又は3/9の早い日．手引き図の当選後30日との表現差は留保．",
            "併用不可：PV・B同時申請可，国道禁止明示未確認．\n上限：PV30000円，B50000円．"
          ],
          "required_confirmations": [
            "現行公式の募集終了確認により非算入．手引きの追加募集可能性だけで復活しない．制度ルール不明：PV丸め・費用税区分・B容量定義を別留保．PDF原本・画像検証及び市全体探索未完了．",
            "申請時の受付・残予算・製品資格・施工条件を別途確認する．"
          ],
          "source_ids": [
            "hokkaido-kitahiroshima-solar-source-1",
            "hokkaido-kitahiroshima-solar-source-2"
          ],
          "machine_rule": "kansai_municipal_non_adopted",
          "non_adoption_status": "excluded",
          "non_adoption_reason_code": "application_closed"
        }
      ],
      "institutionalSource": "8e970c0bf56fe7d1f89d39c6e6bf896c09be0424e253b464318a738f35299c54",
      "sections": [
        {
          "label": "太陽光",
          "text": "太陽光の出力1kWあたり1万円です．",
          "supplement": [
            "（算定対象）出力の基準：太陽電池モジュールの最大出力",
            "（上限）3万円",
            "（未確認事項）出力と金額の端数処理"
          ]
        }
      ],
      "text": "太陽光の出力1kWあたり1万円です．",
      "supplement": [
        "（算定対象）出力の基準：太陽電池モジュールの最大出力",
        "（上限）3万円",
        "（未確認事項）出力と金額の端数処理"
      ],
      "commonSupplement": [],
      "equipment": "太陽光のみ"
    },
    "hokkaido-kitahiroshima-battery": {
      "prefecture": "01",
      "municipality": "01234",
      "recordId": "scheme-8e35e5d0896f4d8a4d90",
      "targetYear": "2026年度",
      "branch": {
        "branch_id": "hokkaido-kitahiroshima-battery",
        "diagnostic_rule_ids": [
          "hokkaido-kitahiroshima-battery"
        ],
        "target_equipment": [
          "蓄電池"
        ],
        "application_start": [
          {
            "branch_id": "r8",
            "label": "令和8年度申込",
            "date": "2026-04-01"
          }
        ],
        "application_end": [
          {
            "branch_id": "r8",
            "label": "令和8年度申込",
            "date": "2026-07-31"
          }
        ],
        "application_status": "受付対象外",
        "amount": {
          "display_text": "定置用蓄電池は5万円です．",
          "evidence_status": "partial"
        },
        "official_conditions": [],
        "gaps": [],
        "evidence_urls": [
          "https://www.city.kitahiroshima.hokkaido.jp/hotnews/detail/00145684.html",
          "https://www.city.kitahiroshima.hokkaido.jp/hotnews/files/00145600/00145684/shinnseinotebiki0804.pdf"
        ],
        "checked_at": "2026-09-28",
        "display_basis": "preparing",
        "migration_status": "pending_review",
        "legacy_municipal_rule_ids": []
      },
      "catalogAmount": {
        "raw_text": "定置用蓄電池は50,000円．",
        "display_text": "定置用蓄電池は5万円です．",
        "evidence_status": "partial"
      },
      "rules": [
        {
          "id": "hokkaido-kitahiroshima-battery",
          "government_level": "municipality",
          "prefecture_code": "01",
          "municipality_code": "01234",
          "program_name": "令和8年度住宅用再生可能エネルギー及び省エネルギー機器設置補助金",
          "housing_ages": [
            "existing",
            "new"
          ],
          "equipment_packages": [
            "solar_plus_standard_battery"
          ],
          "application_status": "closed",
          "diagnostic_scope": {
            "status": "in_scope",
            "in_scope_housing_ages": [
              "existing",
              "new"
            ],
            "excluded_branch_ids": [],
            "basis": "現行公式の募集終了確認により非算入．手引きの追加募集可能性だけで復活しない．制度ルール不明：PV丸め・費用税区分・B容量定義を別留保．PDF原本・画像検証及び市全体探索未完了．"
          },
          "expense_scopes": [
            "solar",
            "battery"
          ],
          "conflict_program_ids": [],
          "official_urls": [
            "https://www.city.kitahiroshima.hokkaido.jp/hotnews/detail/00145684.html",
            "https://www.city.kitahiroshima.hokkaido.jp/hotnews/files/00145600/00145684/shinnseinotebiki0804.pdf"
          ],
          "confirmed_at": "2026-09-28",
          "calculation_assumptions": [
            "本人居住又は居住予定，所有者が異なる場合承諾必要，市町村税非滞納．",
            "新品Li-ion，PV常時接続，容量合計2kWh以上（定格/実効未確認），メーカー指定環境，本体のみ対象費．",
            "8/31掲載公式で募集終了．3/31以前着工又は建売引渡除外．翌3/9まで設置と申請兼報告．抽選前設置は当選後30日，抽選後設置は設置後30日又は3/9の早い日．手引き図の当選後30日との表現差は留保．",
            "併用不可：PV・B同時申請可，国道禁止明示未確認．\n上限：PV30000円，B50000円．"
          ],
          "required_confirmations": [
            "現行公式の募集終了確認により非算入．手引きの追加募集可能性だけで復活しない．制度ルール不明：PV丸め・費用税区分・B容量定義を別留保．PDF原本・画像検証及び市全体探索未完了．",
            "申請時の受付・残予算・製品資格・施工条件を別途確認する．"
          ],
          "source_ids": [
            "hokkaido-kitahiroshima-battery-source-1",
            "hokkaido-kitahiroshima-battery-source-2"
          ],
          "machine_rule": "kansai_municipal_non_adopted",
          "non_adoption_status": "excluded",
          "non_adoption_reason_code": "application_closed"
        }
      ],
      "institutionalSource": "34a8ddc32cc1297f2e0429ffbcd3ca80f2842f94019576a0da7f803e1020a035",
      "sections": [
        {
          "label": "蓄電池",
          "text": "5万円です．",
          "supplement": [
            "（適用条件）対象設備：定置用蓄電池"
          ]
        }
      ],
      "text": "5万円です．",
      "supplement": [
        "（適用条件）対象設備：定置用蓄電池"
      ],
      "commonSupplement": [],
      "equipment": "蓄電池のみ"
    },
    "hokkaido-hokuto-solar": {
      "prefecture": "01",
      "municipality": "01236",
      "recordId": "scheme-1cadc9de5a22c44ae703",
      "targetYear": "2026年度",
      "branch": {
        "branch_id": "hokkaido-hokuto-solar",
        "diagnostic_rule_ids": [
          "hokkaido-hokuto-solar"
        ],
        "target_equipment": [
          "太陽光パネル"
        ],
        "application_start": [
          {
            "branch_id": "r8",
            "label": "令和8年度申請",
            "date": "2026-04-01"
          }
        ],
        "application_end": [
          {
            "branch_id": "r8",
            "label": "令和8年度申請",
            "date": "2027-01-31"
          }
        ],
        "application_status": "受付中",
        "amount": {
          "display_text": "太陽電池モジュールの公称最大出力合計を0.01kW未満で切り捨て，最大5kWを算定対象として1kW当たり2万円を掛けます．補助額は千円未満切捨てです．",
          "evidence_status": "partial"
        },
        "official_conditions": [],
        "gaps": [],
        "evidence_urls": [
          "https://www.city.hokuto.hokkaido.jp/docs/995.html",
          "https://www.city.hokuto.hokkaido.jp/reiki_int/reiki_honbun/r297RG00000703.html"
        ],
        "checked_at": "2026-09-28",
        "display_basis": "preparing",
        "migration_status": "pending_review",
        "legacy_municipal_rule_ids": []
      },
      "catalogAmount": {
        "raw_text": "太陽電池モジュール公称最大出力合計を0.01kW未満切捨て，5kWを上限に20,000円/kWを乗じ，金額を千円未満切捨て．",
        "display_text": "太陽電池モジュールの公称最大出力合計を0.01kW未満で切り捨て，最大5kWを算定対象として1kW当たり2万円を掛けます．補助額は千円未満切捨てです．",
        "evidence_status": "partial"
      },
      "rules": [
        {
          "id": "hokkaido-hokuto-solar",
          "government_level": "municipality",
          "prefecture_code": "01",
          "municipality_code": "01236",
          "program_name": "令和8年度住宅用太陽光発電システム等設置補助金",
          "housing_ages": [
            "existing",
            "new"
          ],
          "equipment_packages": [
            "solar_only",
            "solar_plus_standard_battery"
          ],
          "application_status": "accepting",
          "diagnostic_scope": {
            "status": "in_scope",
            "in_scope_housing_ages": [
              "existing",
              "new"
            ],
            "excluded_branch_ids": [],
            "basis": "R8年4月1日施行例規3条・5条とR8募集本文を確認．PV対象費は設備及び施工費．B設置をPV必須条件としない．モジュール/PCS異容量は単一入力対応の既承認仮定と区別．PDF視覚確認未実施，市全体探索未完了．"
          },
          "expense_scopes": [
            "solar"
          ],
          "conflict_program_ids": [],
          "official_urls": [
            "https://www.city.hokuto.hokkaido.jp/docs/995.html",
            "https://www.city.hokuto.hokkaido.jp/reiki_int/reiki_honbun/r297RG00000703.html"
          ],
          "confirmed_at": "2026-09-28",
          "calculation_assumptions": [
            "本人所有居住・完了報告までの転入予定可，市町村税非滞納，法人除外．",
            "新品PV及びPCS，モジュール出力（0.01未満切捨て）又はPCS定格合計のいずれかが10kW未満．低圧余剰逆潮流，JIS/IEC相当，メーカー保証・サポート，発電量計測記録．",
            "着工前申請．R8年4月〜R9年1月末設置．完了から30日又はR9年2月末の早い日まで報告．法定耐用年数内処分には承認．",
            "併用不可：取得範囲に国・道補助の併用禁止明示は未確認．\n上限：PV10万円，B15万円．",
            "入力外適格条件・受付残予算及び併用禁止未確認は既承認の充足仮定，公式受給保証ではない．",
            "単一容量入力を各公式容量基準へ対応させる．モジュール/PCS異容量を確認済みとはしない．",
            "対象費は設備ごとのモデル費用．税区分が明記されない枝は税込対応の既承認仮定．"
          ],
          "required_confirmations": [
            "R8年4月1日施行例規3条・5条とR8募集本文を確認．PV対象費は設備及び施工費．B設置をPV必須条件としない．モジュール/PCS異容量は単一入力対応の既承認仮定と区別．PDF視覚確認未実施，市全体探索未完了．",
            "申請時の受付・残予算・製品資格・施工条件を別途確認する．"
          ],
          "source_ids": [
            "hokkaido-hokuto-solar-source-1",
            "hokkaido-hokuto-solar-source-2"
          ],
          "machine_rule": "kansai_municipal_formula",
          "fit_compatible": true,
          "formula_components": [
            {
              "scope": "solar",
              "equipment_packages": [
                "solar_only",
                "solar_plus_standard_battery"
              ],
              "formula_type": "capacity_rate",
              "capacity_source": "solar_kw",
              "capacity_preprocessing": "floor_0_01",
              "capacity_cap": 5,
              "unit_amount_yen": 20000,
              "cost_scope": "solar",
              "cost_tax": "approved_assumption_inclusive",
              "cap_yen": 100000,
              "rounding_unit_yen": 1000,
              "solar_output_max_kw_exclusive": 10
            }
          ]
        }
      ],
      "institutionalSource": "93b70ae5248048ab2102a543dd5494b2addbeb8ecfa22a6dde69e9f95c1db0b0",
      "sections": [
        {
          "label": "太陽光",
          "text": "太陽光の出力1kWあたり2万円です．",
          "supplement": [
            "（算定対象）出力の基準：太陽電池モジュールの公称最大出力合計",
            "（算定対象）出力：最大5kW",
            "（端数処理）出力（算定前）：0.01kW未満切り捨て"
          ]
        }
      ],
      "text": "太陽光の出力1kWあたり2万円です．",
      "supplement": [
        "（算定対象）出力の基準：太陽電池モジュールの公称最大出力合計",
        "（算定対象）出力：最大5kW",
        "（端数処理）出力（算定前）：0.01kW未満切り捨て"
      ],
      "commonSupplement": [
        "（端数処理）1,000円未満切り捨て"
      ],
      "equipment": "太陽光",
      "savedSourceDetails": true
    },
    "hokkaido-mori-solar": {
      "prefecture": "01",
      "municipality": "01345",
      "recordId": "scheme-b21c27281f70f6ec9e05",
      "targetYear": "2026年度",
      "branch": {
        "branch_id": "hokkaido-mori-solar",
        "diagnostic_rule_ids": [
          "hokkaido-mori-solar"
        ],
        "target_equipment": [
          "太陽光パネル"
        ],
        "application_start": [
          {
            "branch_id": "mori_solar",
            "label": "令和8年度申請",
            "date": "2026-04-01"
          }
        ],
        "application_end": [
          {
            "branch_id": "mori_solar",
            "label": "令和8年度申請",
            "date": "2026-11-13"
          }
        ],
        "application_status": "受付中",
        "amount": {
          "display_text": "太陽光：太陽光の出力1kWあたり5万円です．\n（出力基準）適用条件・補助額の算定に使用：モジュール公称最大出力\n（対象出力範囲）適用条件・補助額の算定に使用：10kW未満\n（算定対象）出力：最大3kW\n（適用条件）導入方法：新設\n（上限）15万円\n（端数処理）最終補助額：1,000円未満切り捨て\n（未確認事項）太陽光の対象費用の税込・税抜の区分",
          "evidence_status": "confirmed",
          "summary_text": "太陽光：太陽光の出力1kWあたり5万円です．"
        },
        "official_conditions": [
          "①森町内に住んでいる方または森町内に転入してくる方で、自ら居住する既築または\n新築の住宅に、新たに住宅用太陽光発電システムを設置しようとする方。（店舗兼\n用住宅を含みます。）\n②町の補助金交付決定後に工事を行い、令和９年２月末までに設置完了できる方。\n③借地・借家の場合、当該土地建物の所有者の承諾を得ている方。\n④本人及び同居家族に町税等の滞納のない方。\n⑤設置後１年間発電量などのデータを提出できる方。\n⑥過去に本補助金の交付を受けていない方。",
          "（交付決定前に工事を着工しないでください）",
          "この補助金を受けた方は、設置後１年間発電量についての状況を報告していただきま\nす。（電力会社の売電買電検針票・電気料金のお知らせの電力量でも記入できるので設\n置後１年間は破棄しないようにして下さい。）\n８．発電システムの維持管理について\nこの補助金を受けた方は、発電システム等を法定耐用年数期間（発電システム１７\n年・定置用蓄電池６年）適切に維持管理しなければなりません。",
          "①未使用品のもの。（新品のもの）\n②低圧配電線と逆潮流有りで連系し、電力会社と電力受給契約を結ぶもの。（自家使\n用を超える余剰電力を電力会社に売電する事ができるシステムのもの）\n③太陽電池モジュールの最大出力が１０ｋＷ未満のもの。\n④発電量を記録できる装置（モニター等）が設置されているもの。"
        ],
        "gaps": [],
        "evidence_urls": [
          "https://www.town.hokkaido-mori.lg.jp/gyoseijoho/seisaku-keikaku/2/1722.html",
          "https://www.town.hokkaido-mori.lg.jp/material/files/group/5/R8shinseinotebiki.pdf"
        ],
        "checked_at": "2026-09-28",
        "display_basis": "preparing",
        "migration_status": "pending_review",
        "legacy_municipal_rule_ids": [],
        "branch_label": "太陽光の設置"
      },
      "catalogAmount": {
        "raw_text": "PVはモジュール公称最大出力×50,000円/kW，3kW・150,000円を上限とし千円未満切捨て．PVと同時設置する定置用蓄電池は50,000円．",
        "display_text": "太陽光はモジュール公称最大出力1kW当たり5万円，算定対象は最大3kW，上限15万円，千円未満切捨てです．太陽光と同時に設置する定置用蓄電池は5万円です．",
        "evidence_status": "partial"
      },
      "rules": [
        {
          "id": "hokkaido-mori-solar",
          "government_level": "municipality",
          "prefecture_code": "01",
          "municipality_code": "01345",
          "program_name": "令和8年度住宅用太陽光発電システム設置補助金",
          "housing_ages": [
            "existing",
            "new"
          ],
          "equipment_packages": [
            "solar_only",
            "solar_plus_standard_battery"
          ],
          "application_status": "accepting",
          "diagnostic_scope": {
            "status": "in_scope",
            "in_scope_housing_ages": [
              "existing",
              "new"
            ],
            "excluded_branch_ids": [],
            "basis": "PV原式・千円未満切捨ては手引きp2確認． 公式本文とR8手引き4頁テキストを確認．税区分・併用・残予算，原本byte SHA/PDF目視未確認．町全体探索未完了．"
          },
          "expense_scopes": [
            "solar"
          ],
          "conflict_program_ids": [],
          "official_urls": [
            "https://www.town.hokkaido-mori.lg.jp/gyoseijoho/seisaku-keikaku/2/1722.html",
            "https://www.town.hokkaido-mori.lg.jp/material/files/group/5/R8shinseinotebiki.pdf"
          ],
          "confirmed_at": "2026-09-28",
          "calculation_assumptions": [
            "新築・既存住宅，店舗兼用住宅を含む．",
            "町内居住又は転入予定，本人及び同居家族の町税等非滞納，過去本補助未受給．",
            "PV新品・モジュール10kW未満・低圧逆潮流余剰売電・発電記録装置．B同時PV常時接続，新品，JIS又は電池工業会規格，容量1kWh以上，メーカー指定環境．",
            "新築既存・本人居住/転入予定・借家所有者承諾，PV新品低圧余剰売電・モジュール10kW未満，B同時設置・PV常時接続・JIS又は電池工業会・容量1kWh以上・新品．4/1～11/13申請，交付決定後工事，翌2月末完了報告．同居家族税非滞納・過去町補助未受給・1年間発電報告． 出力等変更は事前承認．PV17年/B6年維持管理．",
            "併用不可：他補助との併用明示は確認本文では未確認．過去の本町補助受給者は除外．\n上限：PV15万円，PV同時B5万円．",
            "入力外適格条件・受付残予算及び併用禁止未確認は既承認の充足仮定，公式受給保証ではない．",
            "単一容量入力を各公式容量基準へ対応させる．モジュール/PCS異容量を確認済みとはしない．",
            "対象費は設備ごとのモデル費用．税区分が明記されない枝は税込対応の既承認仮定．"
          ],
          "required_confirmations": [
            "PV原式・千円未満切捨ては手引きp2確認． 公式本文とR8手引き4頁テキストを確認．税区分・併用・残予算，原本byte SHA/PDF目視未確認．町全体探索未完了．",
            "申請時の受付・残予算・製品資格・施工条件を別途確認する．"
          ],
          "source_ids": [
            "hokkaido-mori-solar-source-1",
            "hokkaido-mori-solar-source-2"
          ],
          "machine_rule": "kansai_municipal_formula",
          "fit_compatible": true,
          "formula_components": [
            {
              "scope": "solar",
              "equipment_packages": [
                "solar_only",
                "solar_plus_standard_battery"
              ],
              "formula_type": "capacity_rate",
              "capacity_source": "solar_kw",
              "capacity_preprocessing": "none",
              "capacity_cap": 3,
              "unit_amount_yen": 50000,
              "cost_scope": "solar",
              "cost_tax": "approved_assumption_inclusive",
              "cap_yen": 150000,
              "rounding_unit_yen": 1000,
              "solar_output_max_kw_exclusive": 10
            }
          ]
        }
      ],
      "sections": [
        {
          "label": "太陽光",
          "text": "太陽光の出力1kWあたり5万円です．",
          "supplement": [
            "（出力基準）適用条件・補助額の算定に使用：モジュール公称最大出力",
            "（対象出力範囲）適用条件・補助額の算定に使用：10kW未満",
            "（算定対象）出力：最大3kW",
            "（適用条件）導入方法：新設",
            "（上限）15万円",
            "（端数処理）最終補助額：1,000円未満切り捨て",
            "（未確認事項）太陽光の対象費用の税込・税抜の区分"
          ]
        }
      ],
      "text": "太陽光の出力1kWあたり5万円です．",
      "supplement": [
        "（出力基準）適用条件・補助額の算定に使用：モジュール公称最大出力",
        "（対象出力範囲）適用条件・補助額の算定に使用：10kW未満",
        "（算定対象）出力：最大3kW",
        "（適用条件）導入方法：新設",
        "（上限）15万円",
        "（端数処理）最終補助額：1,000円未満切り捨て",
        "（未確認事項）太陽光の対象費用の税込・税抜の区分"
      ],
      "commonSupplement": [
        "（適用条件）製品：未使用の太陽光発電設備が対象です．",
        "（適用条件）接続・売電：低圧配電線に逆潮流ありで連系し，電力会社と電力受給契約を結び，余剰電力を売電できる設備が対象です．",
        "（適用条件）計測：発電量を記録できるモニター等が必要です．",
        "（適用条件）居住・住宅：森町内に居住又は転入予定で，自ら住む既存・新築住宅に，新たに住宅用太陽光発電設備を設置します．店舗併用住宅を含みます．",
        "（適用条件）着工・完了：交付決定後に着工し，2027年2月末までに設置を完了します．",
        "（適用条件）所有者承諾：借地・借家では，土地・建物所有者の承諾が必要です．",
        "（適用条件）税滞納：本人・同居家族に町税等の滞納がないことが必要です．",
        "（適用条件）利用履歴：過去に本補助金を受けていないことが必要です．",
        "（適用条件）報告：設置後1年間の発電量等のデータを提出します．"
      ],
      "equipment": "太陽光",
      "conditionDisplayComplete": true,
      "conditionDisplayVersion": "shared-conditions-mori-2026-10-02.1"
    },
    "hokkaido-mori-battery": {
      "prefecture": "01",
      "municipality": "01345",
      "recordId": "scheme-b21c27281f70f6ec9e05",
      "targetYear": "2026年度",
      "branch": {
        "branch_id": "hokkaido-mori-battery",
        "diagnostic_rule_ids": [
          "hokkaido-next-mori-battery"
        ],
        "target_equipment": [
          "蓄電池"
        ],
        "application_start": [
          {
            "branch_id": "mori_battery",
            "label": "令和8年度申請",
            "date": "2026-04-01"
          }
        ],
        "application_end": [
          {
            "branch_id": "mori_battery",
            "label": "令和8年度申請",
            "date": "2026-11-13"
          }
        ],
        "application_status": "受付中",
        "amount": {
          "display_text": "蓄電池：5万円です．\n（容量基準）適用条件・補助額の算定に使用：蓄電容量の合計\n（対象容量範囲）適用条件・補助額の算定に使用：1kWh以上\n（適用条件）導入方法：蓄電池・太陽光の同時設置\n（未確認事項）蓄電池の対象費用の税込・税抜の区分",
          "evidence_status": "confirmed",
          "summary_text": "蓄電池：5万円です．"
        },
        "official_conditions": [
          "①森町内に住んでいる方または森町内に転入してくる方で、自ら居住する既築または\n新築の住宅に、新たに住宅用太陽光発電システムを設置しようとする方。（店舗兼\n用住宅を含みます。）\n②町の補助金交付決定後に工事を行い、令和９年２月末までに設置完了できる方。\n③借地・借家の場合、当該土地建物の所有者の承諾を得ている方。\n④本人及び同居家族に町税等の滞納のない方。\n⑤設置後１年間発電量などのデータを提出できる方。\n⑥過去に本補助金の交付を受けていない方。",
          "（交付決定前に工事を着工しないでください）",
          "この補助金を受けた方は、設置後１年間発電量についての状況を報告していただきま\nす。（電力会社の売電買電検針票・電気料金のお知らせの電力量でも記入できるので設\n置後１年間は破棄しないようにして下さい。）\n８．発電システムの維持管理について\nこの補助金を受けた方は、発電システム等を法定耐用年数期間（発電システム１７\n年・定置用蓄電池６年）適切に維持管理しなければなりません。",
          "①上記発電システムと同時に設置されるもの。\n②常時、上記発電システムと接続し、同システムが発電する電力を充放電できる蓄電\n池であること。\n③日本産業規格又は一般社団法人電池工業会規格に準拠しているもの。\n④蓄電容量の合計が１ｋＷｈ以上であるもの。\n⑤未使用品のもの。（新品のもの）\n⑥メーカー指定の環境条件に設置していること。"
        ],
        "gaps": [
          "他制度との併用，税区分，現在の予算残，蓄電容量の定格・実効等の区分は未確認です．"
        ],
        "evidence_urls": [
          "https://www.town.hokkaido-mori.lg.jp/gyoseijoho/seisaku-keikaku/2/1722.html",
          "https://www.town.hokkaido-mori.lg.jp/material/files/group/5/R8shinseinotebiki.pdf"
        ],
        "checked_at": "2026-09-28",
        "display_basis": "retained_reviewed_display",
        "migration_status": "pending_review",
        "model_assumptions": [
          "診断では新品の太陽光・蓄電池を同時導入し，容量1kWh以上などの製品・申請者条件を満たすと仮定します．定額5万円の算定で容量区分を比例計算へ代入しません．",
          "太陽光の町補助と蓄電池の定額を設備別に評価し，蓄電池分を二重に加算しません．禁止が未確認の他補助は計算上併用可能と仮定します．"
        ],
        "legacy_municipal_rule_ids": [],
        "branch_label": "蓄電池の設置（太陽光と同時設置）"
      },
      "catalogAmount": {
        "raw_text": "対象PV同時設置の定置用蓄電池5万円．",
        "display_text": "対象となる太陽光と同時に設置する定置用蓄電池に5万円です．",
        "evidence_status": "partial"
      },
      "rules": [
        {
          "id": "hokkaido-next-mori-battery",
          "government_level": "municipality",
          "prefecture_code": "01",
          "municipality_code": "01345",
          "program_name": "令和8年度住宅用太陽光発電システム設置補助金",
          "housing_ages": [
            "existing",
            "new"
          ],
          "equipment_packages": [
            "solar_plus_standard_battery"
          ],
          "application_status": "accepting",
          "diagnostic_scope": {
            "status": "in_scope",
            "in_scope_housing_ages": [
              "existing",
              "new"
            ],
            "excluded_branch_ids": [],
            "basis": "新規太陽光と同時導入する蓄電池の定額5万円．容量1kWh以上は適格製品条件として満たす仮定で，未確認容量を比例式へ代入しない．"
          },
          "machine_rule": "kansai_municipal_formula",
          "fit_compatible": true,
          "expense_scopes": [
            "battery"
          ],
          "conflict_program_ids": [],
          "official_urls": [
            "https://www.town.hokkaido-mori.lg.jp/gyoseijoho/seisaku-keikaku/2/1722.html",
            "https://www.town.hokkaido-mori.lg.jp/material/files/group/5/R8shinseinotebiki.pdf"
          ],
          "confirmed_at": "2026-09-30",
          "calculation_assumptions": [
            "本人所有・本人居住の設備新設を評価し，確認済みの施工者・本人属性・製品性能・申請時期等の入力外条件を満たすと仮定する．",
            "併用禁止未確認は計算上併用可能と仮定するが，確認済みの禁止・控除・同一経費及び共通上限は維持する．",
            "税区分未記載は税込モデル費へ対応．最終端数処理未確認は1円単位の概算とし，公式の途中丸めは保持する．",
            "期間限定のない現行案内に終了・停止の明示がない場合は受付継続を仮定する．公式対象年度と受付欄は変更しない．",
            "新規太陽光と同時導入する蓄電池の定額5万円．容量1kWh以上は適格製品条件として満たす仮定で，未確認容量を比例式へ代入しない．"
          ],
          "required_confirmations": [
            "申請前に公式案内で対象者，住宅，設備，対象費，併用及び申請・報告時点を確認してください．"
          ],
          "formula_components": [
            {
              "scope": "battery",
              "equipment_packages": [
                "solar_plus_standard_battery"
              ],
              "formula_type": "fixed",
              "cost_scope": "battery",
              "cost_tax": "approved_assumption_inclusive",
              "cap_yen": 50000,
              "rounding_unit_yen": 1000,
              "deduct_other_subsidies": false,
              "fixed_amount_yen": 50000,
              "solar_output_max_kw_exclusive": 10,
              "battery_capacity_min_kwh": 1
            }
          ],
          "source_ids": [
            "hokkaido-saved-material-eb56e8417decef6f73a5",
            "hokkaido-saved-record-304bec4c281dee07810f"
          ]
        }
      ],
      "sections": [
        {
          "label": "蓄電池",
          "text": "5万円です．",
          "supplement": [
            "（容量基準）適用条件・補助額の算定に使用：蓄電容量の合計",
            "（対象容量範囲）適用条件・補助額の算定に使用：1kWh以上",
            "（適用条件）導入方法：蓄電池・太陽光の同時設置",
            "（未確認事項）蓄電池の対象費用の税込・税抜の区分"
          ]
        }
      ],
      "text": "5万円です．",
      "supplement": [
        "（容量基準）適用条件・補助額の算定に使用：蓄電容量の合計",
        "（対象容量範囲）適用条件・補助額の算定に使用：1kWh以上",
        "（適用条件）導入方法：蓄電池・太陽光の同時設置",
        "（未確認事項）蓄電池の対象費用の税込・税抜の区分"
      ],
      "commonSupplement": [
        "（適用条件）製品：未使用で，日本産業規格又は一般社団法人電池工業会規格に準拠した蓄電池が対象です．",
        "（適用条件）接続：対象の太陽光発電設備に常時接続し，その発電電力を充放電できることが必要です．",
        "（適用条件）設置環境：メーカー指定の環境条件で設置します．",
        "（適用条件）居住・住宅：森町内に居住又は転入予定で，自ら住む既存・新築住宅に，新たに住宅用太陽光発電設備を設置します．店舗併用住宅を含みます．",
        "（適用条件）着工・完了：交付決定後に着工し，2027年2月末までに設置を完了します．",
        "（適用条件）所有者承諾：借地・借家では，土地・建物所有者の承諾が必要です．",
        "（適用条件）税滞納：本人・同居家族に町税等の滞納がないことが必要です．",
        "（適用条件）利用履歴：過去に本補助金を受けていないことが必要です．",
        "（適用条件）報告：設置後1年間の発電量等のデータを提出します．",
        "（未確認事項）他制度との併用，税区分，現在の予算残，蓄電容量の定格・実効等の区分は未確認です．"
      ],
      "equipment": "蓄電池",
      "conditionDisplayComplete": true,
      "conditionDisplayVersion": "shared-conditions-mori-2026-10-02.1"
    },
    "misawa-reform-decarbonization-2026": {
      "prefecture": "02",
      "municipality": "02207",
      "recordId": "scheme-b5152e8fb18819edb07a",
      "targetYear": "2026",
      "branch": {
        "branch_id": "misawa-reform-decarbonization-2026",
        "diagnostic_rule_ids": [
          "misawa-reform-decarbonization-2026"
        ],
        "target_equipment": [
          "太陽光パネル",
          "蓄電池"
        ],
        "application_start": [
          {
            "branch_id": "misawa-reform-decarbonization-2026",
            "label": "交付申請",
            "date": ""
          }
        ],
        "application_end": [
          {
            "branch_id": "misawa-reform-decarbonization-2026",
            "label": "交付申請",
            "date": ""
          }
        ],
        "application_status": "受付中",
        "amount": {
          "display_text": "太陽光と蓄電池を含む脱炭素設備の税抜対象工事費から国・県などの補助金を差し引いた額が50万円以上の場合，その10%以内，上限20万円です．補助額の1万円未満を切り捨てます．両設備は同じ脱炭素設備枠で扱います．一般改修工事も行う場合，一般改修補助の上限は25万円から脱炭素設備補助額を差し引いた額です．",
          "evidence_status": "partial"
        },
        "official_conditions": [],
        "gaps": [],
        "evidence_urls": [
          "http://www.city.misawa.lg.jp/index.cfm/22,13592,17,132,html",
          "http://www.city.misawa.lg.jp/index.cfm/22,13592,c,html/13592/20260407-125642.pdf",
          "http://www.city.misawa.lg.jp/index.cfm/22,13592,c,html/13592/20260331-092725.pdf"
        ],
        "checked_at": "2026-09-27",
        "display_basis": "preparing",
        "migration_status": "pending_review",
        "legacy_municipal_rule_ids": []
      },
      "catalogAmount": {
        "raw_text": "脱炭素設備の税抜対象工事費から国・県その他補助金を控除した対象経費が500,000円以上であること．その10％以内，上限200,000円，10,000円未満切捨て．PV・蓄電池を同じ脱炭素設備枠で扱う．一般改修工事も含む場合は，250,000円から脱炭素設備補助金を引いた額を一般改修補助の上限とする．",
        "display_text": "太陽光と蓄電池を含む脱炭素設備の税抜対象工事費から国・県などの補助金を差し引いた額が50万円以上の場合，その10%以内，上限20万円です．補助額の1万円未満を切り捨てます．両設備は同じ脱炭素設備枠で扱います．一般改修工事も行う場合，一般改修補助の上限は25万円から脱炭素設備補助額を差し引いた額です．",
        "evidence_status": "partial"
      },
      "rules": [
        {
          "id": "misawa-reform-decarbonization-2026",
          "government_level": "municipality",
          "prefecture_code": "02",
          "municipality_code": "02207",
          "program_name": "三沢市住宅リフォーム事業費補助金",
          "housing_ages": [
            "existing"
          ],
          "equipment_packages": [
            "solar_only",
            "solar_plus_standard_battery"
          ],
          "application_status": "accepting",
          "diagnostic_scope": {
            "status": "in_scope",
            "in_scope_housing_ages": [
              "existing"
            ],
            "excluded_branch_ids": [],
            "basis": "設備工事が明示対象．一般改修の併施工必須との記載は確認資料になし．受付開始・締切の独立日付は未確認で工事期限と混同しない．独立採否及び経費控除・共有上限の計算契約は未実装．"
          },
          "expense_scopes": [
            "solar",
            "battery"
          ],
          "conflict_program_ids": [],
          "official_urls": [
            "http://www.city.misawa.lg.jp/index.cfm/22,13592,17,132,html",
            "http://www.city.misawa.lg.jp/index.cfm/22,13592,c,html/13592/20260407-125642.pdf",
            "http://www.city.misawa.lg.jp/index.cfm/22,13592,c,html/13592/20260331-092725.pdf"
          ],
          "confirmed_at": "2026-09-27",
          "calculation_assumptions": [
            "本人所有・本人居住の戸建1戸をモデルとして採用．住宅性能の個別条件は対象設備・その他条件に記す．",
            "本人居住の個人を検討対象とし，資料で定める住民登録・税等要件は充足を仮定．他の属性は原文の条件を参照し推測で追加しない．",
            "PVは自家消費目的，モジュール公称最大出力合計又はPCS定格出力10kW未満．蓄電池は1kWh以上かつ定格出力500W以上，新品で変換装置等と一体．住宅と構造上一体の設備．",
            "市内登録店が申請代行・施工，受給者は住民．交付決定後の契約・発注・着工．2026-04-01以降着工，2027-03-19までに完了検査．実績報告は完了から30日後又は2027-03-19の早い日まで．同一住宅の過去利用不可．",
            "併用不可：併用自体は禁止とせず，他補助額を対象経費から控除．\n上限：脱炭素設備合計20万円，一般改修を含む総額25万円．",
            "本人所有・本人居住の戸建を仮定．公式に住宅所有の限定がない場合は仮定として区別．"
          ],
          "required_confirmations": [
            "設備工事が明示対象．一般改修の併施工必須との記載は確認資料になし．受付開始・締切の独立日付は未確認で工事期限と混同しない．独立採否及び経費控除・共有上限の計算契約は未実装．",
            "最新の受付・予算残高，対象機種・資格・申請順序を申請時に確認する．",
            "事実不足でなく実装待ち：他補助控除後の合算経費50万円判定，共有上限・丸め・費目配分の正しい拡張が必要．",
            "交付申請受付：開始日未確認〜固定締切日未確認．工事完了・実績報告の期限とは別．"
          ],
          "source_ids": [
            "kansai-02-misawa-reform-decarbonization-2026-source-1",
            "kansai-02-misawa-reform-decarbonization-2026-source-2",
            "kansai-02-misawa-reform-decarbonization-2026-source-3"
          ],
          "machine_rule": "kansai_municipal_non_adopted",
          "non_adoption_status": "candidate",
          "non_adoption_reason_code": "calculation_detail_unconfirmed"
        }
      ],
      "institutionalSource": "b523dfad1de36454bbb452688c293eaa687ebd9c3b3f760dc03c16da5a146e3c",
      "sections": [
        {
          "label": "太陽光・蓄電池（脱炭素設備枠）",
          "text": "太陽光・蓄電池の税抜対象工事費から国・県等の補助金を差し引いた対象費用の10分の1以内です．",
          "supplement": [
            "（上限）20万円",
            "（端数処理）1万円未満切り捨て"
          ]
        }
      ],
      "text": "太陽光・蓄電池の税抜対象工事費から国・県等の補助金を差し引いた対象費用の10分の1以内です．",
      "supplement": [
        "（上限）20万円",
        "（端数処理）1万円未満切り捨て"
      ],
      "commonSupplement": [
        "（上限）一般改修補助：25万円から脱炭素設備補助額を差し引いた額"
      ],
      "equipment": "太陽光・蓄電池"
    },
    "rokkasho-new-energy-pv-2026": {
      "prefecture": "02",
      "municipality": "02411",
      "recordId": "scheme-9074dc903151d6c082ea",
      "targetYear": "2026",
      "branch": {
        "branch_id": "rokkasho-new-energy-pv-2026",
        "diagnostic_rule_ids": [
          "rokkasho-new-energy-pv-2026"
        ],
        "target_equipment": [
          "太陽光パネル"
        ],
        "application_start": [
          {
            "branch_id": "rokkasho-new-energy-pv-2026",
            "label": "交付申請",
            "date": "2026-04-01"
          }
        ],
        "application_end": [
          {
            "branch_id": "rokkasho-new-energy-pv-2026",
            "label": "交付申請",
            "date": "2027-03-15"
          }
        ],
        "application_status": "受付中",
        "amount": {
          "display_text": "モジュールの公称最大出力合計を0.01kW単位で切り捨て，1kW当たり48,000円を掛けた額，上限24万円です．補助額の千円未満を切り捨てます．",
          "evidence_status": "partial"
        },
        "official_conditions": [],
        "gaps": [],
        "evidence_urls": [
          "https://www.rokkasho.jp/index.cfm/10%2C2933%2C56%2Chtml",
          "https://www.rokkasho.jp/index.cfm/10,2933,c,html/2933/20230522-113530.docx"
        ],
        "checked_at": "2026-09-27",
        "display_basis": "preparing",
        "migration_status": "pending_review",
        "legacy_municipal_rule_ids": []
      },
      "catalogAmount": {
        "raw_text": "モジュール公称最大出力合計kWを0.01kW未満切捨て，48,000円/kWを乗じて千円未満切捨て，上限240,000円．",
        "display_text": "モジュールの公称最大出力合計を0.01kW単位で切り捨て，1kW当たり48,000円を掛けた額，上限24万円です．補助額の千円未満を切り捨てます．",
        "evidence_status": "partial"
      },
      "rules": [
        {
          "id": "rokkasho-new-energy-pv-2026",
          "government_level": "municipality",
          "prefecture_code": "02",
          "municipality_code": "02411",
          "program_name": "六ヶ所村住宅用新エネルギー設備導入支援事業費補助金",
          "housing_ages": [
            "existing",
            "new"
          ],
          "equipment_packages": [
            "solar_only",
            "solar_plus_standard_battery"
          ],
          "application_status": "accepting",
          "diagnostic_scope": {
            "status": "in_scope",
            "in_scope_housing_ages": [
              "existing",
              "new"
            ],
            "excluded_branch_ids": [],
            "basis": "制度ルール不明：別表の設置先は居住面積概ね1/2以上の併用住宅又は附随車庫等と記載．案内の一般居住住宅との対応，専用住宅を含むかは未確認．通常戸建への範囲拡張をせず独立レビュー待ち．"
          },
          "expense_scopes": [
            "solar"
          ],
          "conflict_program_ids": [],
          "official_urls": [
            "https://www.rokkasho.jp/index.cfm/10%2C2933%2C56%2Chtml",
            "https://www.rokkasho.jp/index.cfm/10,2933,c,html/2933/20230522-113530.docx"
          ],
          "confirmed_at": "2026-09-27",
          "calculation_assumptions": [
            "本人所有・本人居住の戸建1戸をモデルとして採用．住宅性能の個別条件は対象設備・その他条件に記す．",
            "本人居住の個人を検討対象とし，資料で定める住民登録・税等要件は充足を仮定．他の属性は原文の条件を参照し推測で追加しない．",
            "低圧逆潮流有り連系，太陽電池最大出力10kW未満，未使用品，JIS性能及びメーカーサポート．",
            "村内居住又は予定，電灯契約，税滞納なし，同一機器の既受給不可．施工前申請，契約2026-04-01以降，2027-03-31までに工事完了．実績報告は完了後30日又は年度末の早い日．",
            "併用不可：確認資料に明記なし．相手制度側の制限を別途適用．\n上限：個別の金額式のとおり．他制度との共通上限は未確認．",
            "本人所有・本人居住の戸建を仮定．公式に住宅所有の限定がない場合は仮定として区別．"
          ],
          "required_confirmations": [
            "制度ルール不明：別表の設置先は居住面積概ね1/2以上の併用住宅又は附随車庫等と記載．案内の一般居住住宅との対応，専用住宅を含むかは未確認．通常戸建への範囲拡張をせず独立レビュー待ち．",
            "最新の受付・予算残高，対象機種・資格・申請順序を申請時に確認する．",
            "交付申請受付：2026-04-01〜2027-03-15．工事完了・実績報告の期限とは別．"
          ],
          "source_ids": [
            "kansai-02-rokkasho-new-energy-pv-2026-source-1",
            "kansai-02-rokkasho-new-energy-pv-2026-source-2"
          ],
          "machine_rule": "kansai_municipal_non_adopted",
          "non_adoption_status": "candidate",
          "non_adoption_reason_code": "calculation_detail_unconfirmed"
        }
      ],
      "institutionalSource": "bd665ae9ae8d3a98453d34281f223e4930f88514f6809265ffc22abff5797b82",
      "sections": [
        {
          "label": "太陽光",
          "text": "太陽光の出力1kWあたり4万8,000円です．",
          "supplement": [
            "（算定対象）出力の基準：モジュールの公称最大出力合計",
            "（上限）24万円",
            "（端数処理）出力（算定前）：0.01kW未満切り捨て"
          ]
        }
      ],
      "text": "太陽光の出力1kWあたり4万8,000円です．",
      "supplement": [
        "（算定対象）出力の基準：モジュールの公称最大出力合計",
        "（上限）24万円",
        "（端数処理）出力（算定前）：0.01kW未満切り捨て"
      ],
      "commonSupplement": [
        "（端数処理）1,000円未満切り捨て"
      ],
      "equipment": "太陽光",
      "savedSourceDetails": true
    },
    "rokkasho-new-energy-battery-2026": {
      "prefecture": "02",
      "municipality": "02411",
      "recordId": "scheme-9074dc903151d6c082ea",
      "targetYear": "2026",
      "branch": {
        "branch_id": "rokkasho-new-energy-battery-2026",
        "diagnostic_rule_ids": [
          "rokkasho-new-energy-battery-2026"
        ],
        "target_equipment": [
          "蓄電池"
        ],
        "application_start": [
          {
            "branch_id": "rokkasho-new-energy-battery-2026",
            "label": "交付申請",
            "date": "2026-04-01"
          }
        ],
        "application_end": [
          {
            "branch_id": "rokkasho-new-energy-battery-2026",
            "label": "交付申請",
            "date": "2027-03-15"
          }
        ],
        "application_status": "受付中",
        "amount": {
          "display_text": "機器本体・配管・部材・架台の購入と設置対象経費の10分の1，上限15万円です．補助額の千円未満を切り捨てます．費用の税区分は未確認です．",
          "evidence_status": "partial"
        },
        "official_conditions": [],
        "gaps": [],
        "evidence_urls": [
          "https://www.rokkasho.jp/index.cfm/10%2C2933%2C56%2Chtml",
          "https://www.rokkasho.jp/index.cfm/10,2933,c,html/2933/20230522-113530.docx"
        ],
        "checked_at": "2026-09-27",
        "display_basis": "preparing",
        "migration_status": "pending_review",
        "legacy_municipal_rule_ids": []
      },
      "catalogAmount": {
        "raw_text": "機器本体・配管・部材・架台の購入及び設置対象経費の1/10，千円未満切捨て，上限150,000円．費用税区分は未確認．",
        "display_text": "機器本体・配管・部材・架台の購入と設置対象経費の10分の1，上限15万円です．補助額の千円未満を切り捨てます．費用の税区分は未確認です．",
        "evidence_status": "partial"
      },
      "rules": [
        {
          "id": "rokkasho-new-energy-battery-2026",
          "government_level": "municipality",
          "prefecture_code": "02",
          "municipality_code": "02411",
          "program_name": "六ヶ所村住宅用新エネルギー設備導入支援事業費補助金",
          "housing_ages": [
            "existing",
            "new"
          ],
          "equipment_packages": [
            "solar_plus_standard_battery"
          ],
          "application_status": "accepting",
          "diagnostic_scope": {
            "status": "in_scope",
            "in_scope_housing_ages": [
              "existing",
              "new"
            ],
            "excluded_branch_ids": [],
            "basis": "公式資料の対象経費の税区分は未確認．診断では承認済みの通常設備設置費・税込仮定を採用し，公式確認済みと区別する．独立採否未了．"
          },
          "expense_scopes": [
            "battery"
          ],
          "conflict_program_ids": [],
          "official_urls": [
            "https://www.rokkasho.jp/index.cfm/10%2C2933%2C56%2Chtml",
            "https://www.rokkasho.jp/index.cfm/10,2933,c,html/2933/20230522-113530.docx"
          ],
          "confirmed_at": "2026-09-27",
          "calculation_assumptions": [
            "本人所有・本人居住の戸建1戸をモデルとして採用．住宅性能の個別条件は対象設備・その他条件に記す．",
            "本人居住の個人を検討対象とし，資料で定める住民登録・税等要件は充足を仮定．他の属性は原文の条件を参照し推測で追加しない．",
            "蓄電容量1.0kWh以上かつ定格出力500W以上の未使用リチウムイオン蓄電池，変換装置等と一体．PV同時導入の明記なし．",
            "村内居住又は予定，電灯契約，税滞納なし，同一機器の既受給不可．施工前申請，契約2026-04-01以降，2027-03-31までに工事完了．実績報告は完了後30日又は年度末の早い日．",
            "併用不可：確認資料に明記なし．相手制度側の制限を別途適用．\n上限：個別の金額式のとおり．他制度との共通上限は未確認．",
            "本人所有・本人居住の戸建を仮定．公式に住宅所有の限定がない場合は仮定として区別．",
            "入力外の資格・機器・施工業者及び申請順序は既承認方針に基づき充足を仮定．",
            "FIT禁止の明記を確認しない枝を現行FIT経路へ対応する．公式なFIT認定可の実証ではない．",
            "六ヶ所Bの税区分は未明示のため既承認の通常設備設置費・税込仮定を適用．定格出力500Wは原単位を保存し製品条件の充足を仮定．"
          ],
          "required_confirmations": [
            "公式資料の対象経費の税区分は未確認．診断では承認済みの通常設備設置費・税込仮定を採用し，公式確認済みと区別する．独立採否未了．",
            "最新の受付・予算残高，対象機種・資格・申請順序を申請時に確認する．",
            "交付申請受付：2026-04-01〜2027-03-15．工事完了・実績報告の期限とは別．"
          ],
          "source_ids": [
            "kansai-02-rokkasho-new-energy-battery-2026-source-1",
            "kansai-02-rokkasho-new-energy-battery-2026-source-2"
          ],
          "machine_rule": "kansai_municipal_formula",
          "fit_compatible": true,
          "formula_components": [
            {
              "scope": "battery",
              "equipment_packages": [
                "solar_plus_standard_battery"
              ],
              "housing_ages": [
                "existing",
                "new"
              ],
              "formula_type": "cost_fraction",
              "cost_scope": "battery",
              "cost_tax": "approved_assumption_inclusive",
              "fraction_numerator": 1,
              "fraction_denominator": 10,
              "cap_yen": 150000,
              "rounding_unit_yen": 1000,
              "battery_capacity_min_kwh": 1
            }
          ]
        }
      ],
      "institutionalSource": "b9ef9e8323a772090c6b6735368da99022884e575a5932beefdd8f8676cfd0da",
      "sections": [
        {
          "label": "蓄電池",
          "text": "機器本体・配管・部材・架台の購入と設置対象経費の10分の1です．",
          "supplement": [
            "（上限）15万円",
            "（端数処理）1,000円未満切り捨て",
            "（未確認事項）費用の税区分"
          ]
        }
      ],
      "text": "機器本体・配管・部材・架台の購入と設置対象経費の10分の1です．",
      "supplement": [
        "（上限）15万円",
        "（端数処理）1,000円未満切り捨て",
        "（未確認事項）費用の税区分"
      ],
      "commonSupplement": [],
      "equipment": "蓄電池のみ"
    },
    "iwate-miyako-residential-battery-2026": {
      "prefecture": "03",
      "municipality": "03202",
      "recordId": "scheme-88f2bf4ada3fb262a8d2",
      "targetYear": "2026年度（現行通常案内の受付継続仮定）",
      "branch": {
        "branch_id": "iwate-miyako-residential-battery-2026",
        "diagnostic_rule_ids": [
          "iwate-miyako-residential-battery-2026"
        ],
        "target_equipment": [
          "蓄電池",
          "蓄電池＋太陽光パネル"
        ],
        "application_start": [],
        "application_end": [],
        "application_status": "受付中",
        "amount": {
          "display_text": "定格蓄電容量1kWh当たり3万円，上限20万円です．補助額の千円未満を切り捨てます．容量自体を事前に丸めるかは，保存した要綱では未確認です．",
          "evidence_status": "partial"
        },
        "official_conditions": [],
        "gaps": [],
        "evidence_urls": [
          "https://www.city.miyako.iwate.jp/gyosei/soshiki/energy_suishin/2/1/1282.html",
          "https://www.city.miyako.iwate.jp/material/files/group/13/chikuden_youkou.pdf"
        ],
        "checked_at": "2026-09-27",
        "display_basis": "preparing",
        "migration_status": "pending_review",
        "legacy_municipal_rule_ids": []
      },
      "catalogAmount": {
        "raw_text": "定格蓄電容量kWh×30,000円，上限200,000円，千円未満切捨て．容量自体の事前丸めは保存要綱で未確認．",
        "display_text": "定格蓄電容量1kWh当たり3万円，上限20万円です．補助額の千円未満を切り捨てます．容量自体を事前に丸めるかは，保存した要綱では未確認です．",
        "evidence_status": "partial"
      },
      "rules": [
        {
          "id": "iwate-miyako-residential-battery-2026",
          "government_level": "municipality",
          "prefecture_code": "03",
          "municipality_code": "03202",
          "program_name": "宮古市蓄電池システム導入促進費補助金",
          "housing_ages": [
            "existing",
            "new"
          ],
          "equipment_packages": [
            "solar_plus_standard_battery"
          ],
          "application_status": "accepting",
          "diagnostic_scope": {
            "status": "in_scope",
            "in_scope_housing_ages": [
              "existing",
              "new"
            ],
            "excluded_branch_ids": [],
            "basis": "独立採用前の収集案．通常PV補助とは別制度．同一Bへの他制度補助禁止をPV向け別給付の禁止へ拡張しない．通常案内に終了告知なしのため受付継続を仮定，現在予算残額の確認済みではない．所有指定なしは本人所有仮定，新築/既存/建売を保持．既設PVへのB追加は原式を保持するが現行新規設備診断とは別経路．法人事業所枝は原文に保持．"
          },
          "expense_scopes": [
            "battery"
          ],
          "conflict_program_ids": [
            "national-dr-battery-r7-supplement-2026",
            "national-zeh-new-detached-2026-battery",
            "national-mirai-eco-renovation-2026-battery"
          ],
          "official_urls": [
            "https://www.city.miyako.iwate.jp/gyosei/soshiki/energy_suishin/2/1/1282.html",
            "https://www.city.miyako.iwate.jp/material/files/group/13/chikuden_youkou.pdf"
          ],
          "confirmed_at": "2026-09-27",
          "calculation_assumptions": [
            "自己居住の市内戸建てに新設する者又は自己居住する設備付き建売購入者，市税滞納なし．",
            "未使用，蓄電池とPCSの一体的システム，固定設置，住宅用PVに接続．",
            "市内本店・支店・営業所等のある販売店又は施工業者．PVと接続した日から3か月以内に申請し，PV・B接続申出書等を提出．",
            "併用不可：同一蓄電池システムについて本告示又は他制度の補助金等\n上限：B200000円",
            "入力外の資格・機種・施工業者・居住・申請順序は既承認方針で充足を仮定．",
            "容量前処理指定なしは入力容量をそのまま使用．PCSとモジュールの別入力がないため制度出力へ現行入力を対応するモデル仮定．",
            "禁止未確認の併用は条件充足を仮定し，公式併用許可と区別する．"
          ],
          "required_confirmations": [
            "独立採用前の収集案．通常PV補助とは別制度．同一Bへの他制度補助禁止をPV向け別給付の禁止へ拡張しない．通常案内に終了告知なしのため受付継続を仮定，現在予算残額の確認済みではない．所有指定なしは本人所有仮定，新築/既存/建売を保持．既設PVへのB追加は原式を保持するが現行新規設備診断とは別経路．法人事業所枝は原文に保持．",
            "最新の受付・予算・個人及び施工業者資格・製品要件を申請時に確認する．"
          ],
          "source_ids": [
            "iwate-03-iwate-miyako-residential-battery-2026-source-1",
            "iwate-03-iwate-miyako-residential-battery-2026-source-2"
          ],
          "machine_rule": "kansai_municipal_formula",
          "fit_compatible": true,
          "formula_components": [
            {
              "scope": "battery",
              "equipment_packages": [
                "solar_plus_standard_battery"
              ],
              "formula_type": "capacity_rate",
              "capacity_source": "battery_kwh",
              "capacity_preprocessing": "none",
              "unit_amount_yen": 30000,
              "cost_scope": "battery",
              "cost_tax": "exclusive",
              "cap_yen": 200000,
              "rounding_unit_yen": 1000
            }
          ]
        }
      ],
      "institutionalSource": "576d763321c450135e0b6dee061e3ded098a3fab377c29ffe462c89ad2f220a7",
      "sections": [
        {
          "label": "蓄電池",
          "text": "蓄電池の容量1kWhあたり3万円です．",
          "supplement": [
            "（算定対象）容量の基準：定格蓄電容量",
            "（上限）20万円"
          ]
        }
      ],
      "text": "蓄電池の容量1kWhあたり3万円です．",
      "supplement": [
        "（算定対象）容量の基準：定格蓄電容量",
        "（上限）20万円"
      ],
      "commonSupplement": [
        "（端数処理）1,000円未満切り捨て",
        "（未確認事項）容量自体を事前に丸めるか"
      ],
      "equipment": "蓄電池",
      "savedSourceDetails": true
    },
    "iwate-rikuzentakata-solar-battery-2026": {
      "prefecture": "03",
      "municipality": "03210",
      "recordId": "scheme-50f4883a3b8ce6d86e77",
      "targetYear": "2026年度",
      "branch": {
        "branch_id": "iwate-rikuzentakata-solar-battery-2026",
        "diagnostic_rule_ids": [
          "iwate-rikuzentakata-solar-battery-2026"
        ],
        "target_equipment": [
          "太陽光パネル",
          "蓄電池",
          "蓄電池＋太陽光パネル"
        ],
        "application_start": [
          {
            "branch_id": "rikuzentakata",
            "label": "令和8年度申請期限17時15分（年内最終開庁日）",
            "date": ""
          }
        ],
        "application_end": [
          {
            "branch_id": "rikuzentakata",
            "label": "令和8年度申請期限17時15分（年内最終開庁日）",
            "date": "2026-12-28"
          }
        ],
        "application_status": "受付中",
        "amount": {
          "display_text": "太陽光は税抜補助対象経費の2/3，上限800,000円，蓄電池は税抜補助対象経費の3/4，上限400,000円で，各額の千円未満を切り捨てます．一括申請も設備別の算定額を合計し，上限1,200,000円です．対象経費の内訳は要綱別表によります．令和7年度以降は現金給付です．その他の再エネ発電設備は最大出力1kW当たり30,000円・上限100,000円，様式では千円未満切捨ての別設備であり，太陽光・蓄電池へ加算しません．",
          "evidence_status": "partial"
        },
        "official_conditions": [],
        "gaps": [],
        "evidence_urls": [
          "https://www.city.rikuzentakata.iwate.jp/soshiki/machizukurisuishinka/seikatsukankyokakari/hojokin/8925.html",
          "https://www.city.rikuzentakata.iwate.jp/material/files/group/19/new-energy-solar-pawer-20260401.pdf"
        ],
        "checked_at": "2026-09-27",
        "display_basis": "preparing",
        "migration_status": "pending_review",
        "legacy_municipal_rule_ids": []
      },
      "catalogAmount": {
        "raw_text": "PV税抜補助対象経費の2/3，上限800,000円，千円未満切捨て．B税抜補助対象経費の3/4，上限400,000円，千円未満切捨て．一括対象の場合も設備別算定額の合計で上限1,200,000円．対象経費内訳は要綱別表による．令和7年度以降は現金給付．その他再エネ発電設備は最大出力1kW当たり30,000円，上限100,000円（様式は千円未満切捨て）として別設備の原式を保持しPV/Bへ加算しない．",
        "display_text": "太陽光は税抜補助対象経費の2/3，上限800,000円，蓄電池は税抜補助対象経費の3/4，上限400,000円で，各額の千円未満を切り捨てます．一括申請も設備別の算定額を合計し，上限1,200,000円です．対象経費の内訳は要綱別表によります．令和7年度以降は現金給付です．その他の再エネ発電設備は最大出力1kW当たり30,000円・上限100,000円，様式では千円未満切捨ての別設備であり，太陽光・蓄電池へ加算しません．",
        "evidence_status": "partial"
      },
      "rules": [
        {
          "id": "iwate-rikuzentakata-solar-battery-2026",
          "government_level": "municipality",
          "prefecture_code": "03",
          "municipality_code": "03210",
          "program_name": "陸前高田市新エネルギー設備導入促進事業（太陽光発電システム等）補助金",
          "housing_ages": [
            "existing",
            "new"
          ],
          "equipment_packages": [
            "solar_only",
            "solar_plus_standard_battery"
          ],
          "application_status": "accepting",
          "diagnostic_scope": {
            "status": "in_scope",
            "in_scope_housing_ages": [
              "existing",
              "new"
            ],
            "excluded_branch_ids": [],
            "basis": "独立採用前の収集案．令和8年度からB追加，現金交付（過年度の商品券方式を引き継がない）．非FIT/FIPの新設又は卒FITの既設接続のため現行新規FIT診断非算入．新築/既存・所有の未指定部分は共通仮定．一般備考の更新不可とFAQ7の卒FIT蓄電池更新可は両方保存し，更新例外の範囲を一般化しない．新設標準枝の算式は確定，更新例外・特殊設備の参照先の全条件は未確認．要綱12月末の一般期限に対し現年度案内の12月28日17時15分を採用．残予算未確認．"
          },
          "expense_scopes": [
            "solar",
            "battery"
          ],
          "conflict_program_ids": [],
          "official_urls": [
            "https://www.city.rikuzentakata.iwate.jp/soshiki/machizukurisuishinka/seikatsukankyokakari/hojokin/8925.html",
            "https://www.city.rikuzentakata.iwate.jp/material/files/group/19/new-energy-solar-pawer-20260401.pdf"
          ],
          "confirmed_at": "2026-09-27",
          "calculation_assumptions": [
            "市内在住又は転入予定（実績報告提出までに転入完了），申請時点で納期到来市税等の滞納なし．平成26年旧実施要綱による受給歴なし，ただし蓄電池導入は過去受給者も対象という例外を保持．",
            "新品．太陽光は住宅・同敷地内カーポートを含む．モジュール最大出力合計とPCS定格出力の小さい値を0.01kW単位で切捨てて10kW未満，非FIT/FIP．蓄電池は非FIT/FIP及び地域新電力契約条件を満たす太陽光と接続．卒FITのB追加・更新はFAQ7の対象案内を保持．家庭Bは初期実効容量1kWh以上，平時充放電，非常用のみ不可，別紙2の性能・安全・保証要件に適合．",
            "契約前に申請，交付決定通知後に契約．陸前高田市しみんエネルギーと買電・余剰売電双方を実績報告までに契約，原則5年継続．市外施工業者も可．2027年3月31日まで完了・助成請求，完了報告は遅くとも3月10日までの提出依頼．別紙1の自家消費条件等を満たす（敷地内家庭用の経路は30%以上），自己託送不可．",
            "併用不可：同一太陽光・蓄電池について本制度又は他制度の補助（申請中含む）．DR補助との併用不可\n上限：PV800000円・B400000円・合計1200000円，設備導入ごとに1住宅等1回"
          ],
          "required_confirmations": [
            "独立採用前の収集案．令和8年度からB追加，現金交付（過年度の商品券方式を引き継がない）．非FIT/FIPの新設又は卒FITの既設接続のため現行新規FIT診断非算入．新築/既存・所有の未指定部分は共通仮定．一般備考の更新不可とFAQ7の卒FIT蓄電池更新可は両方保存し，更新例外の範囲を一般化しない．新設標準枝の算式は確定，更新例外・特殊設備の参照先の全条件は未確認．要綱12月末の一般期限に対し現年度案内の12月28日17時15分を採用．残予算未確認．",
            "最新の受付・予算・個人及び施工業者資格・製品要件を申請時に確認する．"
          ],
          "source_ids": [
            "iwate-03-iwate-rikuzentakata-solar-battery-2026-source-1",
            "iwate-03-iwate-rikuzentakata-solar-battery-2026-source-2"
          ],
          "machine_rule": "kansai_municipal_non_adopted",
          "non_adoption_status": "excluded",
          "non_adoption_reason_code": "official_conditions_not_applicable",
          "fit_compatible": false
        }
      ],
      "institutionalSource": "2748a3bef14997c97b74cb3092a3f3bebb0ee5b6d5c745652c67abc44922ea7f",
      "sections": [
        {
          "label": "太陽光",
          "text": "太陽光の税抜補助対象経費の3分の2です．",
          "supplement": [
            "（上限）80万円",
            "（端数処理）1,000円未満切り捨て"
          ]
        },
        {
          "label": "蓄電池",
          "text": "蓄電池の税抜補助対象経費の4分の3です．",
          "supplement": [
            "（上限）40万円",
            "（端数処理）1,000円未満切り捨て"
          ]
        }
      ],
      "text": "太陽光：太陽光の税抜補助対象経費の3分の2です．\n蓄電池：蓄電池の税抜補助対象経費の4分の3です．",
      "supplement": [
        "（共通上限）太陽光・蓄電池の合計で120万円"
      ],
      "commonSupplement": [
        "（共通上限）太陽光・蓄電池の合計で120万円"
      ],
      "equipment": "太陽光・蓄電池"
    },
    "miyagi-osaki-eco": {
      "prefecture": "04",
      "municipality": "04215",
      "recordId": "scheme-e6fbb9e5bfdfd46e8ce9",
      "targetYear": "2026年度",
      "branch": {
        "branch_id": "miyagi-osaki-eco",
        "diagnostic_rule_ids": [
          "miyagi-osaki-eco"
        ],
        "target_equipment": [
          "太陽光パネル",
          "蓄電池"
        ],
        "application_start": [
          {
            "branch_id": "osaki_first",
            "label": "第1期事前申込",
            "date": "2026-06-01"
          },
          {
            "branch_id": "osaki_second",
            "label": "第2期事前申込",
            "date": "2026-12-01"
          }
        ],
        "application_end": [
          {
            "branch_id": "osaki_first",
            "label": "第1期事前申込",
            "date": "2026-06-30"
          },
          {
            "branch_id": "osaki_second",
            "label": "第2期事前申込",
            "date": "2026-12-18"
          }
        ],
        "application_status": "受付対象外",
        "amount": {
          "display_text": "太陽光は出力が1kW以上2kW未満で10,000円，2kW以上3kW未満で20,000円，3kW以上4kW未満で30,000円，4kW以上5kW未満で40,000円，5kW以上で50,000円です．施工者が市内に本社・本店を置く場合は5,000円を加算します．蓄電池は1基1kWh以上で100,000円，購入先と施工者の双方が市内に本社・本店を置く場合は5,000円を加算します．1対象者の年度合計上限215,000円は加算やV2H等も含む制度全体上限で，太陽光・蓄電池だけの定額ではありません．V2H50,000円と条件付き5,000円加算は別設備です．太陽光表の1時間当たり発電量という表現と入力容量との対応は未確認です．",
          "evidence_status": "partial"
        },
        "official_conditions": [],
        "gaps": [],
        "evidence_urls": [
          "https://www.city.osaki.miyagi.jp/shisei/soshikikarasagasu/shiminkyodousuishimbu/kankyohozenka/1/1/1671.html",
          "https://www.city.osaki.miyagi.jp/material/files/group/12/ekokaizen26.pdf",
          "https://www.city.osaki.miyagi.jp/material/files/group/12/ecoyouryou.pdf",
          "https://www.city.osaki.miyagi.jp/material/files/group/12/tebiki04.pdf"
        ],
        "checked_at": "2026-09-28",
        "display_basis": "preparing",
        "migration_status": "pending_review",
        "legacy_municipal_rule_ids": []
      },
      "catalogAmount": {
        "raw_text": "PV1以上2kW未満10000円，2以上3未満20000円，3以上4未満30000円，4以上5未満40000円，5以上50000円．PV施工者が市内本社本店なら5000円加算．B1基1kWh以上100000円，購入先及び施工者が市内本社本店なら別途5000円加算．1対象者年度合計215000円上限（加算込）．V2H50000円＋条件付き5000円は原式保持しPV/B診断へ加算しない．",
        "display_text": "太陽光は出力が1kW以上2kW未満で10,000円，2kW以上3kW未満で20,000円，3kW以上4kW未満で30,000円，4kW以上5kW未満で40,000円，5kW以上で50,000円です．施工者が市内に本社・本店を置く場合は5,000円を加算します．蓄電池は1基1kWh以上で100,000円，購入先と施工者の双方が市内に本社・本店を置く場合は5,000円を加算します．1対象者の年度合計上限215,000円は加算やV2H等も含む制度全体上限で，太陽光・蓄電池だけの定額ではありません．V2H50,000円と条件付き5,000円加算は別設備です．太陽光表の1時間当たり発電量という表現と入力容量との対応は未確認です．",
        "evidence_status": "partial"
      },
      "rules": [
        {
          "id": "miyagi-osaki-eco",
          "government_level": "municipality",
          "prefecture_code": "04",
          "municipality_code": "04215",
          "program_name": "大崎市エコ改善推進事業補助金",
          "housing_ages": [
            "existing",
            "new"
          ],
          "equipment_packages": [
            "solar_only",
            "solar_plus_standard_battery"
          ],
          "application_status": "scheduled",
          "diagnostic_scope": {
            "status": "in_scope",
            "in_scope_housing_ages": [
              "existing",
              "new"
            ],
            "excluded_branch_ids": [],
            "basis": "独立採用前．確認時第1期closed/第2期scheduledを保持し，3状態では受付対象外．市内業者加算はPVとBで各5000円，Bは購入先及び施工者の双方要件を要綱p14・手引きp2で確認．B同時PV設置可を要綱で確認し手引きの設置済だけに狭めない．要綱第3条の個人は兼用住宅除外，手引きは店舗併用可と差異あり，本人専用住宅枝に限定する案で差異は留保．PV表の「1時間当たり発電量」表現とモジュール/PCS対応は同容量入力のモデル仮定候補，物理的同義としない．未算入他設備・事業者枝も原文保持．"
          },
          "expense_scopes": [
            "solar",
            "battery"
          ],
          "conflict_program_ids": [],
          "official_urls": [
            "https://www.city.osaki.miyagi.jp/shisei/soshikikarasagasu/shiminkyodousuishimbu/kankyohozenka/1/1/1671.html",
            "https://www.city.osaki.miyagi.jp/material/files/group/12/ekokaizen26.pdf",
            "https://www.city.osaki.miyagi.jp/material/files/group/12/ecoyouryou.pdf",
            "https://www.city.osaki.miyagi.jp/material/files/group/12/tebiki04.pdf"
          ],
          "confirmed_at": "2026-09-28",
          "calculation_assumptions": [
            "市内住所又は転入予定（交付申請時市内住所），市税未納なし，反社除外，本人住居として使用．",
            "PVはモジュール公称最大出力又はPCS定格出力のいずれか10kW未満，JET等認証・新品・低圧余剰．B家庭用新品・固定・1kWh以上，PV設置済又は同時設置（要綱別表），住宅で消費．",
            "工事契約2025-06-01以降，引渡2025-12-01～2026-11-30．新築/建売同時設置は住宅契約/引渡日を用いる．設置後事前申込，予算到達時抽選，対象者決定後交付申請．第1期申請期限7月31日，第2期2027年1月31日を事前申込期限と区別．所有者外は承諾必要．",
            "併用不可：他制度との禁止は確認要綱・手引きで明記なし\n上限：年度1対象者215000円（加算込），各事業区分1世帯1回・既受給同区分不可．",
            "入力外の本人・機種・施工業者資格は既承認方針に基づき充足を仮定．",
            "PV出力の単一入力を制度出力へ対応させるモデル仮定．モジュールとPCSの異容量を確認済みとはしない．",
            "他制度禁止未確認の併用は共通条件充足仮定であり公式許可と区別．",
            "PV施工者並びにB購入先及び施工者の市内本社本店条件を充足仮定し，各5000円加算．PV/B合計16万円で年度全設備21.5万円上限以内．"
          ],
          "required_confirmations": [
            "独立採用前．確認時第1期closed/第2期scheduledを保持し，3状態では受付対象外．市内業者加算はPVとBで各5000円，Bは購入先及び施工者の双方要件を要綱p14・手引きp2で確認．B同時PV設置可を要綱で確認し手引きの設置済だけに狭めない．要綱第3条の個人は兼用住宅除外，手引きは店舗併用可と差異あり，本人専用住宅枝に限定する案で差異は留保．PV表の「1時間当たり発電量」表現とモジュール/PCS対応は同容量入力のモデル仮定候補，物理的同義としない．未算入他設備・事業者枝も原文保持．",
            "申請時の受付・残予算・資格・製品及び施工条件は別途確認する．"
          ],
          "source_ids": [
            "miyagi-osaki-eco-source-1",
            "miyagi-osaki-eco-source-2",
            "miyagi-osaki-eco-source-3",
            "miyagi-osaki-eco-source-4"
          ],
          "machine_rule": "kansai_municipal_formula",
          "fit_compatible": true,
          "formula_components": [
            {
              "scope": "solar",
              "equipment_packages": [
                "solar_only",
                "solar_plus_standard_battery"
              ],
              "formula_type": "fixed",
              "fixed_amount_yen": 10000,
              "cost_scope": null,
              "cost_tax": null,
              "cap_yen": null,
              "rounding_unit_yen": 1,
              "solar_output_min_kw": 1,
              "solar_output_max_kw_exclusive": 2
            },
            {
              "scope": "solar",
              "equipment_packages": [
                "solar_only",
                "solar_plus_standard_battery"
              ],
              "formula_type": "fixed",
              "fixed_amount_yen": 20000,
              "cost_scope": null,
              "cost_tax": null,
              "cap_yen": null,
              "rounding_unit_yen": 1,
              "solar_output_min_kw": 2,
              "solar_output_max_kw_exclusive": 3
            },
            {
              "scope": "solar",
              "equipment_packages": [
                "solar_only",
                "solar_plus_standard_battery"
              ],
              "formula_type": "fixed",
              "fixed_amount_yen": 30000,
              "cost_scope": null,
              "cost_tax": null,
              "cap_yen": null,
              "rounding_unit_yen": 1,
              "solar_output_min_kw": 3,
              "solar_output_max_kw_exclusive": 4
            },
            {
              "scope": "solar",
              "equipment_packages": [
                "solar_only",
                "solar_plus_standard_battery"
              ],
              "formula_type": "fixed",
              "fixed_amount_yen": 40000,
              "cost_scope": null,
              "cost_tax": null,
              "cap_yen": null,
              "rounding_unit_yen": 1,
              "solar_output_min_kw": 4,
              "solar_output_max_kw_exclusive": 5
            },
            {
              "scope": "solar",
              "equipment_packages": [
                "solar_only",
                "solar_plus_standard_battery"
              ],
              "formula_type": "fixed",
              "fixed_amount_yen": 50000,
              "cost_scope": null,
              "cost_tax": null,
              "cap_yen": null,
              "rounding_unit_yen": 1,
              "solar_output_min_kw": 5,
              "solar_output_max_kw_exclusive": 10
            },
            {
              "scope": "solar",
              "equipment_packages": [
                "solar_only",
                "solar_plus_standard_battery"
              ],
              "formula_type": "fixed",
              "fixed_amount_yen": 5000,
              "cost_scope": null,
              "cost_tax": null,
              "cap_yen": null,
              "rounding_unit_yen": 1,
              "solar_output_min_kw": 1,
              "solar_output_max_kw_exclusive": 10
            },
            {
              "scope": "battery",
              "equipment_packages": [
                "solar_plus_standard_battery"
              ],
              "formula_type": "fixed",
              "fixed_amount_yen": 105000,
              "cost_scope": null,
              "cost_tax": null,
              "cap_yen": null,
              "rounding_unit_yen": 1,
              "battery_capacity_min_kwh": 1
            }
          ]
        }
      ],
      "institutionalSource": "ce2ad5f338e99b654c1956ec5c03458d505b9d0b64cbf1432609b2e65e2ab9df",
      "sections": [
        {
          "label": "太陽光（1kW以上2kW未満）",
          "text": "1万円です．",
          "supplement": [
            "（算定対象）出力：1kW以上2kW未満",
            "（加算）施工者が市内に本社・本店を置く事業者の場合，太陽光に5,000円を加算",
            "（未確認事項）制度表の出力量と入力容量の対応"
          ]
        },
        {
          "label": "太陽光（2kW以上3kW未満）",
          "text": "2万円です．",
          "supplement": [
            "（算定対象）出力：2kW以上3kW未満",
            "（加算）施工者が市内に本社・本店を置く事業者の場合，太陽光に5,000円を加算",
            "（未確認事項）制度表の出力量と入力容量の対応"
          ]
        },
        {
          "label": "太陽光（3kW以上4kW未満）",
          "text": "3万円です．",
          "supplement": [
            "（算定対象）出力：3kW以上4kW未満",
            "（加算）施工者が市内に本社・本店を置く事業者の場合，太陽光に5,000円を加算",
            "（未確認事項）制度表の出力量と入力容量の対応"
          ]
        },
        {
          "label": "太陽光（4kW以上5kW未満）",
          "text": "4万円です．",
          "supplement": [
            "（算定対象）出力：4kW以上5kW未満",
            "（加算）施工者が市内に本社・本店を置く事業者の場合，太陽光に5,000円を加算",
            "（未確認事項）制度表の出力量と入力容量の対応"
          ]
        },
        {
          "label": "太陽光（5kW以上）",
          "text": "5万円です．",
          "supplement": [
            "（算定対象）出力：5kW以上",
            "（加算）施工者が市内に本社・本店を置く事業者の場合，太陽光に5,000円を加算",
            "（未確認事項）制度表の出力量と入力容量の対応"
          ]
        },
        {
          "label": "蓄電池",
          "text": "10万円です．",
          "supplement": [
            "（算定対象）容量：1基1kWh以上",
            "（加算）購入先と施工者の双方が市内に本社・本店を置く事業者の場合，蓄電池に5,000円を加算"
          ]
        }
      ],
      "text": "太陽光（1kW以上2kW未満）：1万円です．\n太陽光（2kW以上3kW未満）：2万円です．\n太陽光（3kW以上4kW未満）：3万円です．\n太陽光（4kW以上5kW未満）：4万円です．\n太陽光（5kW以上）：5万円です．\n蓄電池：10万円です．",
      "supplement": [
        "（共通上限）1対象者の年度内の太陽光・蓄電池・V2H等の合計で21万5,000円"
      ],
      "commonSupplement": [
        "（共通上限）1対象者の年度内の太陽光・蓄電池・V2H等の合計で21万5,000円"
      ],
      "equipment": "太陽光・蓄電池"
    },
    "miyagi-minamisanriku-solar": {
      "prefecture": "04",
      "municipality": "04606",
      "recordId": "scheme-6f90e4c81847e01eb010",
      "targetYear": "2026年度",
      "branch": {
        "branch_id": "miyagi-minamisanriku-solar",
        "diagnostic_rule_ids": [
          "miyagi-minamisanriku-solar"
        ],
        "target_equipment": [
          "太陽光パネル"
        ],
        "application_start": [
          {
            "branch_id": "minamisanriku_solar",
            "label": "設置後申請",
            "date": "2026-04-01"
          }
        ],
        "application_end": [
          {
            "branch_id": "minamisanriku_solar",
            "label": "設置後申請",
            "date": "2027-03-31"
          }
        ],
        "application_status": "受付中",
        "amount": {
          "display_text": "太陽光のモジュール公称最大出力の小数第3位以下を切り捨て，1kW当たり30,000円，住宅当たり上限120,000円です．補助額の千円未満を切り捨てます．購入・設置費は税抜が対象と記載されていますが，費用100％の補助率や新たな費用上限の式を補いません．蓄電池の補助額は未確認で，制度が存在しないと判断したものではありません．",
          "evidence_status": "partial"
        },
        "official_conditions": [],
        "gaps": [],
        "evidence_urls": [
          "https://www.town.minamisanriku.miyagi.jp/soshiki/1006/7/4/1971.html",
          "https://www.town.minamisanriku.miyagi.jp/material/files/group/7/20250414-123748.pdf",
          "https://www.town.minamisanriku.miyagi.jp/material/files/group/7/20220412-115834.pdf",
          "https://www.town.minamisanriku.miyagi.jp/material/files/group/7/20220412-115930.pdf"
        ],
        "checked_at": "2026-09-28",
        "display_basis": "preparing",
        "migration_status": "pending_review",
        "legacy_municipal_rule_ids": []
      },
      "catalogAmount": {
        "raw_text": "PVモジュール公称最大出力30000円/kW，住宅当たり上限120000円．容量小数第3位以下切捨て，補助額1000円未満切捨て．",
        "display_text": "太陽光のモジュール公称最大出力の小数第3位以下を切り捨て，1kW当たり30,000円，住宅当たり上限120,000円です．補助額の千円未満を切り捨てます．購入・設置費は税抜が対象と記載されていますが，費用100％の補助率や新たな費用上限の式を補いません．蓄電池の補助額は未確認で，制度が存在しないと判断したものではありません．",
        "evidence_status": "partial"
      },
      "rules": [
        {
          "id": "miyagi-minamisanriku-solar",
          "government_level": "municipality",
          "prefecture_code": "04",
          "municipality_code": "04606",
          "program_name": "南三陸町住宅用太陽光発電システム普及促進事業補助金",
          "housing_ages": [
            "existing",
            "new"
          ],
          "equipment_packages": [
            "solar_only",
            "solar_plus_standard_battery"
          ],
          "application_status": "accepting",
          "diagnostic_scope": {
            "status": "in_scope",
            "in_scope_housing_ages": [
              "existing",
              "new"
            ],
            "excluded_branch_ids": [],
            "basis": "独立レビュー前．R8受付は現行ページ，容量丸めは手引きp2の3.675→3.67→110000円例と本文．住宅新旧の限定なしは両方のモデル仮定．B補助は本制度に確認できず，共同購入の紹介を補助金へ混同しない．残予算未確認・終了表示なしの継続仮定．"
          },
          "expense_scopes": [
            "solar"
          ],
          "conflict_program_ids": [],
          "official_urls": [
            "https://www.town.minamisanriku.miyagi.jp/soshiki/1006/7/4/1971.html",
            "https://www.town.minamisanriku.miyagi.jp/material/files/group/7/20250414-123748.pdf",
            "https://www.town.minamisanriku.miyagi.jp/material/files/group/7/20220412-115834.pdf",
            "https://www.town.minamisanriku.miyagi.jp/material/files/group/7/20220412-115930.pdf"
          ],
          "confirmed_at": "2026-09-28",
          "calculation_assumptions": [
            "自治体内に居住する個人，地方税等の滞納なし．",
            "住宅用新品PV，低圧逆潮流あり・余剰配線，申請者本人の電力受給契約．",
            "受給開始から6か月以内かつ年度受付期間内に申請．申請時に設置住宅所在地の住民登録，事前に担当課連絡．他人所有住宅は承諾書．購入設置費税抜が対象．",
            "併用不可：他制度禁止明記なし\n上限：当該住宅につき120000円．",
            "入力外の本人・機種・施工業者資格は既承認方針に基づき充足を仮定．",
            "PV出力の単一入力を制度出力へ対応させるモデル仮定．モジュールとPCSの異容量を確認済みとはしない．",
            "他制度禁止未確認の併用は共通条件充足仮定であり公式許可と区別．"
          ],
          "required_confirmations": [
            "独立レビュー前．R8受付は現行ページ，容量丸めは手引きp2の3.675→3.67→110000円例と本文．住宅新旧の限定なしは両方のモデル仮定．B補助は本制度に確認できず，共同購入の紹介を補助金へ混同しない．残予算未確認・終了表示なしの継続仮定．",
            "申請時の受付・残予算・資格・製品及び施工条件は別途確認する．"
          ],
          "source_ids": [
            "miyagi-minamisanriku-solar-source-1",
            "miyagi-minamisanriku-solar-source-2",
            "miyagi-minamisanriku-solar-source-3",
            "miyagi-minamisanriku-solar-source-4"
          ],
          "machine_rule": "kansai_municipal_formula",
          "fit_compatible": true,
          "formula_components": [
            {
              "scope": "solar",
              "equipment_packages": [
                "solar_only",
                "solar_plus_standard_battery"
              ],
              "formula_type": "capacity_rate",
              "unit_amount_yen": 30000,
              "capacity_source": "solar_kw",
              "capacity_preprocessing": "floor_0_01",
              "cost_scope": null,
              "cost_tax": null,
              "cap_yen": 120000,
              "rounding_unit_yen": 1000
            }
          ]
        }
      ],
      "institutionalSource": "7747e9bc48e26a379d530f789a4bf0c96793c80099627992fe1db79f0bf3489a",
      "sections": [
        {
          "label": "太陽光",
          "text": "太陽光の出力1kWあたり3万円です．",
          "supplement": [
            "（算定対象）出力の基準：モジュール公称最大出力",
            "（上限）12万円",
            "（端数処理）0.01kW未満切り捨て",
            "（端数処理）1,000円未満切り捨て"
          ]
        }
      ],
      "text": "太陽光の出力1kWあたり3万円です．",
      "supplement": [
        "（算定対象）出力の基準：モジュール公称最大出力",
        "（上限）12万円",
        "（端数処理）0.01kW未満切り捨て",
        "（端数処理）1,000円未満切り捨て"
      ],
      "commonSupplement": [],
      "equipment": "太陽光のみ"
    },
    "yamagata-tendo-solar": {
      "prefecture": "06",
      "municipality": "06210",
      "recordId": "scheme-129a4f75c46841581ad9",
      "targetYear": "2026年度",
      "branch": {
        "branch_id": "yamagata-tendo-solar",
        "diagnostic_rule_ids": [
          "yamagata-tendo-solar"
        ],
        "target_equipment": [
          "太陽光パネル",
          "蓄電池＋太陽光パネル"
        ],
        "application_start": [],
        "application_end": [],
        "application_status": "受付中",
        "amount": {
          "display_text": "保存資料では，太陽光は1kW当たり3万円，上限12万円です．金額の基礎となる出力は，要綱ではモジュール公称最大出力とパワーコンディショナ定格出力の小さい方，ウェブ本文ではモジュール公称最大出力のみで，資料間に差があります．太陽光の税，容量・金額の丸めは未確認です．蓄電池は税込対象経費1/10，V2Hは税込対象経費1/6をそれぞれ千円未満切捨て，各上限10万円です．各設備本体・付属機器等の設置に直接必要な経費が対象です．2026年9月4日時点の残予算は現在の残予算を示すものではありません．受付・残予算や条件の変更有無は，保存時点以降未確認です．",
          "evidence_status": "partial"
        },
        "official_conditions": [],
        "gaps": [],
        "evidence_urls": [
          "https://www.city.tendo.yamagata.jp/lifeinfo/gomi/taiyoukouhatsuden-hojokin.html",
          "https://www.city.tendo.yamagata.jp/lifeinfo/gomi/R08taiyoukou.youkou.pdf"
        ],
        "checked_at": "2026-09-28",
        "display_basis": "preparing",
        "migration_status": "pending_review",
        "legacy_municipal_rule_ids": []
      },
      "catalogAmount": {
        "raw_text": "要綱別表のPVはモジュール公称最大出力とPCS定格出力の小さい方×30,000円/kWと120,000円の低い額．本文は太陽電池公称最大出力のみを挙げるため，その差を保持し計算契約は変更しない．PV容量・金額の端数処理は指定資料では未確認．Bは税込対象経費の1/10，V2Hは税込対象経費の1/6をそれぞれ千円未満切捨てし，それぞれ100,000円を上限とする．対象経費は各設備本体・附属機器等の設置に直接必要な経費．Bの税込・千円端数をPVにも一律適用しない．",
        "display_text": "保存資料では，太陽光は1kW当たり3万円，上限12万円です．金額の基礎となる出力は，要綱ではモジュール公称最大出力とパワーコンディショナ定格出力の小さい方，ウェブ本文ではモジュール公称最大出力のみで，資料間に差があります．太陽光の税，容量・金額の丸めは未確認です．蓄電池は税込対象経費1/10，V2Hは税込対象経費1/6をそれぞれ千円未満切捨て，各上限10万円です．各設備本体・付属機器等の設置に直接必要な経費が対象です．2026年9月4日時点の残予算は現在の残予算を示すものではありません．受付・残予算や条件の変更有無は，保存時点以降未確認です．",
        "evidence_status": "partial"
      },
      "rules": [
        {
          "id": "yamagata-tendo-solar",
          "government_level": "municipality",
          "prefecture_code": "06",
          "municipality_code": "06210",
          "program_name": "天童市太陽光発電システム設置支援事業費補助金",
          "housing_ages": [
            "existing",
            "new"
          ],
          "equipment_packages": [
            "solar_only",
            "solar_plus_standard_battery"
          ],
          "application_status": "accepting",
          "diagnostic_scope": {
            "status": "in_scope",
            "in_scope_housing_ages": [
              "existing",
              "new"
            ],
            "excluded_branch_ids": [],
            "basis": "2026-09-04時点残予算12019000円は時点値であり最新残額保証ではない．本文PV公称最大出力との略記に対し要綱はPCSとの小さい方．PV端数未規定，国県併用は未確認． 独立採用済み．入力外条件充足仮定と公式事実を区別する．"
          },
          "expense_scopes": [
            "solar",
            "battery"
          ],
          "conflict_program_ids": [],
          "official_urls": [
            "https://www.city.tendo.yamagata.jp/lifeinfo/gomi/taiyoukouhatsuden-hojokin.html",
            "https://www.city.tendo.yamagata.jp/lifeinfo/gomi/R08taiyoukou.youkou.pdf"
          ],
          "confirmed_at": "2026-09-28",
          "calculation_assumptions": [
            "PV又はPCS出力10kW未満，余剰逆潮流．Bは本制度PV同時設置・SII登録品，V2Hも同時設置・登録品．未使用．",
            "受給開始2026-04-01～2027-03-31．交付決定前着工不可．報告は完了30日以内又は2027-04-10の早い日．敷地1事業，年度1回．",
            "併用不可：本市の他補助金\n上限：PV120000円，B100000円，V2H100000円",
            "入力外適格条件・受付残予算及び併用禁止未確認は既承認の充足仮定，公式受給保証ではない．",
            "単一容量入力を各公式容量基準へ対応させる．モジュール/PCS異容量を確認済みとはしない．",
            "対象費は設備ごとのモデル費用．税区分が明記されない枝は税込対応の既承認仮定．"
          ],
          "required_confirmations": [
            "2026-09-04時点残予算12019000円は時点値であり最新残額保証ではない．本文PV公称最大出力との略記に対し要綱はPCSとの小さい方．PV端数未規定，国県併用は未確認． 独立採用済み．入力外条件充足仮定と公式事実を区別する．",
            "申請時の受付・残予算・製品資格・施工条件を別途確認する．"
          ],
          "source_ids": [
            "yamagata-tendo-solar-source-1",
            "yamagata-tendo-solar-source-2"
          ],
          "machine_rule": "kansai_municipal_formula",
          "fit_compatible": true,
          "formula_components": [
            {
              "scope": "solar",
              "equipment_packages": [
                "solar_only",
                "solar_plus_standard_battery"
              ],
              "formula_type": "capacity_rate",
              "unit_amount_yen": 30000,
              "capacity_source": "solar_kw",
              "capacity_preprocessing": "none",
              "capacity_cap": null,
              "cost_scope": null,
              "cost_tax": null,
              "cap_yen": 120000,
              "rounding_unit_yen": 1,
              "solar_output_max_kw_exclusive": 10
            },
            {
              "scope": "battery",
              "equipment_packages": [
                "solar_plus_standard_battery"
              ],
              "formula_type": "cost_fraction",
              "fraction_numerator": 1,
              "fraction_denominator": 10,
              "cost_scope": "battery",
              "cost_tax": "inclusive",
              "cap_yen": 100000,
              "rounding_unit_yen": 1000,
              "solar_output_max_kw_exclusive": 10
            }
          ]
        }
      ],
      "institutionalSource": "71003122c8ae06de657a1583b3e27e8afb308b54a3a7bc9b802ddebf2d05fcdc",
      "sections": [
        {
          "label": "太陽光",
          "text": "太陽光の出力1kWあたり3万円です．",
          "supplement": [
            "（上限）12万円",
            "（未確認事項）出力の基準（要綱とウェブ本文で不一致）",
            "（未確認事項）太陽光の税区分・出力と補助額の端数処理"
          ]
        },
        {
          "label": "蓄電池",
          "text": "蓄電池本体・付属機器等の設置に直接必要な税込対象経費の10分の1です．",
          "supplement": [
            "（上限）10万円",
            "（端数処理）1,000円未満切り捨て"
          ]
        }
      ],
      "text": "太陽光：太陽光の出力1kWあたり3万円です．\n蓄電池：蓄電池本体・付属機器等の設置に直接必要な税込対象経費の10分の1です．",
      "supplement": [
        "（未確認事項）保存時点以降の受付・残予算・条件の変更有無"
      ],
      "commonSupplement": [
        "（未確認事項）保存時点以降の受付・残予算・条件の変更有無"
      ],
      "equipment": "太陽光・蓄電池"
    },
    "yamagata-takahata-energy": {
      "prefecture": "06",
      "municipality": "06381",
      "recordId": "scheme-a2dd749c6aa6c8a9dfbb",
      "targetYear": "2026年度",
      "branch": {
        "branch_id": "yamagata-takahata-energy",
        "diagnostic_rule_ids": [
          "yamagata-takahata-energy"
        ],
        "target_equipment": [
          "太陽光パネル"
        ],
        "application_start": [
          {
            "branch_id": "application",
            "label": "交付申請",
            "date": "2026-05-19"
          }
        ],
        "application_end": [
          {
            "branch_id": "application",
            "label": "交付申請",
            "date": "2027-02-26"
          }
        ],
        "application_status": "受付中",
        "amount": {
          "display_text": "保存資料では，太陽光はモジュール出力合計とパワーコンディショナ定格出力の小さい方に1kW当たり3万円を掛けます．補助額の上限は10万円又は税抜対象経費の1/10の低い方で，算出額の千円未満を切り捨てます．対象費は機器・機能上必要な付属機器の購入と設置工事費から消費税・地方消費税を除いた額です．出力自体の丸めは未確認です．別設備の木質は税抜対象費1/3・上限5万円，地中熱は1/10・上限10万円で，複数台でも種類ごとに1台分の上限です．保存資料の2025年開始工事に関する条件と，現在の受付・契約時点への適用は確認が必要です．受付・残予算や条件の変更有無は，保存時点以降未確認です．",
          "evidence_status": "partial"
        },
        "official_conditions": [],
        "gaps": [],
        "evidence_urls": [
          "https://www.town.takahata.yamagata.jp/soshiki/2/1492.html",
          "https://www.town.takahata.yamagata.jp/uploaded/attachment/4139.pdf"
        ],
        "checked_at": "2026-09-28",
        "display_basis": "preparing",
        "migration_status": "pending_review",
        "legacy_municipal_rule_ids": []
      },
      "catalogAmount": {
        "raw_text": "PVはモジュール公称最大出力合計又はPCS定格出力の小さい値（kW）×30,000円を算出し，上限は100,000円又は税抜補助対象経費1/10の低い額．算出額の千円未満切捨て．容量自体の端数処理は未確認．対象経費は機器/機能上必要な付属機器購入費及び設置工事費の総額から消費税/地方消費税を除く．木質は税抜対象費1/3上限5万円，地中熱は1/10上限10万円．木質/地中熱は複数台でも種類ごと1台分上限．",
        "display_text": "保存資料では，太陽光はモジュール出力合計とパワーコンディショナ定格出力の小さい方に1kW当たり3万円を掛けます．補助額の上限は10万円又は税抜対象経費の1/10の低い方で，算出額の千円未満を切り捨てます．対象費は機器・機能上必要な付属機器の購入と設置工事費から消費税・地方消費税を除いた額です．出力自体の丸めは未確認です．別設備の木質は税抜対象費1/3・上限5万円，地中熱は1/10・上限10万円で，複数台でも種類ごとに1台分の上限です．保存資料の2025年開始工事に関する条件と，現在の受付・契約時点への適用は確認が必要です．受付・残予算や条件の変更有無は，保存時点以降未確認です．",
        "evidence_status": "partial"
      },
      "rules": [
        {
          "id": "yamagata-takahata-energy",
          "government_level": "municipality",
          "prefecture_code": "06",
          "municipality_code": "06381",
          "program_name": "令和8年度高畠町再生可能エネルギー設備導入事業費補助金",
          "housing_ages": [
            "existing",
            "new"
          ],
          "equipment_packages": [
            "solar_only",
            "solar_plus_standard_battery"
          ],
          "application_status": "accepting",
          "diagnostic_scope": {
            "status": "in_scope",
            "in_scope_housing_ages": [
              "existing",
              "new"
            ],
            "excluded_branch_ids": [],
            "basis": "R8本文・要綱3/5/6条と別表を確認．前年着手許容を誤記扱いしない．容量自体の丸めは未規定で推測追加しない．国県併用・最新残予算未確認．独立採用済み．"
          },
          "expense_scopes": [
            "solar"
          ],
          "conflict_program_ids": [],
          "official_urls": [
            "https://www.town.takahata.yamagata.jp/soshiki/2/1492.html",
            "https://www.town.takahata.yamagata.jp/uploaded/attachment/4139.pdf"
          ],
          "confirmed_at": "2026-09-28",
          "calculation_assumptions": [
            "未使用，PV出力10kW未満．賃貸借・リース・設備更新（高性能買替含む）は不可．地中熱COP3以上等の別設備条件は原文保持．",
            "町内居住又は予定（新築・併用住宅可，集合住宅除外），同居全員非滞納．2025-04-01以降着手～2027-03-31完了．完成後30日又は2027-03-31早い日まで実績．事業所PV・木質枝も原文保持．",
            "併用不可：同一設備に対する高畠町の他補助金\n上限：PV100000円かつ税抜対象費1/10",
            "入力外適格条件・受付残予算及び併用禁止未確認は既承認の充足仮定，公式受給保証ではない．",
            "単一容量入力を各公式容量基準へ対応させる．モジュール/PCS異容量を確認済みとはしない．",
            "対象費は設備ごとのモデル費用．税区分が明記されない枝は税込対応の既承認仮定．"
          ],
          "required_confirmations": [
            "R8本文・要綱3/5/6条と別表を確認．前年着手許容を誤記扱いしない．容量自体の丸めは未規定で推測追加しない．国県併用・最新残予算未確認．独立採用済み．",
            "申請時の受付・残予算・製品資格・施工条件を別途確認する．"
          ],
          "source_ids": [
            "yamagata-takahata-energy-source-1",
            "yamagata-takahata-energy-source-2"
          ],
          "machine_rule": "kansai_municipal_formula",
          "fit_compatible": true,
          "formula_components": [
            {
              "scope": "solar",
              "equipment_packages": [
                "solar_only",
                "solar_plus_standard_battery"
              ],
              "formula_type": "capacity_rate_cost_fraction",
              "unit_amount_yen": 30000,
              "capacity_source": "solar_kw",
              "capacity_preprocessing": "none",
              "capacity_cap": null,
              "cost_scope": "solar",
              "cost_tax": "exclusive",
              "fraction_numerator": 1,
              "fraction_denominator": 10,
              "cap_yen": 100000,
              "rounding_unit_yen": 1000,
              "solar_output_max_kw_exclusive": 10
            }
          ]
        }
      ],
      "institutionalSource": "ad9587e56b33e1e6e28516694bb0b37b86240370b94b08029939afb13d5a97b1",
      "sections": [
        {
          "label": "太陽光",
          "text": "太陽光の対象出力に1kWあたり3万円を掛けた額と太陽光の機器・機能上必要な付属機器の購入・設置工事費の税抜対象経費の10分の1のうち，低い額です．",
          "supplement": [
            "（算定対象）出力の基準：モジュール出力合計とパワーコンディショナ定格出力の小さい方",
            "（上限）10万円",
            "（端数処理）1,000円未満切り捨て",
            "（未確認事項）出力の端数処理",
            "（未確認事項）保存資料の工事開始条件と現在の受付・契約条件の対応",
            "（未確認事項）保存時点以降の受付・残予算・条件の変更有無"
          ]
        }
      ],
      "text": "太陽光の対象出力に1kWあたり3万円を掛けた額と太陽光の機器・機能上必要な付属機器の購入・設置工事費の税抜対象経費の10分の1のうち，低い額です．",
      "supplement": [
        "（算定対象）出力の基準：モジュール出力合計とパワーコンディショナ定格出力の小さい方",
        "（上限）10万円",
        "（端数処理）1,000円未満切り捨て",
        "（未確認事項）出力の端数処理",
        "（未確認事項）保存資料の工事開始条件と現在の受付・契約条件の対応",
        "（未確認事項）保存時点以降の受付・残予算・条件の変更有無"
      ],
      "commonSupplement": [],
      "equipment": "太陽光のみ"
    },
    "fukushima-minamisoma-battery": {
      "prefecture": "07",
      "municipality": "07212",
      "recordId": "scheme-292239191921fd3eb67f",
      "targetYear": "2026年度",
      "branch": {
        "branch_id": "fukushima-minamisoma-battery",
        "diagnostic_rule_ids": [
          "fukushima-minamisoma-battery"
        ],
        "target_equipment": [
          "蓄電池"
        ],
        "application_start": [
          {
            "branch_id": "application",
            "label": "交付申請",
            "date": "2026-04-01"
          }
        ],
        "application_end": [
          {
            "branch_id": "application",
            "label": "交付申請",
            "date": "2027-03-31"
          }
        ],
        "application_status": "受付中",
        "amount": {
          "display_text": "公称最大蓄電容量1kWh当たり10,000円，補助計算上限10kWh・金額上限100,000円で，千円未満を切り捨てます．手引きは8.74kWhをそのまま掛けて87,000円とする一方，記入例は容量の小数第2位以下切捨てと記載し，容量処理の差は未解決です．対象費は蓄電池・変換装置・付属機器の購入・工事費です．様式費用欄は税込ですが，制度全体の税区分・低額費用上限・国県併用細則は未確認です．",
          "evidence_status": "partial"
        },
        "official_conditions": [],
        "gaps": [],
        "evidence_urls": [
          "https://www.city.minamisoma.lg.jp/portal/life/jutaku_tochi_petto/2/5/30780.html",
          "https://www.city.minamisoma.lg.jp/material/files/group/9/youkou_tikudenti.pdf",
          "https://www.city.minamisoma.lg.jp/material/files/group/9/tebiki_tikuden_r2.pdf"
        ],
        "checked_at": "2026-09-28",
        "display_basis": "preparing",
        "migration_status": "pending_review",
        "legacy_municipal_rule_ids": []
      },
      "catalogAmount": {
        "raw_text": "公称最大蓄電容量合計kWh×10,000円，上限10kWh/100,000円，金額1,000円未満切捨て（手引き）．手引き式は容量8.74kWhのまま乗算して87,000円，記入例は容量小数第2位以下切捨て（1桁）と記載する差を原文保持．この単価で最終金額が同値でも容量定義を無断統一しない．対象費はB/電力変換装置/付属機器購入・工事費．様式の費用記入は税込だが制度全体の税区分・低費用時上限規定は未確認．",
        "display_text": "公称最大蓄電容量1kWh当たり10,000円，補助計算上限10kWh・金額上限100,000円で，千円未満を切り捨てます．手引きは8.74kWhをそのまま掛けて87,000円とする一方，記入例は容量の小数第2位以下切捨てと記載し，容量処理の差は未解決です．対象費は蓄電池・変換装置・付属機器の購入・工事費です．様式費用欄は税込ですが，制度全体の税区分・低額費用上限・国県併用細則は未確認です．",
        "evidence_status": "partial"
      },
      "rules": [
        {
          "id": "fukushima-minamisoma-battery",
          "government_level": "municipality",
          "prefecture_code": "07",
          "municipality_code": "07212",
          "program_name": "令和8年度南相馬市住宅用蓄電池導入支援事業補助金",
          "housing_ages": [
            "existing",
            "new"
          ],
          "equipment_packages": [
            "solar_plus_standard_battery"
          ],
          "application_status": "accepting",
          "diagnostic_scope": {
            "status": "in_scope",
            "in_scope_housing_ages": [
              "existing",
              "new"
            ],
            "excluded_branch_ids": [],
            "basis": "制度ルール不明：公称最大容量と診断入力対応未承認．様式は税込設置費．p3原式とp6容量0.1切捨ては千円丸め結果一致．他補助併用未確認． 収集正本へ採用済み（診断算入は別判定）．"
          },
          "expense_scopes": [
            "solar",
            "battery"
          ],
          "conflict_program_ids": [],
          "official_urls": [
            "https://www.city.minamisoma.lg.jp/portal/life/jutaku_tochi_petto/2/5/30780.html",
            "https://www.city.minamisoma.lg.jp/material/files/group/9/youkou_tikudenti.pdf",
            "https://www.city.minamisoma.lg.jp/material/files/group/9/tebiki_tikuden_r2.pdf"
          ],
          "confirmed_at": "2026-09-28",
          "calculation_assumptions": [
            "SII DR登録，新品非リース，余剰配線で低い方のPV出力10kW未満へ接続．公称最大蓄電容量1kWh以上．FIT/非FIT/自家消費すべて可（QA8）．",
            "市民本人居住，非滞納・反社不可・同設備既市補助不可．購入2026-04-01～2029-03-31．設置完了と支払完了（分割は契約）の遅い日から180日以内又は2029-03-31早い日，年度受付も遵守．",
            "併用不可：未確認\n上限：公称最大蓄電容量kWh×10000円，上限100000円（10kWh），1000円未満切捨て．様式では容量0.1単位切捨て．"
          ],
          "required_confirmations": [
            "制度ルール不明：公称最大容量と診断入力対応未承認．様式は税込設置費．p3原式とp6容量0.1切捨ては千円丸め結果一致．他補助併用未確認． 収集正本へ採用済み（診断算入は別判定）．",
            "申請時の受付・残予算・製品資格・施工条件を別途確認する．"
          ],
          "source_ids": [
            "fukushima-minamisoma-battery-source-1",
            "fukushima-minamisoma-battery-source-2",
            "fukushima-minamisoma-battery-source-3"
          ],
          "machine_rule": "kansai_municipal_non_adopted",
          "non_adoption_status": "candidate",
          "non_adoption_reason_code": "calculation_detail_unconfirmed"
        }
      ],
      "institutionalSource": "4f614408d5e518e38dede6cb8d9e514d9c3813382275dbe330fcdff6da91bc38",
      "sections": [
        {
          "label": "蓄電池",
          "text": "蓄電池の容量1kWhあたり1万円です．",
          "supplement": [
            "（算定対象）容量の基準：公称最大蓄電容量",
            "（算定対象）容量：最大10kWh",
            "（上限）10万円",
            "（端数処理）1,000円未満切り捨て",
            "（未確認事項）容量の端数処理（手引きと記入例で不一致）",
            "（未確認事項）制度全体の税区分・低額費用上限・国県併用細則"
          ]
        }
      ],
      "text": "蓄電池の容量1kWhあたり1万円です．",
      "supplement": [
        "（算定対象）容量の基準：公称最大蓄電容量",
        "（算定対象）容量：最大10kWh",
        "（上限）10万円",
        "（端数処理）1,000円未満切り捨て",
        "（未確認事項）容量の端数処理（手引きと記入例で不一致）",
        "（未確認事項）制度全体の税区分・低額費用上限・国県併用細則"
      ],
      "commonSupplement": [],
      "equipment": "蓄電池のみ"
    },
    "fukushima-minamisoma-roof-solar": {
      "prefecture": "07",
      "municipality": "07212",
      "recordId": "scheme-3ca4320d45fddb87d483",
      "targetYear": "2026年度",
      "branch": {
        "branch_id": "fukushima-minamisoma-roof-solar",
        "diagnostic_rule_ids": [
          "fukushima-minamisoma-roof-solar"
        ],
        "target_equipment": [
          "太陽光パネル"
        ],
        "application_start": [
          {
            "branch_id": "application",
            "label": "交付申請",
            "date": "2026-05-13"
          }
        ],
        "application_end": [
          {
            "branch_id": "application",
            "label": "交付申請",
            "date": "2027-01-29"
          }
        ],
        "application_status": "受付中",
        "amount": {
          "display_text": "家庭用屋根太陽光はモジュールのJIS公称最大出力合計とパワーコンディショナー定格出力合計の小さい方を整数kWへ切り捨て，1kW当たり70,000円です．補助出力上限10kW・金額上限700,000円で，金額の千円未満を切り捨てます．10kWは補助上限で，設備10kW未満という適格条件ではありません．購入・設置費が対象で，ハイブリッド変換装置の太陽光寄与費を配分し蓄電池側と二重計上しません．税区分・低額費用調整は未確認です．カーポート等の代替額を自動加算せず，PPA・リースは補助全額の料金控除が必要です．",
          "evidence_status": "partial"
        },
        "official_conditions": [],
        "gaps": [],
        "evidence_urls": [
          "https://www.city.minamisoma.lg.jp/portal/sections/13/1360/13602/3/26075.html",
          "https://www.city.minamisoma.lg.jp/material/files/group/9/youkou_yaneoki.pdf",
          "https://www.city.minamisoma.lg.jp/material/files/group/9/kokuji.pdf"
        ],
        "checked_at": "2026-09-28",
        "display_basis": "preparing",
        "migration_status": "pending_review",
        "branch_label": "屋根・屋上置き型太陽光",
        "legacy_municipal_rule_ids": []
      },
      "catalogAmount": {
        "raw_text": "家庭用屋根PVはモジュールJIS公称最大出力合計とPCS定格出力合計の小さい方を整数kWへ切捨て，70,000円/kW，上限700,000円（補助対象容量10kWまで）．10kWは補助上限で，設備10kW未満という適格条件へ置換しない．補助額1,000円未満切捨て．購入・設置費，ハイブリッドPCSはPV寄与部分をPVへ配分しB側と二重計上しない．費用の税扱い及び低額経費時調整は未確認．",
        "display_text": "家庭用屋根太陽光はモジュールのJIS公称最大出力合計とパワーコンディショナー定格出力合計の小さい方を整数kWへ切り捨て，1kW当たり70,000円です．補助出力上限10kW・金額上限700,000円で，金額の千円未満を切り捨てます．10kWは補助上限で，設備10kW未満という適格条件ではありません．購入・設置費が対象で，ハイブリッド変換装置の太陽光寄与費を配分し蓄電池側と二重計上しません．税区分・低額費用調整は未確認です．カーポート等の代替額を自動加算せず，PPA・リースは補助全額の料金控除が必要です．",
        "evidence_status": "partial"
      },
      "rules": [
        {
          "id": "fukushima-minamisoma-roof-solar",
          "government_level": "municipality",
          "prefecture_code": "07",
          "municipality_code": "07212",
          "program_name": "令和8年度屋根置き太陽光発電等導入拡大事業補助金：太陽光パネル",
          "housing_ages": [
            "existing",
            "new"
          ],
          "equipment_packages": [
            "solar_only",
            "solar_plus_standard_battery"
          ],
          "application_status": "accepting",
          "diagnostic_scope": {
            "status": "in_scope",
            "in_scope_housing_ages": [
              "existing",
              "new"
            ],
            "excluded_branch_ids": [],
            "basis": "新規FIT診断対象外．根拠及び診断外利用の留保：FIT診断非算入候補．入力外条件・対象費税区分未確認． 収集正本へ採用済み（診断算入は別判定）．"
          },
          "expense_scopes": [
            "solar",
            "battery"
          ],
          "conflict_program_ids": [],
          "official_urls": [
            "https://www.city.minamisoma.lg.jp/portal/sections/13/1360/13602/3/26075.html",
            "https://www.city.minamisoma.lg.jp/material/files/group/9/youkou_yaneoki.pdf",
            "https://www.city.minamisoma.lg.jp/material/files/group/9/kokuji.pdf"
          ],
          "confirmed_at": "2026-09-28",
          "calculation_assumptions": [
            "非FIT/FIP，自己託送不可，家庭自家消費30%以上，国別紙2，計測機能，Jクレジット不可．",
            "市民本人居住，非滞納・反社不可・同設備既市補助不可．自己居住予定も可．事前申請．実績は工事完了1か月以内又は2027-02-26早い日（本文），原要綱年度2/28も保持．PPA/リースは全額料金還元・耐用年数使用担保．9/11予算残数はその時点のみ．",
            "併用不可：国負担又は国補助を得て実施する事業不可\n上限：低い方のモジュール/PCS出力kWを整数切捨て×70000円，上限700000円（10kW）．"
          ],
          "required_confirmations": [
            "FIT診断非算入候補．入力外条件・対象費税区分未確認． 収集正本へ採用済み（診断算入は別判定）．",
            "申請時の受付・残予算・製品資格・施工条件を別途確認する．"
          ],
          "source_ids": [
            "fukushima-minamisoma-roof-solar-source-1",
            "fukushima-minamisoma-roof-solar-source-2",
            "fukushima-minamisoma-roof-solar-source-3"
          ],
          "machine_rule": "kansai_municipal_non_adopted",
          "non_adoption_status": "excluded",
          "non_adoption_reason_code": "fit_incompatible",
          "fit_compatible": false
        }
      ],
      "institutionalSource": "bf4cb3ee16fc5d6b31c9081b502ace91d6f27347081521f0009f9504ee68191e",
      "sections": [
        {
          "label": "屋根太陽光",
          "text": "太陽光の出力1kWあたり7万円です．",
          "supplement": [
            "（算定対象）出力の基準：モジュールのJIS公称最大出力合計とパワーコンディショナー定格出力合計の小さい方",
            "（算定対象）出力：最大10kW",
            "（上限）70万円",
            "（端数処理）1kW未満切り捨て",
            "（端数処理）1,000円未満切り捨て",
            "（未確認事項）税区分・低額費用調整"
          ]
        }
      ],
      "text": "太陽光の出力1kWあたり7万円です．",
      "supplement": [
        "（算定対象）出力の基準：モジュールのJIS公称最大出力合計とパワーコンディショナー定格出力合計の小さい方",
        "（算定対象）出力：最大10kW",
        "（上限）70万円",
        "（端数処理）1kW未満切り捨て",
        "（端数処理）1,000円未満切り捨て",
        "（未確認事項）税区分・低額費用調整"
      ],
      "commonSupplement": [],
      "equipment": "太陽光のみ"
    },
    "fukushima-minamisoma-carport": {
      "prefecture": "07",
      "municipality": "07212",
      "recordId": "scheme-3ca4320d45fddb87d483",
      "targetYear": "2026年度",
      "branch": {
        "branch_id": "fukushima-minamisoma-carport",
        "diagnostic_rule_ids": [
          "fukushima-minamisoma-carport"
        ],
        "target_equipment": [
          "太陽光パネル"
        ],
        "application_start": [
          {
            "branch_id": "application",
            "label": "交付申請",
            "date": "2026-05-13"
          }
        ],
        "application_end": [
          {
            "branch_id": "application",
            "label": "交付申請",
            "date": "2027-01-29"
          }
        ],
        "application_status": "受付中",
        "amount": {
          "display_text": "ソーラーカーポートは対象設備導入費用の1/3以内，上限700,000円で，千円未満を切り捨てます．屋根太陽光の容量単価式を用いる額ではありません．税区分・費用配分と国参照要領の全条件は未確認です．屋根太陽光・カーポート・蓄電池の額を自動合算せず，PPA・リースでは補助全額の料金控除が必要です．",
          "evidence_status": "partial"
        },
        "official_conditions": [],
        "gaps": [],
        "evidence_urls": [
          "https://www.city.minamisoma.lg.jp/portal/sections/13/1360/13602/3/26075.html",
          "https://www.city.minamisoma.lg.jp/material/files/group/9/youkou_yaneoki.pdf",
          "https://www.city.minamisoma.lg.jp/material/files/group/9/kokuji.pdf"
        ],
        "checked_at": "2026-09-28",
        "display_basis": "preparing",
        "migration_status": "pending_review",
        "branch_label": "ソーラーカーポート",
        "legacy_municipal_rule_ids": []
      },
      "catalogAmount": {
        "raw_text": "改正告示のソーラーカーポートは対象設備導入費用の1/3以内，上限700,000円，補助額1,000円未満切捨て．屋根PVの70,000円/kW・整数出力式を適用しない．費用の税扱い・配分詳細は未確認．",
        "display_text": "ソーラーカーポートは対象設備導入費用の1/3以内，上限700,000円で，千円未満を切り捨てます．屋根太陽光の容量単価式を用いる額ではありません．税区分・費用配分と国参照要領の全条件は未確認です．屋根太陽光・カーポート・蓄電池の額を自動合算せず，PPA・リースでは補助全額の料金控除が必要です．",
        "evidence_status": "partial"
      },
      "rules": [
        {
          "id": "fukushima-minamisoma-carport",
          "government_level": "municipality",
          "prefecture_code": "07",
          "municipality_code": "07212",
          "program_name": "令和8年度屋根置き太陽光発電等導入拡大事業補助金：ソーラーカーポート",
          "housing_ages": [
            "existing",
            "new"
          ],
          "equipment_packages": [
            "solar_only",
            "solar_plus_standard_battery"
          ],
          "application_status": "accepting",
          "diagnostic_scope": {
            "status": "in_scope",
            "in_scope_housing_ages": [
              "existing",
              "new"
            ],
            "excluded_branch_ids": [],
            "basis": "新規FIT診断対象外．根拠及び診断外利用の留保：FIT診断非算入候補．カーポート費内訳・税区分・個別適格性未確認． 収集正本へ採用済み（診断算入は別判定）．"
          },
          "expense_scopes": [
            "solar",
            "battery"
          ],
          "conflict_program_ids": [],
          "official_urls": [
            "https://www.city.minamisoma.lg.jp/portal/sections/13/1360/13602/3/26075.html",
            "https://www.city.minamisoma.lg.jp/material/files/group/9/youkou_yaneoki.pdf",
            "https://www.city.minamisoma.lg.jp/material/files/group/9/kokuji.pdf"
          ],
          "confirmed_at": "2026-09-28",
          "calculation_assumptions": [
            "非FIT/FIP・自家消費30%以上等の共通条件．改正告示に国カーポート事業参考要件を追加．",
            "市民本人居住，非滞納・反社不可・同設備既市補助不可．自己居住予定も可．事前申請．実績は工事完了1か月以内又は2027-02-26早い日（本文），原要綱年度2/28も保持．PPA/リースは全額料金還元・耐用年数使用担保．9/11予算残数はその時点のみ．",
            "併用不可：国負担又は国補助を得て実施する事業不可\n上限：ソーラーカーポート設置対象経費×1/3以内，上限700000円，1000円未満切捨て．"
          ],
          "required_confirmations": [
            "FIT診断非算入候補．カーポート費内訳・税区分・個別適格性未確認． 収集正本へ採用済み（診断算入は別判定）．",
            "申請時の受付・残予算・製品資格・施工条件を別途確認する．"
          ],
          "source_ids": [
            "fukushima-minamisoma-carport-source-1",
            "fukushima-minamisoma-carport-source-2",
            "fukushima-minamisoma-carport-source-3"
          ],
          "machine_rule": "kansai_municipal_non_adopted",
          "non_adoption_status": "excluded",
          "non_adoption_reason_code": "fit_incompatible",
          "fit_compatible": false
        }
      ],
      "institutionalSource": "6e74573848e05d37e9f347e599b74da3cc5dae12fae2c13b876b6d42e523ed88",
      "sections": [
        {
          "label": "ソーラーカーポート",
          "text": "ソーラーカーポートの対象設備導入費用の3分の1以内です．",
          "supplement": [
            "（上限）70万円",
            "（端数処理）1,000円未満切り捨て",
            "（未確認事項）税区分・費用配分・国参照要領の全条件"
          ]
        }
      ],
      "text": "ソーラーカーポートの対象設備導入費用の3分の1以内です．",
      "supplement": [
        "（上限）70万円",
        "（端数処理）1,000円未満切り捨て",
        "（未確認事項）税区分・費用配分・国参照要領の全条件"
      ],
      "commonSupplement": [],
      "equipment": "太陽光のみ"
    },
    "fukushima-nishiaizu-solar": {
      "prefecture": "07",
      "municipality": "07405",
      "recordId": "scheme-c7cc2c21bda687c42ac3",
      "targetYear": "2026年度",
      "branch": {
        "branch_id": "fukushima-nishiaizu-solar",
        "diagnostic_rule_ids": [
          "fukushima-nishiaizu-solar"
        ],
        "target_equipment": [
          "太陽光パネル"
        ],
        "application_start": [
          {
            "branch_id": "application",
            "label": "交付申請",
            "date": "2022-04-01"
          }
        ],
        "application_end": [
          {
            "branch_id": "application",
            "label": "交付申請",
            "date": ""
          }
        ],
        "application_status": "受付中",
        "amount": {
          "display_text": "太陽光は発電容量1kW当たり30,000円，上限120,000円で，千円未満を切り捨てます．モジュール・変換装置の出力基準，容量端数，税区分と低額費用時上限は未確認です．金額上限を機器の適格出力上限とは扱いません．蓄電池とV2Hは一方のみで，他制度併用の可否は未確認です．",
          "evidence_status": "partial"
        },
        "official_conditions": [],
        "gaps": [],
        "evidence_urls": [
          "https://www.town.nishiaizu.fukushima.jp/soshiki/2/20.html",
          "https://www.town.nishiaizu.fukushima.jp/uploaded/attachment/8277.pdf"
        ],
        "checked_at": "2026-09-28",
        "display_basis": "preparing",
        "migration_status": "pending_review",
        "legacy_municipal_rule_ids": []
      },
      "catalogAmount": {
        "raw_text": "発電容量1kW当たり30,000円，上限120,000円．容量のモジュール/PCS基準は未確認．要綱第2条により補助金額の千円未満端数は切捨て．容量端数・税・対象費が補助額未満の場合の扱いは未確認．上限から機器容量の適格上限を推定しない．",
        "display_text": "太陽光は発電容量1kW当たり30,000円，上限120,000円で，千円未満を切り捨てます．モジュール・変換装置の出力基準，容量端数，税区分と低額費用時上限は未確認です．金額上限を機器の適格出力上限とは扱いません．蓄電池とV2Hは一方のみで，他制度併用の可否は未確認です．",
        "evidence_status": "partial"
      },
      "rules": [
        {
          "id": "fukushima-nishiaizu-solar",
          "government_level": "municipality",
          "prefecture_code": "07",
          "municipality_code": "07405",
          "program_name": "西会津町再生可能エネルギー設備等設置事業補助金：太陽光パネル",
          "housing_ages": [
            "existing",
            "new"
          ],
          "equipment_packages": [
            "solar_only",
            "solar_plus_standard_battery"
          ],
          "application_status": "accepting",
          "diagnostic_scope": {
            "status": "in_scope",
            "in_scope_housing_ages": [
              "existing",
              "new"
            ],
            "excluded_branch_ids": [],
            "basis": "2026-04-01更新の通常申請案内，2022-04-01から受付と記載，終了告知なしとして受付中．対象費・税・発電容量定義と入力の対応は独立採用時確認．独立採用済み．"
          },
          "expense_scopes": [
            "solar"
          ],
          "conflict_program_ids": [],
          "official_urls": [
            "https://www.town.nishiaizu.fukushima.jp/soshiki/2/20.html",
            "https://www.town.nishiaizu.fukushima.jp/uploaded/attachment/8277.pdf"
          ],
          "confirmed_at": "2026-09-28",
          "calculation_assumptions": [
            "住宅・事業所等の屋根等，電力会社と系統連系に伴う電力需給契約．",
            "町内住所又は住民となる予定，町内法人も対象．施設所有又は書面設置承諾，世帯非滞納．設備ごと1施設1回．着手前申請，完了14日以内報告．本人住宅枝を診断対象とし他の原適格範囲も保持．",
            "併用不可：制度間未確認．蓄電池とV2Hは一方のみ．\n上限：PV120000円．",
            "入力外適格条件・受付残予算及び併用禁止未確認は既承認の充足仮定，公式受給保証ではない．",
            "単一容量入力を各公式容量基準へ対応させる．モジュール/PCS異容量を確認済みとはしない．",
            "対象費は設備ごとのモデル費用．税区分が明記されない枝は税込対応の既承認仮定．"
          ],
          "required_confirmations": [
            "2026-04-01更新の通常申請案内，2022-04-01から受付と記載，終了告知なしとして受付中．対象費・税・発電容量定義と入力の対応は独立採用時確認．独立採用済み．",
            "申請時の受付・残予算・製品資格・施工条件を別途確認する．"
          ],
          "source_ids": [
            "fukushima-nishiaizu-solar-source-1",
            "fukushima-nishiaizu-solar-source-2"
          ],
          "machine_rule": "kansai_municipal_formula",
          "fit_compatible": true,
          "formula_components": [
            {
              "scope": "solar",
              "equipment_packages": [
                "solar_only",
                "solar_plus_standard_battery"
              ],
              "formula_type": "capacity_rate",
              "unit_amount_yen": 30000,
              "capacity_source": "solar_kw",
              "capacity_preprocessing": "none",
              "capacity_cap": null,
              "cost_scope": "solar",
              "cost_tax": "approved_assumption_inclusive",
              "cap_yen": 120000,
              "rounding_unit_yen": 1000
            }
          ]
        }
      ],
      "institutionalSource": "bd3937cadbb473b781a1ad44d12d5a90ce264f36732ef0c6e61c6c4eb1b7f99c",
      "sections": [
        {
          "label": "太陽光",
          "text": "太陽光の出力1kWあたり3万円です．",
          "supplement": [
            "（算定対象）出力の基準：発電容量",
            "（上限）12万円",
            "（端数処理）1,000円未満切り捨て"
          ]
        }
      ],
      "text": "太陽光の出力1kWあたり3万円です．",
      "supplement": [
        "（算定対象）出力の基準：発電容量",
        "（上限）12万円",
        "（端数処理）1,000円未満切り捨て"
      ],
      "commonSupplement": [
        "（未確認事項）モジュール・変換装置の出力基準，容量端数，税区分と低額費用時上限",
        "（未確認事項）他制度併用の可否"
      ],
      "equipment": "太陽光",
      "savedSourceDetails": true
    },
    "fukushima-yugawa-solar": {
      "prefecture": "07",
      "municipality": "07422",
      "recordId": "scheme-13206bfc3f26ee99aa19",
      "targetYear": "2026年度",
      "branch": {
        "branch_id": "fukushima-yugawa-solar",
        "diagnostic_rule_ids": [
          "fukushima-yugawa-solar"
        ],
        "target_equipment": [
          "太陽光パネル"
        ],
        "application_start": [
          {
            "branch_id": "application",
            "label": "交付申請",
            "date": ""
          }
        ],
        "application_end": [
          {
            "branch_id": "application",
            "label": "交付申請",
            "date": ""
          }
        ],
        "application_status": "受付中",
        "amount": {
          "display_text": "太陽光は対象システム最大出力について，原文の「小数点以下2桁未満四捨五入」で小数2桁とし，1kW当たり24,000円です．補助計算に用いる量の上限は5kWです．金額上限は120,000円です．補助額の千円未満を切り捨てます．5kWは補助計算上限で，機器適格条件の太陽電池最大出力10kW未満とは別です．適格条件の丸め適用，税区分・低額費用上限・変換装置との比較基準は未確認です．",
          "evidence_status": "partial"
        },
        "official_conditions": [],
        "gaps": [],
        "evidence_urls": [
          "https://www.vill.yugawa.fukushima.jp/site/kurashi-top/taiyoukouatudennhozyo.html",
          "https://www.vill.yugawa.fukushima.jp/uploaded/attachment/1564.pdf"
        ],
        "checked_at": "2026-09-28",
        "display_basis": "preparing",
        "migration_status": "pending_review",
        "legacy_municipal_rule_ids": []
      },
      "catalogAmount": {
        "raw_text": "対象システム最大出力（kW）を小数点以下2桁未満四捨五入して小数2桁とし，5kWを上限として24,000円を乗じる．千円未満端数切捨て，上限120,000円．5kWは補助計算上限で，機器適格条件は太陽電池最大出力10kW未満．算式と適格条件の丸め適用を同一視しない．税・低額対象費上限・PCSとの比較基準は未確認．",
        "display_text": "太陽光は対象システム最大出力について，原文の「小数点以下2桁未満四捨五入」で小数2桁とし，1kW当たり24,000円です．補助計算に用いる量の上限は5kWです．金額上限は120,000円です．補助額の千円未満を切り捨てます．5kWは補助計算上限で，機器適格条件の太陽電池最大出力10kW未満とは別です．適格条件の丸め適用，税区分・低額費用上限・変換装置との比較基準は未確認です．",
        "evidence_status": "partial"
      },
      "rules": [
        {
          "id": "fukushima-yugawa-solar",
          "government_level": "municipality",
          "prefecture_code": "07",
          "municipality_code": "07422",
          "program_name": "湯川村住宅用太陽光発電システム設置費補助金",
          "housing_ages": [
            "existing",
            "new"
          ],
          "equipment_packages": [
            "solar_only",
            "solar_plus_standard_battery"
          ],
          "application_status": "accepting",
          "diagnostic_scope": {
            "status": "in_scope",
            "in_scope_housing_ages": [
              "existing",
              "new"
            ],
            "excluded_branch_ids": [],
            "basis": "現行通常申請案内に事業実施と記載，終了告知なしとして受付中．年度区切り・募集開始日・残予算未確認．容量対応，費用税区分，併用は独立採用時確認．本人所有居住は診断範囲であり所有限定の確認を意味しない．独立採用済み．"
          },
          "expense_scopes": [
            "solar"
          ],
          "conflict_program_ids": [],
          "official_urls": [
            "https://www.vill.yugawa.fukushima.jp/site/kurashi-top/taiyoukouatudennhozyo.html",
            "https://www.vill.yugawa.fukushima.jp/uploaded/attachment/1564.pdf"
          ],
          "confirmed_at": "2026-09-28",
          "calculation_assumptions": [
            "住宅屋根等，新品，太陽電池最大出力10kW未満，低圧逆潮流連系．",
            "自己居住又は予定の村内住宅（併用住宅含む），電力受給契約，村内居住者は村税滞納なし．設置完了後1年以内に申請．",
            "併用不可：未確認\n上限：5kW・120000円．",
            "入力外適格条件・受付残予算及び併用禁止未確認は既承認の充足仮定，公式受給保証ではない．",
            "単一容量入力を各公式容量基準へ対応させる．モジュール/PCS異容量を確認済みとはしない．",
            "対象費は設備ごとのモデル費用．税区分が明記されない枝は税込対応の既承認仮定．"
          ],
          "required_confirmations": [
            "現行通常申請案内に事業実施と記載，終了告知なしとして受付中．年度区切り・募集開始日・残予算未確認．容量対応，費用税区分，併用は独立採用時確認．本人所有居住は診断範囲であり所有限定の確認を意味しない．独立採用済み．",
            "申請時の受付・残予算・製品資格・施工条件を別途確認する．"
          ],
          "source_ids": [
            "fukushima-yugawa-solar-source-1",
            "fukushima-yugawa-solar-source-2"
          ],
          "machine_rule": "kansai_municipal_formula",
          "fit_compatible": true,
          "formula_components": [
            {
              "scope": "solar",
              "equipment_packages": [
                "solar_only",
                "solar_plus_standard_battery"
              ],
              "formula_type": "capacity_rate",
              "unit_amount_yen": 24000,
              "capacity_source": "solar_kw",
              "capacity_preprocessing": "round_0_01",
              "capacity_cap": 5,
              "cost_scope": "solar",
              "cost_tax": "approved_assumption_inclusive",
              "cap_yen": 120000,
              "rounding_unit_yen": 1000,
              "solar_output_max_kw_exclusive": 10
            }
          ]
        }
      ],
      "institutionalSource": "3fee617587ec7e5c396da8d4b67dfefd5c18e961c2e2b8f063af52df9da51425",
      "sections": [
        {
          "label": "太陽光",
          "text": "太陽光の出力1kWあたり2万4,000円です．",
          "supplement": [
            "（算定対象）出力の基準：対象システム最大出力",
            "（算定対象）出力：最大5kW",
            "（上限）12万円",
            "（端数処理）0.01kW未満四捨五入",
            "（端数処理）1,000円未満切り捨て",
            "（未確認事項）適格条件の丸め適用・税区分・低額費用上限・変換装置との比較基準"
          ]
        }
      ],
      "text": "太陽光の出力1kWあたり2万4,000円です．",
      "supplement": [
        "（算定対象）出力の基準：対象システム最大出力",
        "（算定対象）出力：最大5kW",
        "（上限）12万円",
        "（端数処理）0.01kW未満四捨五入",
        "（端数処理）1,000円未満切り捨て",
        "（未確認事項）適格条件の丸め適用・税区分・低額費用上限・変換装置との比較基準"
      ],
      "commonSupplement": [],
      "equipment": "太陽光のみ"
    },
    "fukushima-yanaizu-solar": {
      "prefecture": "07",
      "municipality": "07423",
      "recordId": "scheme-560513438a3f8f1f60fe",
      "targetYear": "2026年度",
      "branch": {
        "branch_id": "fukushima-yanaizu-solar",
        "diagnostic_rule_ids": [
          "fukushima-yanaizu-solar"
        ],
        "target_equipment": [
          "太陽光パネル"
        ],
        "application_start": [
          {
            "branch_id": "application",
            "label": "交付申請",
            "date": "2026-04-01"
          }
        ],
        "application_end": [
          {
            "branch_id": "application",
            "label": "交付申請",
            "date": "2026-12-23"
          }
        ],
        "application_status": "受付中",
        "amount": {
          "display_text": "太陽光は発電容量1kW当たり60,000円，上限240,000円で，千円未満を切り捨てます．容量端数，モジュール・変換装置の出力基準，税区分と低額費用上限は未確認です．金額上限を機器の適格出力上限とは扱いません．",
          "evidence_status": "partial"
        },
        "official_conditions": [],
        "gaps": [],
        "evidence_urls": [
          "https://www.town.yanaizu.fukushima.jp/docs/2025041000015/",
          "https://www.town.yanaizu.fukushima.jp/docs/2025041000015/file_contents/R8_newenehojo.pdf"
        ],
        "checked_at": "2026-09-28",
        "display_basis": "preparing",
        "migration_status": "pending_review",
        "legacy_municipal_rule_ids": []
      },
      "catalogAmount": {
        "raw_text": "太陽光発電60,000円/kW，上限240,000円，金額千円未満切捨て．容量端数，モジュール/PCS基準，消費税，低額対象費上限は未確認．補助上限から設備適格容量4kW以下を推定しない．",
        "display_text": "太陽光は発電容量1kW当たり60,000円，上限240,000円で，千円未満を切り捨てます．容量端数，モジュール・変換装置の出力基準，税区分と低額費用上限は未確認です．金額上限を機器の適格出力上限とは扱いません．",
        "evidence_status": "partial"
      },
      "rules": [
        {
          "id": "fukushima-yanaizu-solar",
          "government_level": "municipality",
          "prefecture_code": "07",
          "municipality_code": "07423",
          "program_name": "柳津町住宅用新エネルギー設備等設置費補助金：太陽光",
          "housing_ages": [
            "existing",
            "new"
          ],
          "equipment_packages": [
            "solar_only",
            "solar_plus_standard_battery"
          ],
          "application_status": "accepting",
          "diagnostic_scope": {
            "status": "in_scope",
            "in_scope_housing_ages": [
              "existing",
              "new"
            ],
            "excluded_branch_ids": [],
            "basis": "R8募集概要でPV当初1件・4/1から12/23を確認．本文は令和7年度と残存するが添付R8資料で現年度条件を確認．制度ルール不明：全要綱未取得のため容量基準/前処理の有無・費用税の詳細を候補保持．残予算未確認．未採用draft．"
          },
          "expense_scopes": [
            "solar",
            "battery"
          ],
          "conflict_program_ids": [],
          "official_urls": [
            "https://www.town.yanaizu.fukushima.jp/docs/2025041000015/",
            "https://www.town.yanaizu.fukushima.jp/docs/2025041000015/file_contents/R8_newenehojo.pdf"
          ],
          "confirmed_at": "2026-09-28",
          "calculation_assumptions": [
            "住宅屋根等，新品，電力会社と系統連系及び電力需給契約．募集概要に10kW制限記載なし．",
            "自己居住又は予定町内住宅（併用含む），町税等未納なし．交付決定前着工不可．既築原則3か月・新築6か月又は年度3/10早い方完了．実績報告は完了14日又は年度3/23早い方．設置住所の住民票添付．",
            "併用不可：町内他制度は未確認．本文に福島県補助金との併用可と明記．\n上限：240000円．"
          ],
          "required_confirmations": [
            "R8募集概要でPV当初1件・4/1から12/23を確認．本文は令和7年度と残存するが添付R8資料で現年度条件を確認．制度ルール不明：全要綱未取得のため容量基準/前処理の有無・費用税の詳細を候補保持．残予算未確認．未採用draft．",
            "申請時の受付・残予算・製品資格・施工条件を別途確認する．"
          ],
          "source_ids": [
            "fukushima-yanaizu-solar-source-1",
            "fukushima-yanaizu-solar-source-2"
          ],
          "machine_rule": "kansai_municipal_non_adopted",
          "non_adoption_status": "candidate",
          "non_adoption_reason_code": "calculation_detail_unconfirmed"
        }
      ],
      "institutionalSource": "939fc54d75f247b7421ad1864e19161eec2b5a8141176abca288f92a2081a519",
      "sections": [
        {
          "label": "太陽光",
          "text": "太陽光の出力1kWあたり6万円です．",
          "supplement": [
            "（算定対象）出力の基準：発電容量",
            "（上限）24万円",
            "（端数処理）1,000円未満切り捨て"
          ]
        }
      ],
      "text": "太陽光の出力1kWあたり6万円です．",
      "supplement": [
        "（算定対象）出力の基準：発電容量",
        "（上限）24万円",
        "（端数処理）1,000円未満切り捨て"
      ],
      "commonSupplement": [
        "（未確認事項）容量端数，モジュール・変換装置の出力基準，税区分と低額費用上限"
      ],
      "equipment": "太陽光",
      "savedSourceDetails": true
    },
    "fukushima-hirono-solar-fit": {
      "prefecture": "07",
      "municipality": "07541",
      "recordId": "scheme-5b699edbfe9a4738c292",
      "targetYear": "2026年度",
      "branch": {
        "branch_id": "fukushima-hirono-solar-fit",
        "diagnostic_rule_ids": [
          "fukushima-hirono-solar-fit"
        ],
        "target_equipment": [
          "太陽光パネル"
        ],
        "application_start": [
          {
            "branch_id": "application",
            "label": "交付申請",
            "date": ""
          }
        ],
        "application_end": [
          {
            "branch_id": "application",
            "label": "交付申請",
            "date": "2027-03-15"
          }
        ],
        "application_status": "受付中",
        "amount": {
          "display_text": "FITの太陽光はモジュール公称最大出力合計とパワーコンディショナー定格出力の小さい方の小数点以下を切り捨て，1kW当たり40,000円，上限160,000円で，金額の千円未満を切り捨てます．設置・購入費及び別表の対象費目に従います．低額費用時の処理と税区分は未確認です．蓄電池とV2Hは一方だけの申請で，共用変換装置については太陽光費用へ含める一方で補助対象から除くという別表注記の詳細適用は未確認です．",
          "evidence_status": "partial"
        },
        "official_conditions": [],
        "gaps": [],
        "evidence_urls": [
          "https://www.town.hirono.fukushima.jp/kurashi/sumai/1001540/1001833.html",
          "https://www.town.hirono.fukushima.jp/_res/projects/default_project/_page_/001/001/833/06_outline.pdf"
        ],
        "checked_at": "2026-09-28",
        "display_basis": "preparing",
        "migration_status": "pending_review",
        "legacy_municipal_rule_ids": []
      },
      "catalogAmount": {
        "raw_text": "モジュール公称最大出力合計又はPCS定格出力の低い方kWの小数点以下切捨て×40,000円，上限160,000円．第5条設置購入費と別表対象項目に従い，金額千円未満切捨て．低額費用時処理/税区分未確認．",
        "display_text": "FITの太陽光はモジュール公称最大出力合計とパワーコンディショナー定格出力の小さい方の小数点以下を切り捨て，1kW当たり40,000円，上限160,000円で，金額の千円未満を切り捨てます．設置・購入費及び別表の対象費目に従います．低額費用時の処理と税区分は未確認です．蓄電池とV2Hは一方だけの申請で，共用変換装置については太陽光費用へ含める一方で補助対象から除くという別表注記の詳細適用は未確認です．",
        "evidence_status": "partial"
      },
      "rules": [
        {
          "id": "fukushima-hirono-solar-fit",
          "government_level": "municipality",
          "prefecture_code": "07",
          "municipality_code": "07541",
          "program_name": "広野町住宅等用新エネルギーシステム設置費補助金：太陽光FIT",
          "housing_ages": [
            "existing",
            "new"
          ],
          "equipment_packages": [
            "solar_only",
            "solar_plus_standard_battery"
          ],
          "application_status": "accepting",
          "diagnostic_scope": {
            "status": "in_scope",
            "in_scope_housing_ages": [
              "existing",
              "new"
            ],
            "excluded_branch_ids": [],
            "basis": "制度ルール不明：案内はモジュール容量，要綱はPCSとの小さい方．資料優先順位の共通方針（同順位は募集本文優先）に従う採否と代表容量対応・共用PCS費用除外を独立採用で確認． 未採用draft．公式抽出本文確認，PDF目視・原本byte SHA未確認．"
          },
          "expense_scopes": [
            "solar",
            "battery"
          ],
          "conflict_program_ids": [],
          "official_urls": [
            "https://www.town.hirono.fukushima.jp/kurashi/sumai/1001540/1001833.html",
            "https://www.town.hirono.fukushima.jp/_res/projects/default_project/_page_/001/001/833/06_outline.pdf"
          ],
          "confirmed_at": "2026-09-28",
          "calculation_assumptions": [
            "町住所・非滞納・反社除外，設備費自己負担・所有，住宅所有者承諾，自己居住/予定・併用住宅可，未使用，PPA/リース除外．対象設備ごと世帯又は共同住宅設置者1回．設置後申請，予算先着．受給開始日又は非FIT領収日は設置年度4/1から3/15．モジュール又はPCS10kW未満，低圧逆潮流連系・品質認証．非FITは自家消費30%以上・FIT認定なし・耐用期間中Jクレジット登録なし．共用PCSはPV経費算定に含めるが同補助対象から除外する原文を保持．",
            "併用不可：明示禁止未確認．\n上限：設備別原式参照．"
          ],
          "required_confirmations": [
            "制度ルール不明：案内はモジュール容量，要綱はPCSとの小さい方．資料優先順位の共通方針（同順位は募集本文優先）に従う採否と代表容量対応・共用PCS費用除外を独立採用で確認． 未採用draft．公式抽出本文確認，PDF目視・原本byte SHA未確認．",
            "申請時の受付・残予算・製品資格・施工条件を別途確認する．"
          ],
          "source_ids": [
            "fukushima-hirono-solar-fit-source-1",
            "fukushima-hirono-solar-fit-source-2"
          ],
          "machine_rule": "kansai_municipal_non_adopted",
          "non_adoption_status": "candidate",
          "non_adoption_reason_code": "calculation_detail_unconfirmed"
        }
      ],
      "institutionalSource": "04182af96459e7411025340bfe3faa6bd8f25ecaf04fcce2e9a5724201e1436f",
      "sections": [
        {
          "label": "太陽光（FIT）",
          "text": "太陽光の出力1kWあたり4万円です．",
          "supplement": [
            "（算定対象）出力の基準：モジュール公称最大出力合計とパワーコンディショナー定格出力の小さい方",
            "（上限）16万円",
            "（端数処理）1kW未満切り捨て",
            "（端数処理）1,000円未満切り捨て",
            "（未確認事項）低額費用の処理・税区分・共用変換装置の費用範囲"
          ]
        }
      ],
      "text": "太陽光の出力1kWあたり4万円です．",
      "supplement": [
        "（算定対象）出力の基準：モジュール公称最大出力合計とパワーコンディショナー定格出力の小さい方",
        "（上限）16万円",
        "（端数処理）1kW未満切り捨て",
        "（端数処理）1,000円未満切り捨て",
        "（未確認事項）低額費用の処理・税区分・共用変換装置の費用範囲"
      ],
      "commonSupplement": [],
      "equipment": "太陽光のみ"
    },
    "fukushima-hirono-solar-nonfit": {
      "prefecture": "07",
      "municipality": "07541",
      "recordId": "scheme-05c043d42e16a8636933",
      "targetYear": "2026年度",
      "branch": {
        "branch_id": "fukushima-hirono-solar-nonfit",
        "diagnostic_rule_ids": [
          "fukushima-hirono-solar-nonfit"
        ],
        "target_equipment": [
          "太陽光パネル"
        ],
        "application_start": [
          {
            "branch_id": "application",
            "label": "交付申請",
            "date": ""
          }
        ],
        "application_end": [
          {
            "branch_id": "application",
            "label": "交付申請",
            "date": "2027-03-15"
          }
        ],
        "application_status": "受付中",
        "amount": {
          "display_text": "非FITの太陽光はモジュール公称最大出力合計とパワーコンディショナー定格出力の小さい方の小数点以下を切り捨て，1kW当たり70,000円，上限420,000円で，金額の千円未満を切り捨てます．設置・購入費及び別表の対象費目に従います．低額費用時の処理と税区分は未確認です．蓄電池とV2Hは一方だけの申請で，共用変換装置については太陽光費用へ含める一方で補助対象から除くという別表注記の詳細適用は未確認です．",
          "evidence_status": "partial"
        },
        "official_conditions": [],
        "gaps": [],
        "evidence_urls": [
          "https://www.town.hirono.fukushima.jp/kurashi/sumai/1001540/1001833.html",
          "https://www.town.hirono.fukushima.jp/_res/projects/default_project/_page_/001/001/833/06_outline.pdf"
        ],
        "checked_at": "2026-09-28",
        "display_basis": "preparing",
        "migration_status": "pending_review",
        "legacy_municipal_rule_ids": []
      },
      "catalogAmount": {
        "raw_text": "モジュール公称最大出力合計又はPCS定格出力の低い方kWの小数点以下切捨て×70,000円，上限420,000円．第5条設置購入費と別表対象項目に従い，金額千円未満切捨て．低額費用時処理/税区分未確認．",
        "display_text": "非FITの太陽光はモジュール公称最大出力合計とパワーコンディショナー定格出力の小さい方の小数点以下を切り捨て，1kW当たり70,000円，上限420,000円で，金額の千円未満を切り捨てます．設置・購入費及び別表の対象費目に従います．低額費用時の処理と税区分は未確認です．蓄電池とV2Hは一方だけの申請で，共用変換装置については太陽光費用へ含める一方で補助対象から除くという別表注記の詳細適用は未確認です．",
        "evidence_status": "partial"
      },
      "rules": [
        {
          "id": "fukushima-hirono-solar-nonfit",
          "government_level": "municipality",
          "prefecture_code": "07",
          "municipality_code": "07541",
          "program_name": "広野町住宅等用新エネルギーシステム設置費補助金：太陽光非FIT",
          "housing_ages": [
            "existing",
            "new"
          ],
          "equipment_packages": [
            "solar_only",
            "solar_plus_standard_battery"
          ],
          "application_status": "accepting",
          "diagnostic_scope": {
            "status": "in_scope",
            "in_scope_housing_ages": [
              "existing",
              "new"
            ],
            "excluded_branch_ids": [],
            "basis": "新規FIT診断対象外．根拠及び診断外利用の留保：制度ルール不明：新規FIT診断対象外．非FIT経路の30%自家消費とJクレジット登録禁止を保持．診断外容量・費用対応未採用． 未採用draft．公式抽出本文確認，PDF目視・原本byte SHA未確認． 主理由は新規FIT経路対象外．制度ルール不明は診断外利用時の留保に限る．"
          },
          "expense_scopes": [
            "solar",
            "battery"
          ],
          "conflict_program_ids": [],
          "official_urls": [
            "https://www.town.hirono.fukushima.jp/kurashi/sumai/1001540/1001833.html",
            "https://www.town.hirono.fukushima.jp/_res/projects/default_project/_page_/001/001/833/06_outline.pdf"
          ],
          "confirmed_at": "2026-09-28",
          "calculation_assumptions": [
            "町住所・非滞納・反社除外，設備費自己負担・所有，住宅所有者承諾，自己居住/予定・併用住宅可，未使用，PPA/リース除外．対象設備ごと世帯又は共同住宅設置者1回．設置後申請，予算先着．受給開始日又は非FIT領収日は設置年度4/1から3/15．モジュール又はPCS10kW未満，低圧逆潮流連系・品質認証．非FITは自家消費30%以上・FIT認定なし・耐用期間中Jクレジット登録なし．共用PCSはPV経費算定に含めるが同補助対象から除外する原文を保持．",
            "併用不可：明示禁止未確認．\n上限：設備別原式参照．"
          ],
          "required_confirmations": [
            "制度ルール不明：新規FIT診断対象外．非FIT経路の30%自家消費とJクレジット登録禁止を保持．診断外容量・費用対応未採用． 未採用draft．公式抽出本文確認，PDF目視・原本byte SHA未確認． 主理由は新規FIT経路対象外．制度ルール不明は診断外利用時の留保に限る．",
            "申請時の受付・残予算・製品資格・施工条件を別途確認する．"
          ],
          "source_ids": [
            "fukushima-hirono-solar-nonfit-source-1",
            "fukushima-hirono-solar-nonfit-source-2"
          ],
          "machine_rule": "kansai_municipal_non_adopted",
          "non_adoption_status": "excluded",
          "non_adoption_reason_code": "fit_incompatible",
          "fit_compatible": false
        }
      ],
      "institutionalSource": "9486961628fe18e0ca0bf957e508b4fd415e78ebd5221366b5a9864fd046709c",
      "sections": [
        {
          "label": "太陽光（非FIT）",
          "text": "太陽光の出力1kWあたり7万円です．",
          "supplement": [
            "（算定対象）出力の基準：モジュール公称最大出力合計とパワーコンディショナー定格出力の小さい方",
            "（上限）42万円",
            "（端数処理）1kW未満切り捨て",
            "（端数処理）1,000円未満切り捨て",
            "（未確認事項）低額費用の処理・税区分・共用変換装置の費用範囲"
          ]
        }
      ],
      "text": "太陽光の出力1kWあたり7万円です．",
      "supplement": [
        "（算定対象）出力の基準：モジュール公称最大出力合計とパワーコンディショナー定格出力の小さい方",
        "（上限）42万円",
        "（端数処理）1kW未満切り捨て",
        "（端数処理）1,000円未満切り捨て",
        "（未確認事項）低額費用の処理・税区分・共用変換装置の費用範囲"
      ],
      "commonSupplement": [],
      "equipment": "太陽光のみ"
    },
    "fukushima-hirono-battery": {
      "prefecture": "07",
      "municipality": "07541",
      "recordId": "scheme-cfb2e4867a59a7cd7df3",
      "targetYear": "2026年度",
      "branch": {
        "branch_id": "fukushima-hirono-battery",
        "diagnostic_rule_ids": [
          "fukushima-hirono-battery"
        ],
        "target_equipment": [
          "蓄電池"
        ],
        "application_start": [
          {
            "branch_id": "application",
            "label": "交付申請",
            "date": ""
          }
        ],
        "application_end": [
          {
            "branch_id": "application",
            "label": "交付申請",
            "date": "2027-03-15"
          }
        ],
        "application_status": "受付中",
        "amount": {
          "display_text": "蓄電池は蓄電容量の小数点以下を切り捨て，1kWh当たり40,000円，上限200,000円で，金額の千円未満を切り捨てます．設置・購入費及び別表の対象費目に従います．低額費用時の処理と税区分は未確認です．蓄電池とV2Hは一方だけの申請で，共用変換装置については太陽光費用へ含める一方で補助対象から除くという別表注記の詳細適用は未確認です．",
          "evidence_status": "partial"
        },
        "official_conditions": [],
        "gaps": [],
        "evidence_urls": [
          "https://www.town.hirono.fukushima.jp/kurashi/sumai/1001540/1001833.html",
          "https://www.town.hirono.fukushima.jp/_res/projects/default_project/_page_/001/001/833/06_outline.pdf"
        ],
        "checked_at": "2026-09-28",
        "display_basis": "preparing",
        "migration_status": "pending_review",
        "legacy_municipal_rule_ids": []
      },
      "catalogAmount": {
        "raw_text": "B蓄電容量kWhの小数点以下切捨て×40,000円，上限200,000円．第5条設置購入費と別表対象項目に従い，金額千円未満切捨て．低額費用時処理/税区分未確認．",
        "display_text": "蓄電池は蓄電容量の小数点以下を切り捨て，1kWh当たり40,000円，上限200,000円で，金額の千円未満を切り捨てます．設置・購入費及び別表の対象費目に従います．低額費用時の処理と税区分は未確認です．蓄電池とV2Hは一方だけの申請で，共用変換装置については太陽光費用へ含める一方で補助対象から除くという別表注記の詳細適用は未確認です．",
        "evidence_status": "partial"
      },
      "rules": [
        {
          "id": "fukushima-hirono-battery",
          "government_level": "municipality",
          "prefecture_code": "07",
          "municipality_code": "07541",
          "program_name": "広野町住宅等用新エネルギーシステム設置費補助金：蓄電池",
          "housing_ages": [
            "existing",
            "new"
          ],
          "equipment_packages": [
            "solar_plus_standard_battery"
          ],
          "application_status": "accepting",
          "diagnostic_scope": {
            "status": "in_scope",
            "in_scope_housing_ages": [
              "existing",
              "new"
            ],
            "excluded_branch_ids": [],
            "basis": "新規FIT診断対象外．根拠及び診断外利用の留保：制度ルール不明：診断外蓄電容量定義の対応を留保．新規FIT診断対象外は確認済みであり不明理由ではない． 未採用draft．公式抽出本文確認，PDF目視・原本byte SHA未確認． 主理由は新規FIT経路対象外．制度ルール不明は診断外利用時の留保に限る．"
          },
          "expense_scopes": [
            "solar",
            "battery"
          ],
          "conflict_program_ids": [],
          "official_urls": [
            "https://www.town.hirono.fukushima.jp/kurashi/sumai/1001540/1001833.html",
            "https://www.town.hirono.fukushima.jp/_res/projects/default_project/_page_/001/001/833/06_outline.pdf"
          ],
          "confirmed_at": "2026-09-28",
          "calculation_assumptions": [
            "町住所・非滞納・反社除外，設備費自己負担・所有，住宅所有者承諾，自己居住/予定・併用住宅可，未使用，PPA/リース除外．対象設備ごと世帯又は共同住宅設置者1回．設置後申請，予算先着．受給開始日又は非FIT領収日は設置年度4/1から3/15．SII登録，接続PVはFIT含む電力受給契約なし．卒FIT/解約は満了又は廃止6か月前以降の領収日，非FIT/自家消費も年度内領収．住宅固定・消費．",
            "併用不可：同制度V2Hと相互排他．\n上限：設備別原式参照．"
          ],
          "required_confirmations": [
            "制度ルール不明：診断外蓄電容量定義の対応を留保．新規FIT診断対象外は確認済みであり不明理由ではない． 未採用draft．公式抽出本文確認，PDF目視・原本byte SHA未確認． 主理由は新規FIT経路対象外．制度ルール不明は診断外利用時の留保に限る．",
            "申請時の受付・残予算・製品資格・施工条件を別途確認する．"
          ],
          "source_ids": [
            "fukushima-hirono-battery-source-1",
            "fukushima-hirono-battery-source-2"
          ],
          "machine_rule": "kansai_municipal_non_adopted",
          "non_adoption_status": "excluded",
          "non_adoption_reason_code": "fit_incompatible",
          "fit_compatible": false
        }
      ],
      "institutionalSource": "26ccc59580a143bc4b3c11470aafe54570ef7c81952dbb3502596e3ab5b889b2",
      "sections": [
        {
          "label": "蓄電池",
          "text": "蓄電池の容量1kWhあたり4万円です．",
          "supplement": [
            "（上限）20万円",
            "（端数処理）1kWh未満切り捨て",
            "（端数処理）1,000円未満切り捨て",
            "（未確認事項）低額費用の処理・税区分・共用変換装置の費用範囲"
          ]
        }
      ],
      "text": "蓄電池の容量1kWhあたり4万円です．",
      "supplement": [
        "（上限）20万円",
        "（端数処理）1kWh未満切り捨て",
        "（端数処理）1,000円未満切り捨て",
        "（未確認事項）低額費用の処理・税区分・共用変換装置の費用範囲"
      ],
      "commonSupplement": [],
      "equipment": "蓄電池のみ"
    },
    "mitsuke-new-energy-2026": {
      "prefecture": "15",
      "municipality": "15211",
      "recordId": "scheme-301a07f9a9b1de7082ca",
      "targetYear": "2026",
      "branch": {
        "branch_id": "mitsuke-new-energy-2026",
        "diagnostic_rule_ids": [
          "mitsuke-new-energy-2026"
        ],
        "target_equipment": [
          "太陽光パネル",
          "蓄電池"
        ],
        "application_start": [],
        "application_end": [],
        "application_status": "受付中",
        "amount": {
          "display_text": null,
          "evidence_status": "not_classified"
        },
        "official_conditions": [],
        "gaps": [],
        "evidence_urls": [
          "https://www.city.mitsuke.niigata.jp/soshiki/20/34991.html"
        ],
        "checked_at": "2026-09-20",
        "display_basis": "preparing",
        "migration_status": "pending_review",
        "legacy_municipal_rule_ids": []
      },
      "catalogAmount": {
        "raw_text": "住宅用太陽光は1kW当たり7万円で上限28万円．蓄電池は税込対象経費の3分の1で上限10万円．千円未満切捨て．\n併用・経費調整の原記録：同一設備への他補助の重複可否は申請前に実施主体へ確認する．",
        "display_text": null,
        "evidence_status": "not_classified"
      },
      "rules": [
        {
          "id": "mitsuke-new-energy-2026",
          "government_level": "municipality",
          "prefecture_code": "15",
          "municipality_code": "15211",
          "program_name": "見附市新エネルギー導入促進事業",
          "housing_ages": [
            "existing",
            "new"
          ],
          "equipment_packages": [
            "solar_only",
            "solar_plus_standard_battery"
          ],
          "application_status": "accepting",
          "diagnostic_scope": {
            "status": "in_scope",
            "in_scope_housing_ages": [
              "existing",
              "new"
            ],
            "excluded_branch_ids": [],
            "basis": "現年度受付状況と算定式を確認し，FIT非両立条件を確認しないため主制度とした．"
          },
          "expense_scopes": [
            "solar",
            "battery"
          ],
          "conflict_program_ids": [],
          "official_urls": [
            "https://www.city.mitsuke.niigata.jp/soshiki/20/34991.html"
          ],
          "confirmed_at": "2026-09-20",
          "required_confirmations": [
            "現年度受付状況と算定式を確認し，FIT非両立条件を確認しないため主制度とした．",
            "申請時点の受付継続，予算残額，施工者，納税及び交付決定前未着工等の個別要件を確認する．"
          ],
          "machine_rule": "kansai_municipal_formula",
          "fit_compatible": true,
          "formula_components": [
            {
              "scope": "solar",
              "equipment_packages": [
                "solar_only",
                "solar_plus_standard_battery"
              ],
              "formula_type": "capacity_rate",
              "cost_scope": null,
              "cost_tax": null,
              "cap_yen": 280000,
              "rounding_unit_yen": 1000,
              "capacity_source": "solar_kw",
              "capacity_preprocessing": "none",
              "unit_amount_yen": 70000,
              "capacity_cap": null
            },
            {
              "scope": "battery",
              "equipment_packages": [
                "solar_plus_standard_battery"
              ],
              "formula_type": "cost_fraction",
              "cost_scope": "battery",
              "cost_tax": "inclusive",
              "cap_yen": 100000,
              "rounding_unit_yen": 1000,
              "fraction_numerator": 1,
              "fraction_denominator": 3
            }
          ],
          "calculation_assumptions": [
            "入力容量を制度容量へ対応させ，太陽光は70,000円／kW・上限280,000円，蓄電池は税込モデル費の3分の1・上限100,000円を千円未満切捨てで算入する．"
          ],
          "source_ids": [
            "kansai-15-mitsuke-new-energy-2026-source-1"
          ]
        }
      ],
      "institutionalSource": "b83672f8eaf6ca05d441c68cd581e20032aafa478ca6bcde8759b87e4f807ff6",
      "sections": [
        {
          "label": "太陽光",
          "text": "太陽光の出力1kWあたり7万円です．",
          "supplement": [
            "（適用条件）対象設備：住宅用太陽光",
            "（上限）28万円"
          ]
        },
        {
          "label": "蓄電池",
          "text": "蓄電池の税込対象経費の3分の1です．",
          "supplement": [
            "（上限）10万円"
          ]
        }
      ],
      "text": "太陽光：太陽光の出力1kWあたり7万円です．\n蓄電池：蓄電池の税込対象経費の3分の1です．",
      "supplement": [
        "（端数処理）1,000円未満切り捨て"
      ],
      "commonSupplement": [
        "（端数処理）1,000円未満切り捨て"
      ],
      "equipment": "太陽光・蓄電池",
      "savedSourceDetails": true
    },
    "itoigawa-residential-new-energy-2026": {
      "prefecture": "15",
      "municipality": "15216",
      "recordId": "scheme-11140ff829a635102fb0",
      "targetYear": "2026",
      "branch": {
        "branch_id": "itoigawa-residential-new-energy-2026",
        "diagnostic_rule_ids": [
          "itoigawa-residential-new-energy-2026"
        ],
        "target_equipment": [
          "太陽光パネル",
          "蓄電池"
        ],
        "application_start": [
          {
            "branch_id": "application",
            "label": "申請受付",
            "date": "2026-04-01"
          }
        ],
        "application_end": [
          {
            "branch_id": "application",
            "label": "申請受付",
            "date": ""
          }
        ],
        "application_status": "受付中",
        "amount": {
          "display_text": null,
          "evidence_status": "not_classified"
        },
        "official_conditions": [],
        "gaps": [],
        "evidence_urls": [
          "https://www.city.itoigawa.lg.jp/page/1377.html",
          "https://www.city.itoigawa.lg.jp/uploaded/attachment/17939.pdf"
        ],
        "checked_at": "2026-09-20",
        "display_basis": "preparing",
        "migration_status": "pending_review",
        "legacy_municipal_rule_ids": []
      },
      "catalogAmount": {
        "raw_text": "太陽光は1kW当たり4万円で上限20万円．蓄電池は1kWh当たり1万円で上限10万円．設備区分ごとの補助額は千円未満切捨て．\n併用・経費調整の原記録：同一設備への他補助の重複可否は申請前に実施主体へ確認する．",
        "display_text": null,
        "evidence_status": "not_classified"
      },
      "rules": [
        {
          "id": "itoigawa-residential-new-energy-2026",
          "government_level": "municipality",
          "prefecture_code": "15",
          "municipality_code": "15216",
          "program_name": "糸魚川市住宅用新エネルギーシステム設置事業補助金",
          "housing_ages": [
            "existing",
            "new"
          ],
          "equipment_packages": [
            "solar_only",
            "solar_plus_standard_battery"
          ],
          "application_status": "accepting",
          "diagnostic_scope": {
            "status": "in_scope",
            "in_scope_housing_ages": [
              "existing",
              "new"
            ],
            "excluded_branch_ids": [],
            "basis": "現年度本文を確認し，FIT非両立条件を確認しないため主制度とした．"
          },
          "expense_scopes": [
            "solar",
            "battery"
          ],
          "conflict_program_ids": [],
          "official_urls": [
            "https://www.city.itoigawa.lg.jp/page/1377.html",
            "https://www.city.itoigawa.lg.jp/uploaded/attachment/17939.pdf"
          ],
          "confirmed_at": "2026-09-20",
          "required_confirmations": [
            "現年度本文を確認し，FIT非両立条件を確認しないため主制度とした．",
            "申請時点の受付継続，予算残額，施工者，納税及び交付決定前未着工等の個別要件を確認する．"
          ],
          "machine_rule": "kansai_municipal_formula",
          "fit_compatible": true,
          "formula_components": [
            {
              "scope": "solar",
              "equipment_packages": [
                "solar_only",
                "solar_plus_standard_battery"
              ],
              "formula_type": "capacity_rate",
              "cost_scope": null,
              "cost_tax": null,
              "cap_yen": 200000,
              "rounding_unit_yen": 1000,
              "capacity_source": "solar_kw",
              "capacity_preprocessing": "none",
              "unit_amount_yen": 40000,
              "capacity_cap": null
            },
            {
              "scope": "battery",
              "equipment_packages": [
                "solar_plus_standard_battery"
              ],
              "formula_type": "capacity_rate",
              "cost_scope": null,
              "cost_tax": null,
              "cap_yen": 100000,
              "rounding_unit_yen": 1000,
              "capacity_source": "battery_kwh",
              "capacity_preprocessing": "none",
              "unit_amount_yen": 10000,
              "capacity_cap": null
            }
          ],
          "calculation_assumptions": [
            "入力容量を制度容量へ対応させ，太陽光40,000円／kW・上限200,000円及び蓄電池10,000円／kWh・上限100,000円を設備別に千円未満切捨てで算入する．"
          ],
          "source_ids": [
            "kansai-15-itoigawa-residential-new-energy-2026-source-1",
            "kansai-15-itoigawa-residential-new-energy-2026-source-2"
          ]
        }
      ],
      "institutionalSource": "95789625198418e5e3a7f71fb23dfeedf1fdbf8081cecdd2fa7dcffc4a19800d",
      "sections": [
        {
          "label": "太陽光",
          "text": "太陽光の出力1kWあたり4万円です．",
          "supplement": [
            "（上限）20万円",
            "（端数処理）1,000円未満切り捨て"
          ]
        },
        {
          "label": "蓄電池",
          "text": "蓄電池の容量1kWhあたり1万円です．",
          "supplement": [
            "（上限）10万円",
            "（端数処理）1,000円未満切り捨て"
          ]
        }
      ],
      "text": "太陽光：太陽光の出力1kWあたり4万円です．\n蓄電池：蓄電池の容量1kWhあたり1万円です．",
      "supplement": [],
      "commonSupplement": [],
      "equipment": "太陽光・蓄電池",
      "savedSourceDetails": true
    },
    "gosen-residential-energy-saving-equipment-2026": {
      "prefecture": "15",
      "municipality": "15218",
      "recordId": "scheme-69e3f919a20a4e5c84b1",
      "targetYear": "2026",
      "branch": {
        "branch_id": "gosen-residential-energy-saving-equipment-2026",
        "diagnostic_rule_ids": [
          "gosen-residential-energy-saving-equipment-2026"
        ],
        "target_equipment": [
          "太陽光パネル",
          "蓄電池"
        ],
        "application_start": [
          {
            "branch_id": "application",
            "label": "申請受付",
            "date": "2026-04-10"
          }
        ],
        "application_end": [
          {
            "branch_id": "application",
            "label": "申請受付",
            "date": ""
          }
        ],
        "application_status": "受付対象外",
        "amount": {
          "display_text": null,
          "evidence_status": "not_classified"
        },
        "official_conditions": [],
        "gaps": [],
        "evidence_urls": [
          "https://www.city.gosen.lg.jp/organization/7/14/1473.html"
        ],
        "checked_at": "2026-09-20",
        "display_basis": "preparing",
        "migration_status": "pending_review",
        "legacy_municipal_rule_ids": []
      },
      "catalogAmount": {
        "raw_text": "太陽光は1kW当たり5万円で上限20万円．蓄電池は税抜対象経費の20％で上限20万円．千円未満切捨て．\n併用・経費調整の原記録：同一設備への他補助の重複可否は申請前に実施主体へ確認する．",
        "display_text": null,
        "evidence_status": "not_classified"
      },
      "rules": [
        {
          "id": "gosen-residential-energy-saving-equipment-2026",
          "government_level": "municipality",
          "prefecture_code": "15",
          "municipality_code": "15218",
          "program_name": "五泉市住宅用省エネ設備等設置事業費補助金",
          "housing_ages": [
            "existing",
            "new"
          ],
          "equipment_packages": [
            "solar_only",
            "solar_plus_standard_battery"
          ],
          "application_status": "closed",
          "diagnostic_scope": {
            "status": "in_scope",
            "in_scope_housing_ages": [
              "existing",
              "new"
            ],
            "excluded_branch_ids": [],
            "basis": "FIT余剰売電に適合するが，市本文で5月12日に受付終了状態を確認したため算入しない．実際の受付終了日は確認できない．"
          },
          "expense_scopes": [
            "solar",
            "battery"
          ],
          "conflict_program_ids": [],
          "official_urls": [
            "https://www.city.gosen.lg.jp/organization/7/14/1473.html"
          ],
          "confirmed_at": "2026-09-20",
          "required_confirmations": [
            "FIT余剰売電に適合するが，市本文で5月12日に受付終了状態を確認したため算入しない．実際の受付終了日は確認できない．"
          ],
          "machine_rule": "kansai_municipal_non_adopted",
          "fit_compatible": true,
          "calculation_assumptions": [
            "独立PASS済みの非採用理由を金額へ加えず表示する．"
          ],
          "non_adoption_status": "excluded",
          "non_adoption_reason_code": "application_closed",
          "source_ids": [
            "kansai-15-gosen-residential-energy-saving-equipment-2026-source-1"
          ]
        }
      ],
      "institutionalSource": "e3f62be772edd97c72844f3dfc3baec37985fc9ff24b5923d70637c743077f2e",
      "sections": [
        {
          "label": "太陽光",
          "text": "太陽光の出力1kWあたり5万円です．",
          "supplement": [
            "（上限）20万円"
          ]
        },
        {
          "label": "蓄電池",
          "text": "蓄電池の税抜対象経費の5分の1です．",
          "supplement": [
            "（上限）20万円"
          ]
        }
      ],
      "text": "太陽光：太陽光の出力1kWあたり5万円です．\n蓄電池：蓄電池の税抜対象経費の5分の1です．",
      "supplement": [
        "（端数処理）1,000円未満切り捨て"
      ],
      "commonSupplement": [
        "（端数処理）1,000円未満切り捨て"
      ],
      "equipment": "太陽光・蓄電池",
      "savedSourceDetails": true
    },
    "takaoka-decarbonization-leading-area-2026": {
      "prefecture": "16",
      "municipality": "16202",
      "recordId": "scheme-47f9fb2f22367c261a32",
      "targetYear": "2026",
      "branch": {
        "branch_id": "takaoka-decarbonization-leading-area-2026",
        "diagnostic_rule_ids": [
          "takaoka-decarbonization-leading-area-2026"
        ],
        "target_equipment": [
          "太陽光パネル"
        ],
        "application_start": [],
        "application_end": [],
        "application_status": "受付中",
        "amount": {
          "display_text": null,
          "evidence_status": "not_classified"
        },
        "official_conditions": [],
        "gaps": [],
        "evidence_urls": [
          "https://www.city.takaoka.toyama.jp/gyosei/kurashi_tetsuzuki/sumai/5/11686.html",
          "https://www.city.takaoka.toyama.jp/material/files/group/75/beppyouiti_taiyoukou.pdf",
          "https://policies.env.go.jp/policy/roadmap/assets/grants/2-2-CDS-jisshi-yoko-ex1-senko-chiiki-taisho-yoken.pdf"
        ],
        "checked_at": "2026-09-20",
        "display_basis": "preparing",
        "migration_status": "pending_review",
        "legacy_municipal_rule_ids": []
      },
      "catalogAmount": {
        "raw_text": "太陽光発電設備の補助対象経費の3分の2．\n併用・経費調整の原記録：高岡市住宅用太陽光発電高度利用促進補助金及び国・自治体等の他補助との併用不可．",
        "display_text": null,
        "evidence_status": "not_classified"
      },
      "rules": [
        {
          "id": "takaoka-decarbonization-leading-area-2026",
          "government_level": "municipality",
          "prefecture_code": "16",
          "municipality_code": "16202",
          "program_name": "高岡市脱炭素先行地域づくり事業費補助金（太陽光発電設備）",
          "housing_ages": [
            "existing",
            "new"
          ],
          "equipment_packages": [
            "solar_only",
            "solar_plus_standard_battery"
          ],
          "application_status": "accepting",
          "diagnostic_scope": {
            "status": "in_scope",
            "in_scope_housing_ages": [
              "existing",
              "new"
            ],
            "excluded_branch_ids": [],
            "basis": "市要件が引用する国の先行地域対象事業要件2ア(ア)dにより，太陽光はFIT・FIP認定を取得できず，現行FIT売電経路へ算入しない．対象地域限定だけを非採用理由には用いない．"
          },
          "expense_scopes": [
            "solar"
          ],
          "conflict_program_ids": [],
          "official_urls": [
            "https://www.city.takaoka.toyama.jp/gyosei/kurashi_tetsuzuki/sumai/5/11686.html",
            "https://www.city.takaoka.toyama.jp/material/files/group/75/beppyouiti_taiyoukou.pdf",
            "https://policies.env.go.jp/policy/roadmap/assets/grants/2-2-CDS-jisshi-yoko-ex1-senko-chiiki-taisho-yoken.pdf"
          ],
          "confirmed_at": "2026-09-20",
          "required_confirmations": [
            "市要件が引用する国の先行地域対象事業要件2ア(ア)dにより，太陽光はFIT・FIP認定を取得できず，現行FIT売電経路へ算入しない．対象地域限定だけを非採用理由には用いない．"
          ],
          "machine_rule": "kansai_municipal_non_adopted",
          "fit_compatible": false,
          "calculation_assumptions": [
            "独立PASS済みの非採用理由を金額へ加えず表示する．"
          ],
          "non_adoption_status": "excluded",
          "non_adoption_reason_code": "sale_path_not_applicable",
          "source_ids": [
            "kansai-16-takaoka-decarbonization-leading-area-2026-source-1",
            "kansai-16-takaoka-decarbonization-leading-area-2026-source-2",
            "kansai-16-takaoka-decarbonization-leading-area-2026-source-3"
          ]
        }
      ],
      "institutionalSource": "b76fddf6bebb117b70852f408129e32dbae97036b8fb08f59eaab318fbb39d02",
      "sections": [
        {
          "label": "太陽光",
          "text": "太陽光の補助対象経費の3分の2です．",
          "supplement": []
        }
      ],
      "text": "太陽光の補助対象経費の3分の2です．",
      "supplement": [],
      "commonSupplement": [],
      "equipment": "太陽光",
      "savedSourceDetails": true
    },
    "takaoka-decarbonization-leading-area-battery-2026": {
      "prefecture": "16",
      "municipality": "16202",
      "recordId": "scheme-47f9fb2f22367c261a32",
      "targetYear": "2026",
      "branch": {
        "branch_id": "takaoka-decarbonization-leading-area-battery-2026",
        "diagnostic_rule_ids": [
          "takaoka-decarbonization-leading-area-battery-2026"
        ],
        "target_equipment": [
          "蓄電池"
        ],
        "application_start": [],
        "application_end": [],
        "application_status": "受付中",
        "amount": {
          "display_text": null,
          "evidence_status": "not_classified"
        },
        "official_conditions": [],
        "gaps": [],
        "evidence_urls": [
          "https://www.city.takaoka.toyama.jp/gyosei/kurashi_tetsuzuki/sumai/5/11686.html",
          "https://www.city.takaoka.toyama.jp/material/files/group/75/beppyouiti_taiyoukou.pdf",
          "https://policies.env.go.jp/policy/roadmap/assets/grants/2-2-CDS-jisshi-yoko-ex1-senko-chiiki-taisho-yoken.pdf"
        ],
        "checked_at": "2026-09-20",
        "display_basis": "preparing",
        "migration_status": "pending_review",
        "legacy_municipal_rule_ids": []
      },
      "catalogAmount": {
        "raw_text": "蓄電池の補助対象経費の3分の2．確認資料に設備容量当たり又は1件当たりの上限額は明記されていない．\n併用・経費調整の原記録：高岡市住宅用太陽光発電高度利用促進補助金及び国・自治体等の他補助との併用不可．",
        "display_text": null,
        "evidence_status": "not_classified"
      },
      "rules": [
        {
          "id": "takaoka-decarbonization-leading-area-battery-2026",
          "government_level": "municipality",
          "prefecture_code": "16",
          "municipality_code": "16202",
          "program_name": "高岡市脱炭素先行地域づくり事業費補助金（蓄電池）",
          "housing_ages": [
            "existing",
            "new"
          ],
          "equipment_packages": [
            "solar_plus_standard_battery"
          ],
          "application_status": "accepting",
          "diagnostic_scope": {
            "status": "in_scope",
            "in_scope_housing_ages": [
              "existing",
              "new"
            ],
            "excluded_branch_ids": [],
            "basis": "国の蓄電池要件2イ(エ)にはFIT・FIP認定禁止がなく，本事業外で整備した再エネ発電設備の電力を平時に充放電する蓄電池も対象となり得るため，現行診断へ算入する．モデル規約により対象地域条件は充足を仮定する．"
          },
          "expense_scopes": [
            "battery"
          ],
          "conflict_program_ids": [
            "toyama-energy-campaign4-noncash-2026"
          ],
          "official_urls": [
            "https://www.city.takaoka.toyama.jp/gyosei/kurashi_tetsuzuki/sumai/5/11686.html",
            "https://www.city.takaoka.toyama.jp/material/files/group/75/beppyouiti_taiyoukou.pdf",
            "https://policies.env.go.jp/policy/roadmap/assets/grants/2-2-CDS-jisshi-yoko-ex1-senko-chiiki-taisho-yoken.pdf"
          ],
          "confirmed_at": "2026-09-20",
          "required_confirmations": [
            "脱炭素先行地域内であり，初期実効容量1 kWh以上20 kWh以下，所定の安全規格，震災対策基準及び10年以上のメーカー保証等を満たすことを確認する．",
            "高岡市住宅用太陽光発電高度利用促進補助金及び国・自治体等の他補助との併用がないことを確認する．",
            "国の蓄電池要件2イ(エ)にはFIT・FIP認定禁止がなく，本事業外で整備した再エネ発電設備の電力を平時に充放電する蓄電池も対象となり得るため，現行診断へ算入する．モデル規約により対象地域条件は充足を仮定する．"
          ],
          "machine_rule": "kansai_municipal_formula",
          "fit_compatible": true,
          "formula_components": [
            {
              "scope": "battery",
              "equipment_packages": [
                "solar_plus_standard_battery"
              ],
              "formula_type": "cost_fraction",
              "cost_scope": "battery",
              "cost_tax": "approved_assumption_inclusive",
              "cap_yen": null,
              "rounding_unit_yen": 1,
              "battery_capacity_min_kwh": 1,
              "fraction_numerator": 2,
              "fraction_denominator": 3
            }
          ],
          "calculation_assumptions": [
            "税区分が公式資料で明示されないため，税込モデル蓄電池設置費を対象経費へ対応させ，3分の2を1円未満切捨てで算入する．確認資料に容量当たり又は1件当たりの上限はないため，未確認の上限を追加しない．"
          ],
          "source_ids": [
            "kansai-16-takaoka-decarbonization-leading-area-battery-2026-source-1",
            "kansai-16-takaoka-decarbonization-leading-area-battery-2026-source-2",
            "kansai-16-takaoka-decarbonization-leading-area-battery-2026-source-3"
          ]
        }
      ],
      "institutionalSource": "b1148e2463b2642d0a0d93e16d926683510c1f1146fb5389360a8717fba37365",
      "sections": [
        {
          "label": "蓄電池",
          "text": "蓄電池の補助対象経費の3分の2です．",
          "supplement": []
        }
      ],
      "text": "蓄電池の補助対象経費の3分の2です．",
      "supplement": [],
      "commonSupplement": [
        "（未確認事項）設備容量当たり・1件当たりの上限額"
      ],
      "equipment": "蓄電池",
      "savedSourceDetails": true
    },
    "uozu-solar-battery-2026": {
      "prefecture": "16",
      "municipality": "16204",
      "recordId": "scheme-33713b168c56a489f0a8",
      "targetYear": "2026",
      "branch": {
        "branch_id": "uozu-solar-battery-2026",
        "diagnostic_rule_ids": [
          "uozu-solar-battery-2026"
        ],
        "target_equipment": [
          "太陽光パネル",
          "蓄電池"
        ],
        "application_start": [
          {
            "branch_id": "application",
            "label": "申請受付",
            "date": "2026-05-18"
          }
        ],
        "application_end": [
          {
            "branch_id": "application",
            "label": "申請受付",
            "date": ""
          }
        ],
        "application_status": "受付中",
        "amount": {
          "display_text": null,
          "evidence_status": "not_classified"
        },
        "official_conditions": [],
        "gaps": [],
        "evidence_urls": [
          "https://www.city.uozu.toyama.jp/event-topics/svTopiDtl.aspx?servno=12248"
        ],
        "checked_at": "2026-09-20",
        "display_basis": "preparing",
        "migration_status": "pending_review",
        "legacy_municipal_rule_ids": []
      },
      "catalogAmount": {
        "raw_text": "住宅向け太陽光は7万円/kW．蓄電池は税抜補助対象経費の3分の1で上限40万円．\n併用・経費調整の原記録：国費を財源とする他補助との併用不可．",
        "display_text": null,
        "evidence_status": "not_classified"
      },
      "rules": [
        {
          "id": "uozu-solar-battery-2026",
          "government_level": "municipality",
          "prefecture_code": "16",
          "municipality_code": "16204",
          "program_name": "魚津市太陽光発電設備・蓄電池導入補助金",
          "housing_ages": [
            "existing",
            "new"
          ],
          "equipment_packages": [
            "solar_only",
            "solar_plus_standard_battery"
          ],
          "application_status": "accepting",
          "diagnostic_scope": {
            "status": "in_scope",
            "in_scope_housing_ages": [
              "existing",
              "new"
            ],
            "excluded_branch_ids": [],
            "basis": "FIT・FIP認定を取得せず住宅では30％以上を自家消費することが必須で，現行FIT売電経路へ算入しない．"
          },
          "expense_scopes": [
            "solar",
            "battery"
          ],
          "conflict_program_ids": [],
          "official_urls": [
            "https://www.city.uozu.toyama.jp/event-topics/svTopiDtl.aspx?servno=12248"
          ],
          "confirmed_at": "2026-09-20",
          "required_confirmations": [
            "FIT・FIP認定を取得せず住宅では30％以上を自家消費することが必須で，現行FIT売電経路へ算入しない．"
          ],
          "machine_rule": "kansai_municipal_non_adopted",
          "fit_compatible": false,
          "calculation_assumptions": [
            "独立PASS済みの非採用理由を金額へ加えず表示する．"
          ],
          "non_adoption_status": "excluded",
          "non_adoption_reason_code": "sale_path_not_applicable",
          "source_ids": [
            "kansai-16-uozu-solar-battery-2026-source-1"
          ]
        }
      ],
      "institutionalSource": "1ffd87d6bfec47d4b0587ae6f4c21179b11f8e312813191977d306bd053fba91",
      "sections": [
        {
          "label": "太陽光",
          "text": "太陽光の出力1kWあたり7万円です．",
          "supplement": [
            "（適用条件）対象設備：住宅向け太陽光"
          ]
        },
        {
          "label": "蓄電池",
          "text": "蓄電池の税抜補助対象経費の3分の1です．",
          "supplement": [
            "（上限）40万円"
          ]
        }
      ],
      "text": "太陽光：太陽光の出力1kWあたり7万円です．\n蓄電池：蓄電池の税抜補助対象経費の3分の1です．",
      "supplement": [],
      "commonSupplement": [],
      "equipment": "太陽光・蓄電池",
      "savedSourceDetails": true
    },
    "himi-renewable-energy-2026": {
      "prefecture": "16",
      "municipality": "16205",
      "recordId": "scheme-5dd16010ed6089c4adbe",
      "targetYear": "2026",
      "branch": {
        "branch_id": "himi-renewable-energy-2026",
        "diagnostic_rule_ids": [
          "himi-renewable-energy-2026"
        ],
        "target_equipment": [
          "太陽光パネル",
          "蓄電池"
        ],
        "application_start": [
          {
            "branch_id": "application",
            "label": "申請受付",
            "date": ""
          }
        ],
        "application_end": [
          {
            "branch_id": "application",
            "label": "申請受付",
            "date": "2027-01-29"
          }
        ],
        "application_status": "受付中",
        "amount": {
          "display_text": null,
          "evidence_status": "not_classified"
        },
        "official_conditions": [],
        "gaps": [],
        "evidence_urls": [
          "https://www.city.himi.toyama.jp/gyosei/kurashi/sumai/7/9031.html"
        ],
        "checked_at": "2026-09-20",
        "display_basis": "preparing",
        "migration_status": "pending_review",
        "legacy_municipal_rule_ids": []
      },
      "catalogAmount": {
        "raw_text": "太陽光は7万円/kW・上限35万円．蓄電池は税抜補助対象経費の3分の1・上限40万円．\n併用・経費調整の原記録：対象設備について他の国費負担又は補助を受けないこと．",
        "display_text": null,
        "evidence_status": "not_classified"
      },
      "rules": [
        {
          "id": "himi-renewable-energy-2026",
          "government_level": "municipality",
          "prefecture_code": "16",
          "municipality_code": "16205",
          "program_name": "氷見市再生可能エネルギー導入促進補助金",
          "housing_ages": [
            "existing",
            "new"
          ],
          "equipment_packages": [
            "solar_only",
            "solar_plus_standard_battery"
          ],
          "application_status": "accepting",
          "diagnostic_scope": {
            "status": "in_scope",
            "in_scope_housing_ages": [
              "existing",
              "new"
            ],
            "excluded_branch_ids": [],
            "basis": "FIT・FIP認定を取得せず自家消費率30％以上とすることが必須で，現行FIT売電経路へ算入しない．"
          },
          "expense_scopes": [
            "solar",
            "battery"
          ],
          "conflict_program_ids": [],
          "official_urls": [
            "https://www.city.himi.toyama.jp/gyosei/kurashi/sumai/7/9031.html"
          ],
          "confirmed_at": "2026-09-20",
          "required_confirmations": [
            "FIT・FIP認定を取得せず自家消費率30％以上とすることが必須で，現行FIT売電経路へ算入しない．"
          ],
          "machine_rule": "kansai_municipal_non_adopted",
          "fit_compatible": false,
          "calculation_assumptions": [
            "独立PASS済みの非採用理由を金額へ加えず表示する．"
          ],
          "non_adoption_status": "excluded",
          "non_adoption_reason_code": "sale_path_not_applicable",
          "source_ids": [
            "kansai-16-himi-renewable-energy-2026-source-1"
          ]
        }
      ],
      "institutionalSource": "62fa789b0c7e85d9c7d43e699786524696a5d4738685d3d7f6e945d9e003b2f2",
      "sections": [
        {
          "label": "太陽光",
          "text": "太陽光の出力1kWあたり7万円です．",
          "supplement": [
            "（上限）35万円"
          ]
        },
        {
          "label": "蓄電池",
          "text": "蓄電池の税抜補助対象経費の3分の1です．",
          "supplement": [
            "（上限）40万円"
          ]
        }
      ],
      "text": "太陽光：太陽光の出力1kWあたり7万円です．\n蓄電池：蓄電池の税抜補助対象経費の3分の1です．",
      "supplement": [],
      "commonSupplement": [],
      "equipment": "太陽光・蓄電池",
      "savedSourceDetails": true
    },
    "oyabe-decarbonization-2026": {
      "prefecture": "16",
      "municipality": "16209",
      "recordId": "scheme-792f746e3999546a803c",
      "targetYear": "2026",
      "branch": {
        "branch_id": "oyabe-decarbonization-2026",
        "diagnostic_rule_ids": [
          "oyabe-decarbonization-2026"
        ],
        "target_equipment": [
          "太陽光パネル",
          "蓄電池"
        ],
        "application_start": [
          {
            "branch_id": "application",
            "label": "申請受付",
            "date": ""
          }
        ],
        "application_end": [
          {
            "branch_id": "application",
            "label": "申請受付",
            "date": "2026-12-28"
          }
        ],
        "application_status": "受付中",
        "amount": {
          "display_text": null,
          "evidence_status": "not_classified"
        },
        "official_conditions": [],
        "gaps": [],
        "evidence_urls": [
          "https://www.city.oyabe.toyama.jp/kurashi/1002145/1002169/1006599.html",
          "https://www.city.oyabe.toyama.jp/_res/projects/default_project/_page_/001/006/599/qanda_r8.pdf"
        ],
        "checked_at": "2026-09-20",
        "display_basis": "preparing",
        "migration_status": "pending_review",
        "legacy_municipal_rule_ids": []
      },
      "catalogAmount": {
        "raw_text": "太陽光は7万円/kWで上限なし．蓄電池は税抜補助対象経費の3分の1で上限なし．\n併用・経費調整の原記録：対象設備について他補助との併用不可．",
        "display_text": null,
        "evidence_status": "not_classified"
      },
      "rules": [
        {
          "id": "oyabe-decarbonization-2026",
          "government_level": "municipality",
          "prefecture_code": "16",
          "municipality_code": "16209",
          "program_name": "小矢部市地域脱炭素移行・再エネ推進重点対策加速化事業補助金（市民向け）",
          "housing_ages": [
            "existing",
            "new"
          ],
          "equipment_packages": [
            "solar_only",
            "solar_plus_standard_battery"
          ],
          "application_status": "accepting",
          "diagnostic_scope": {
            "status": "in_scope",
            "in_scope_housing_ages": [
              "existing",
              "new"
            ],
            "excluded_branch_ids": [],
            "basis": "FIT・FIP認定を取得せず自家消費率30％以上とすることが必須で，現行FIT売電経路へ算入しない．"
          },
          "expense_scopes": [
            "solar",
            "battery"
          ],
          "conflict_program_ids": [],
          "official_urls": [
            "https://www.city.oyabe.toyama.jp/kurashi/1002145/1002169/1006599.html",
            "https://www.city.oyabe.toyama.jp/_res/projects/default_project/_page_/001/006/599/qanda_r8.pdf"
          ],
          "confirmed_at": "2026-09-20",
          "required_confirmations": [
            "FIT・FIP認定を取得せず自家消費率30％以上とすることが必須で，現行FIT売電経路へ算入しない．"
          ],
          "machine_rule": "kansai_municipal_non_adopted",
          "fit_compatible": false,
          "calculation_assumptions": [
            "独立PASS済みの非採用理由を金額へ加えず表示する．"
          ],
          "non_adoption_status": "excluded",
          "non_adoption_reason_code": "sale_path_not_applicable",
          "source_ids": [
            "kansai-16-oyabe-decarbonization-2026-source-1",
            "kansai-16-oyabe-decarbonization-2026-source-2"
          ]
        }
      ],
      "institutionalSource": "4e58738a9c42cb1890de560d04a5a3c71c86148ce970db54ef7414e89fa0946e",
      "sections": [
        {
          "label": "太陽光",
          "text": "太陽光の出力1kWあたり7万円です．",
          "supplement": []
        },
        {
          "label": "蓄電池",
          "text": "蓄電池の税抜補助対象経費の3分の1です．",
          "supplement": []
        }
      ],
      "text": "太陽光：太陽光の出力1kWあたり7万円です．\n蓄電池：蓄電池の税抜補助対象経費の3分の1です．",
      "supplement": [],
      "commonSupplement": [],
      "equipment": "太陽光・蓄電池",
      "savedSourceDetails": true
    },
    "komatsu-residential-battery-2026": {
      "prefecture": "17",
      "municipality": "17203",
      "recordId": "scheme-f36792ba9bbed2b9c0b2",
      "targetYear": "2026",
      "branch": {
        "branch_id": "komatsu-residential-battery-2026",
        "diagnostic_rule_ids": [
          "komatsu-residential-battery-2026"
        ],
        "target_equipment": [
          "蓄電池"
        ],
        "application_start": [],
        "application_end": [],
        "application_status": "受付中",
        "amount": {
          "display_text": null,
          "evidence_status": "not_classified"
        },
        "official_conditions": [],
        "gaps": [],
        "evidence_urls": [
          "https://www.city.komatsu.lg.jp/kurasi_tetuzuki/kankyo_gomi/2/5/7520.html",
          "https://www.pref.ishikawa.lg.jp/kenju/documents/sumai_annai_2026.pdf"
        ],
        "checked_at": "2026-09-20",
        "display_basis": "preparing",
        "migration_status": "pending_review",
        "legacy_municipal_rule_ids": []
      },
      "catalogAmount": {
        "raw_text": "住宅用蓄電池システム1件につき5万円．\n併用・経費調整の原記録：国・県の補助金と併用可能．",
        "display_text": null,
        "evidence_status": "not_classified"
      },
      "rules": [
        {
          "id": "komatsu-residential-battery-2026",
          "government_level": "municipality",
          "prefecture_code": "17",
          "municipality_code": "17203",
          "program_name": "小松市再生可能エネルギー設備設置費補助金",
          "housing_ages": [
            "existing",
            "new"
          ],
          "equipment_packages": [
            "solar_plus_standard_battery"
          ],
          "application_status": "accepting",
          "diagnostic_scope": {
            "status": "in_scope",
            "in_scope_housing_ages": [
              "existing",
              "new"
            ],
            "excluded_branch_ids": [],
            "basis": "自己所有住宅向け枝を現行診断へ算入する．PPA制度はPPAを導入した住宅所有者への補助であり，自己所有設備を前提とする標準診断とは契約方式が異なるため除外する．"
          },
          "expense_scopes": [
            "battery"
          ],
          "conflict_program_ids": [],
          "official_urls": [
            "https://www.city.komatsu.lg.jp/kurasi_tetuzuki/kankyo_gomi/2/5/7520.html",
            "https://www.pref.ishikawa.lg.jp/kenju/documents/sumai_annai_2026.pdf"
          ],
          "confirmed_at": "2026-09-20",
          "required_confirmations": [
            "自己所有住宅向け枝を現行診断へ算入する．PPA制度はPPAを導入した住宅所有者への補助であり，自己所有設備を前提とする標準診断とは契約方式が異なるため除外する．",
            "申請時点の受付継続，予算残額，施工者，納税，居住及び着工時期等の個別要件を確認する．"
          ],
          "machine_rule": "kansai_municipal_formula",
          "fit_compatible": true,
          "formula_components": [
            {
              "scope": "battery",
              "equipment_packages": [
                "solar_plus_standard_battery"
              ],
              "formula_type": "fixed",
              "cost_scope": null,
              "cost_tax": null,
              "cap_yen": null,
              "rounding_unit_yen": 1,
              "fixed_amount_yen": 50000
            }
          ],
          "calculation_assumptions": [
            "自己所有・自己居住住宅へ設置する適格蓄電池1件につき50,000円を算入する．"
          ],
          "source_ids": [
            "kansai-17-komatsu-residential-battery-2026-source-1",
            "kansai-17-komatsu-residential-battery-2026-source-2"
          ]
        }
      ],
      "institutionalSource": "48804ff33d0bfb8fd5cc56d69ce234354ac266567d895e39980b94031f5a21b9",
      "sections": [
        {
          "label": "蓄電池",
          "text": "5万円です．",
          "supplement": [
            "（適用条件）対象設備：住宅用蓄電池システム"
          ]
        }
      ],
      "text": "5万円です．",
      "supplement": [
        "（適用条件）対象設備：住宅用蓄電池システム"
      ],
      "commonSupplement": [],
      "equipment": "蓄電池",
      "savedSourceDetails": true
    },
    "suzu-residential-solar-2026": {
      "prefecture": "17",
      "municipality": "17205",
      "recordId": "scheme-1342f4972e5018346ed3",
      "targetYear": "2026",
      "branch": {
        "branch_id": "suzu-residential-solar-2026",
        "diagnostic_rule_ids": [
          "suzu-residential-solar-2026"
        ],
        "target_equipment": [
          "太陽光パネル"
        ],
        "application_start": [],
        "application_end": [],
        "application_status": "受付中",
        "amount": {
          "display_text": null,
          "evidence_status": "not_classified"
        },
        "official_conditions": [],
        "gaps": [],
        "evidence_urls": [
          "https://www.city.suzu.lg.jp/soshiki/2/1438.html",
          "https://www.pref.ishikawa.lg.jp/kenju/documents/sumai_annai_2026.pdf"
        ],
        "checked_at": "2026-09-20",
        "display_basis": "preparing",
        "migration_status": "pending_review",
        "legacy_municipal_rule_ids": []
      },
      "catalogAmount": {
        "raw_text": "太陽光発電設備7万円/kW，上限30万円．\n併用・経費調整の原記録：国・県その他の同一設備補助との併用可否は申請前に実施主体へ確認する．",
        "display_text": null,
        "evidence_status": "not_classified"
      },
      "rules": [
        {
          "id": "suzu-residential-solar-2026",
          "government_level": "municipality",
          "prefecture_code": "17",
          "municipality_code": "17205",
          "program_name": "珠洲市住宅用太陽光発電システム設置費補助金",
          "housing_ages": [
            "existing",
            "new"
          ],
          "equipment_packages": [
            "solar_only",
            "solar_plus_standard_battery"
          ],
          "application_status": "accepting",
          "diagnostic_scope": {
            "status": "in_scope",
            "in_scope_housing_ages": [
              "existing",
              "new"
            ],
            "excluded_branch_ids": [],
            "basis": "FIT又は非FITを許容し，10kW未満・余剰配線の自己所有PVを対象とするため現行診断へ算入可能とした．"
          },
          "expense_scopes": [
            "solar"
          ],
          "conflict_program_ids": [],
          "official_urls": [
            "https://www.city.suzu.lg.jp/soshiki/2/1438.html",
            "https://www.pref.ishikawa.lg.jp/kenju/documents/sumai_annai_2026.pdf"
          ],
          "confirmed_at": "2026-09-20",
          "required_confirmations": [
            "FIT又は非FITを許容し，10kW未満・余剰配線の自己所有PVを対象とするため現行診断へ算入可能とした．",
            "申請時点の受付継続，予算残額，施工者，納税，居住及び着工時期等の個別要件を確認する．"
          ],
          "machine_rule": "kansai_municipal_formula",
          "fit_compatible": true,
          "formula_components": [
            {
              "scope": "solar",
              "equipment_packages": [
                "solar_only",
                "solar_plus_standard_battery"
              ],
              "formula_type": "capacity_rate",
              "cost_scope": null,
              "cost_tax": null,
              "cap_yen": 300000,
              "rounding_unit_yen": 1,
              "capacity_source": "solar_kw",
              "capacity_preprocessing": "none",
              "unit_amount_yen": 70000,
              "solar_output_max_kw_exclusive": 10,
              "capacity_cap": null
            }
          ],
          "calculation_assumptions": [
            "入力太陽光容量を10 kW未満の設備容量へ対応させ，70,000円／kW・上限300,000円を算入する．2025年7月23日施行の市改正本文を優先し，市外施工も許容する．"
          ],
          "source_ids": [
            "kansai-17-suzu-residential-solar-2026-source-1",
            "kansai-17-suzu-residential-solar-2026-source-2"
          ]
        }
      ],
      "institutionalSource": "446c1dd8d5e96c0de1c0de8b71784a2f11e61bfa0af0b2385be97d5b9325e605",
      "sections": [
        {
          "label": "太陽光",
          "text": "太陽光の出力1kWあたり7万円です．",
          "supplement": [
            "（上限）30万円"
          ]
        }
      ],
      "text": "太陽光の出力1kWあたり7万円です．",
      "supplement": [
        "（上限）30万円"
      ],
      "commonSupplement": [],
      "equipment": "太陽光",
      "savedSourceDetails": true
    },
    "kawakita-residential-solar-battery-2026": {
      "prefecture": "17",
      "municipality": "17324",
      "recordId": "scheme-541319bb23c2e0dc49dd",
      "targetYear": "2026",
      "branch": {
        "branch_id": "kawakita-residential-solar-battery-2026",
        "diagnostic_rule_ids": [
          "kawakita-residential-solar-battery-2026"
        ],
        "target_equipment": [
          "太陽光パネル",
          "蓄電池"
        ],
        "application_start": [],
        "application_end": [],
        "application_status": "受付中",
        "amount": {
          "display_text": null,
          "evidence_status": "not_classified"
        },
        "official_conditions": [],
        "gaps": [],
        "evidence_urls": [
          "https://www.town.kawakita.ishikawa.jp/gyosei1/doboku/entry-102.html",
          "https://www.town.kawakita.ishikawa.jp/archives/001/202603/kouhou4gatu.pdf",
          "https://www.pref.ishikawa.lg.jp/kenju/documents/sumai_annai_2026.pdf"
        ],
        "checked_at": "2026-09-20",
        "display_basis": "preparing",
        "migration_status": "pending_review",
        "legacy_municipal_rule_ids": []
      },
      "catalogAmount": {
        "raw_text": "PVは5万円/kW・上限20万円．蓄電池は10万円／件．\n併用・経費調整の原記録：国・県の補助金と併用可能．",
        "display_text": null,
        "evidence_status": "not_classified"
      },
      "rules": [
        {
          "id": "kawakita-residential-solar-battery-2026",
          "government_level": "municipality",
          "prefecture_code": "17",
          "municipality_code": "17324",
          "program_name": "川北町住宅用太陽光発電システム等設置費補助金",
          "housing_ages": [
            "existing",
            "new"
          ],
          "equipment_packages": [
            "solar_only",
            "solar_plus_standard_battery"
          ],
          "application_status": "accepting",
          "diagnostic_scope": {
            "status": "in_scope",
            "in_scope_housing_ages": [
              "existing",
              "new"
            ],
            "excluded_branch_ids": [],
            "basis": "自己所有・自己居住住宅の新規設置を対象とし，現行診断へ算入可能とした．"
          },
          "expense_scopes": [
            "solar",
            "battery"
          ],
          "conflict_program_ids": [],
          "official_urls": [
            "https://www.town.kawakita.ishikawa.jp/gyosei1/doboku/entry-102.html",
            "https://www.town.kawakita.ishikawa.jp/archives/001/202603/kouhou4gatu.pdf",
            "https://www.pref.ishikawa.lg.jp/kenju/documents/sumai_annai_2026.pdf"
          ],
          "confirmed_at": "2026-09-20",
          "required_confirmations": [
            "自己所有・自己居住住宅の新規設置を対象とし，現行診断へ算入可能とした．",
            "申請時点の受付継続，予算残額，施工者，納税，居住及び着工時期等の個別要件を確認する．"
          ],
          "machine_rule": "kansai_municipal_formula",
          "fit_compatible": true,
          "formula_components": [
            {
              "scope": "solar",
              "equipment_packages": [
                "solar_only",
                "solar_plus_standard_battery"
              ],
              "formula_type": "capacity_rate",
              "cost_scope": null,
              "cost_tax": null,
              "cap_yen": 200000,
              "rounding_unit_yen": 1,
              "capacity_source": "solar_kw",
              "capacity_preprocessing": "none",
              "unit_amount_yen": 50000,
              "solar_output_max_kw_exclusive": 10,
              "capacity_cap": null
            },
            {
              "scope": "battery",
              "equipment_packages": [
                "solar_plus_standard_battery"
              ],
              "formula_type": "fixed",
              "cost_scope": null,
              "cost_tax": null,
              "cap_yen": null,
              "rounding_unit_yen": 1,
              "fixed_amount_yen": 100000
            }
          ],
          "calculation_assumptions": [
            "10 kW未満の入力太陽光容量へ50,000円／kW・上限200,000円を算入し，蓄電池同時導入では100,000円を加算する．"
          ],
          "source_ids": [
            "kansai-17-kawakita-residential-solar-battery-2026-source-1",
            "kansai-17-kawakita-residential-solar-battery-2026-source-2",
            "kansai-17-kawakita-residential-solar-battery-2026-source-3"
          ]
        }
      ],
      "institutionalSource": "bd359c662bfbc7896128fb1f0b85fb19e56cf15374de3b1bcf581b8c8eac338b",
      "sections": [
        {
          "label": "太陽光",
          "text": "太陽光の出力1kWあたり5万円です．",
          "supplement": [
            "（上限）20万円"
          ]
        },
        {
          "label": "蓄電池",
          "text": "10万円です．",
          "supplement": []
        }
      ],
      "text": "太陽光：太陽光の出力1kWあたり5万円です．\n蓄電池：10万円です．",
      "supplement": [],
      "commonSupplement": [],
      "equipment": "太陽光・蓄電池",
      "savedSourceDetails": true
    },
    "uchinada-residential-solar-battery-2026": {
      "prefecture": "17",
      "municipality": "17365",
      "recordId": "scheme-502324d54ba01ccaa3aa",
      "targetYear": "2026",
      "branch": {
        "branch_id": "uchinada-residential-solar-battery-2026",
        "diagnostic_rule_ids": [
          "uchinada-residential-solar-battery-2026"
        ],
        "target_equipment": [
          "太陽光パネル",
          "蓄電池"
        ],
        "application_start": [],
        "application_end": [],
        "application_status": "受付中",
        "amount": {
          "display_text": null,
          "evidence_status": "not_classified"
        },
        "official_conditions": [],
        "gaps": [],
        "evidence_urls": [
          "https://www.town.uchinada.lg.jp/soshiki/jumin/2917.html",
          "https://www.pref.ishikawa.lg.jp/kenju/documents/sumai_annai_2026.pdf"
        ],
        "checked_at": "2026-09-20",
        "display_basis": "preparing",
        "migration_status": "pending_review",
        "legacy_municipal_rule_ids": []
      },
      "catalogAmount": {
        "raw_text": "2kW以上10kW未満のPVは5万円／件．蓄電池は10万円／件．\n併用・経費調整の原記録：国・県その他の同一設備補助との併用可否は申請前に実施主体へ確認する．",
        "display_text": null,
        "evidence_status": "not_classified"
      },
      "rules": [
        {
          "id": "uchinada-residential-solar-battery-2026",
          "government_level": "municipality",
          "prefecture_code": "17",
          "municipality_code": "17365",
          "program_name": "内灘町新エネルギー・省エネルギーシステム設置費補助金",
          "housing_ages": [
            "existing",
            "new"
          ],
          "equipment_packages": [
            "solar_only",
            "solar_plus_standard_battery"
          ],
          "application_status": "accepting",
          "diagnostic_scope": {
            "status": "in_scope",
            "in_scope_housing_ages": [
              "existing",
              "new"
            ],
            "excluded_branch_ids": [],
            "basis": "町公式の受付再開と固定額を確認し，現行診断へ算入可能とした．"
          },
          "expense_scopes": [
            "solar",
            "battery"
          ],
          "conflict_program_ids": [],
          "official_urls": [
            "https://www.town.uchinada.lg.jp/soshiki/jumin/2917.html",
            "https://www.pref.ishikawa.lg.jp/kenju/documents/sumai_annai_2026.pdf"
          ],
          "confirmed_at": "2026-09-20",
          "required_confirmations": [
            "町公式の受付再開と固定額を確認し，現行診断へ算入可能とした．",
            "申請時点の受付継続，予算残額，施工者，納税，居住及び着工時期等の個別要件を確認する．"
          ],
          "machine_rule": "kansai_municipal_formula",
          "fit_compatible": true,
          "formula_components": [
            {
              "scope": "solar",
              "equipment_packages": [
                "solar_only",
                "solar_plus_standard_battery"
              ],
              "formula_type": "fixed",
              "cost_scope": null,
              "cost_tax": null,
              "cap_yen": null,
              "rounding_unit_yen": 1,
              "fixed_amount_yen": 50000,
              "solar_output_min_kw": 2,
              "solar_output_max_kw_exclusive": 10
            },
            {
              "scope": "battery",
              "equipment_packages": [
                "solar_plus_standard_battery"
              ],
              "formula_type": "fixed",
              "cost_scope": null,
              "cost_tax": null,
              "cap_yen": null,
              "rounding_unit_yen": 1,
              "fixed_amount_yen": 100000
            }
          ],
          "calculation_assumptions": [
            "2 kW以上10 kW未満のPVへ50,000円，蓄電池同時導入では100,000円を加算する．"
          ],
          "source_ids": [
            "kansai-17-uchinada-residential-solar-battery-2026-source-1",
            "kansai-17-uchinada-residential-solar-battery-2026-source-2"
          ]
        }
      ],
      "institutionalSource": "169553594e56f76b86993ce2f83b774ad8e51c4c3175c2508026de6facdf4456",
      "sections": [
        {
          "label": "太陽光",
          "text": "5万円です．",
          "supplement": [
            "（算定対象）出力：2kW以上10kW未満"
          ]
        },
        {
          "label": "蓄電池",
          "text": "10万円です．",
          "supplement": []
        }
      ],
      "text": "太陽光：5万円です．\n蓄電池：10万円です．",
      "supplement": [],
      "commonSupplement": [],
      "equipment": "太陽光・蓄電池",
      "savedSourceDetails": true
    },
    "hodatsushimizu-residential-solar-battery-2026": {
      "prefecture": "17",
      "municipality": "17386",
      "recordId": "scheme-6a5a3caefdb1a50e3e73",
      "targetYear": "2026",
      "branch": {
        "branch_id": "hodatsushimizu-residential-solar-battery-2026",
        "diagnostic_rule_ids": [
          "hodatsushimizu-residential-solar-battery-2026"
        ],
        "target_equipment": [
          "太陽光パネル",
          "蓄電池"
        ],
        "application_start": [],
        "application_end": [],
        "application_status": "受付中",
        "amount": {
          "display_text": null,
          "evidence_status": "not_classified"
        },
        "official_conditions": [],
        "gaps": [],
        "evidence_urls": [
          "https://www.hodatsushimizu.jp/soshiki/kankyo/2_1/1/3919.html",
          "https://www.hodatsushimizu.jp/material/files/group/8/yoko.pdf",
          "https://www.pref.ishikawa.lg.jp/kenju/documents/sumai_annai_2026.pdf"
        ],
        "checked_at": "2026-09-20",
        "display_basis": "preparing",
        "migration_status": "pending_review",
        "legacy_municipal_rule_ids": []
      },
      "catalogAmount": {
        "raw_text": "10kW未満のPVは5万円／件．蓄電池は5万円／件．\n併用・経費調整の原記録：町本文で確認できる併用可はPVと蓄電池の相互併用である．国・県補助との併用可否は明文を確認できないため，申請前に町へ確認する．",
        "display_text": null,
        "evidence_status": "not_classified"
      },
      "rules": [
        {
          "id": "hodatsushimizu-residential-solar-battery-2026",
          "government_level": "municipality",
          "prefecture_code": "17",
          "municipality_code": "17386",
          "program_name": "宝達志水町住宅用太陽光発電システム等設置費補助金",
          "housing_ages": [
            "existing",
            "new"
          ],
          "equipment_packages": [
            "solar_only",
            "solar_plus_standard_battery"
          ],
          "application_status": "accepting",
          "diagnostic_scope": {
            "status": "in_scope",
            "in_scope_housing_ages": [
              "existing",
              "new"
            ],
            "excluded_branch_ids": [],
            "basis": "FIT非両立条件を確認せず，固定額を現行診断へ算入可能とした．"
          },
          "expense_scopes": [
            "solar",
            "battery"
          ],
          "conflict_program_ids": [],
          "official_urls": [
            "https://www.hodatsushimizu.jp/soshiki/kankyo/2_1/1/3919.html",
            "https://www.hodatsushimizu.jp/material/files/group/8/yoko.pdf",
            "https://www.pref.ishikawa.lg.jp/kenju/documents/sumai_annai_2026.pdf"
          ],
          "confirmed_at": "2026-09-20",
          "required_confirmations": [
            "FIT非両立条件を確認せず，固定額を現行診断へ算入可能とした．",
            "申請時点の受付継続，予算残額，施工者，納税，居住及び着工時期等の個別要件を確認する．"
          ],
          "machine_rule": "kansai_municipal_formula",
          "fit_compatible": true,
          "formula_components": [
            {
              "scope": "solar",
              "equipment_packages": [
                "solar_only",
                "solar_plus_standard_battery"
              ],
              "formula_type": "fixed",
              "cost_scope": null,
              "cost_tax": null,
              "cap_yen": null,
              "rounding_unit_yen": 1,
              "fixed_amount_yen": 50000,
              "solar_output_max_kw_exclusive": 10
            },
            {
              "scope": "battery",
              "equipment_packages": [
                "solar_plus_standard_battery"
              ],
              "formula_type": "fixed",
              "cost_scope": null,
              "cost_tax": null,
              "cap_yen": null,
              "rounding_unit_yen": 1,
              "fixed_amount_yen": 50000
            }
          ],
          "calculation_assumptions": [
            "10 kW未満のPV及び蓄電池へ各50,000円を算入する．国・県補助との併用可否は申請前に確認する．"
          ],
          "source_ids": [
            "kansai-17-hodatsushimizu-residential-solar-battery-2026-source-1",
            "kansai-17-hodatsushimizu-residential-solar-battery-2026-source-2",
            "kansai-17-hodatsushimizu-residential-solar-battery-2026-source-3"
          ]
        }
      ],
      "institutionalSource": "0f23245c89395936651be2a3eb25f05481fd0b7507787bf4670b79179f37b3b7",
      "sections": [
        {
          "label": "太陽光",
          "text": "5万円です．",
          "supplement": [
            "（算定対象）出力：10kW未満"
          ]
        },
        {
          "label": "蓄電池",
          "text": "5万円です．",
          "supplement": []
        }
      ],
      "text": "太陽光：5万円です．\n蓄電池：5万円です．",
      "supplement": [],
      "commonSupplement": [],
      "equipment": "太陽光・蓄電池",
      "savedSourceDetails": true
    },
    "yamanashi-city-residential-battery-2026": {
      "prefecture": "19",
      "municipality": "19205",
      "recordId": "scheme-8f8f854322e180b08297",
      "targetYear": "2026",
      "branch": {
        "branch_id": "yamanashi-city-residential-battery-2026",
        "diagnostic_rule_ids": [
          "yamanashi-city-residential-battery-2026"
        ],
        "target_equipment": [
          "蓄電池"
        ],
        "application_start": [
          {
            "branch_id": "application",
            "label": "申請受付",
            "date": "2026-04-01"
          }
        ],
        "application_end": [
          {
            "branch_id": "application",
            "label": "申請受付",
            "date": ""
          }
        ],
        "application_status": "受付対象外",
        "amount": {
          "display_text": null,
          "evidence_status": "not_classified"
        },
        "official_conditions": [],
        "gaps": [],
        "evidence_urls": [
          "https://www.city.yamanashi.yamanashi.jp/soshiki/15/1122.html",
          "https://www.city.yamanashi.yamanashi.jp/uploaded/attachment/10424.pdf"
        ],
        "checked_at": "2026-09-20",
        "display_basis": "preparing",
        "migration_status": "pending_review",
        "legacy_municipal_rule_ids": []
      },
      "catalogAmount": {
        "raw_text": "補助対象経費の10分の1を千円未満切捨て，上限10万円．\n併用・経費調整の原記録：同一経費への他補助との重複可否は交付要件に従う．",
        "display_text": null,
        "evidence_status": "not_classified"
      },
      "rules": [
        {
          "id": "yamanashi-city-residential-battery-2026",
          "government_level": "municipality",
          "prefecture_code": "19",
          "municipality_code": "19205",
          "program_name": "山梨市住宅用蓄電池設置費補助金",
          "housing_ages": [
            "existing",
            "new"
          ],
          "equipment_packages": [
            "solar_plus_standard_battery"
          ],
          "application_status": "closed",
          "diagnostic_scope": {
            "status": "in_scope",
            "in_scope_housing_ages": [
              "existing",
              "new"
            ],
            "excluded_branch_ids": [],
            "basis": "制度は計算可能だが，確認日現在は予算到達で受付終了しているため現行診断額へは算入しない．"
          },
          "expense_scopes": [
            "battery"
          ],
          "conflict_program_ids": [],
          "official_urls": [
            "https://www.city.yamanashi.yamanashi.jp/soshiki/15/1122.html",
            "https://www.city.yamanashi.yamanashi.jp/uploaded/attachment/10424.pdf"
          ],
          "confirmed_at": "2026-09-20",
          "required_confirmations": [
            "制度は計算可能だが，確認日現在は予算到達で受付終了しているため現行診断額へは算入しない．"
          ],
          "machine_rule": "kansai_municipal_non_adopted",
          "fit_compatible": true,
          "calculation_assumptions": [
            "独立PASS済みの非採用理由を金額へ加えず表示する．"
          ],
          "non_adoption_status": "excluded",
          "non_adoption_reason_code": "application_closed",
          "source_ids": [
            "kansai-19-yamanashi-city-residential-battery-2026-source-1",
            "kansai-19-yamanashi-city-residential-battery-2026-source-2"
          ]
        }
      ],
      "institutionalSource": "dc02f6f3a7264f30ca4108eddfe4af60b14f2e23a51535617a41b78db91bcf7a",
      "sections": [
        {
          "label": "蓄電池",
          "text": "補助対象経費の10分の1です．",
          "supplement": [
            "（上限）10万円",
            "（端数処理）1,000円未満切り捨て"
          ]
        }
      ],
      "text": "補助対象経費の10分の1です．",
      "supplement": [
        "（上限）10万円",
        "（端数処理）1,000円未満切り捨て"
      ],
      "commonSupplement": [],
      "equipment": "蓄電池",
      "savedSourceDetails": true
    },
    "otsuki-residential-battery-2026": {
      "prefecture": "19",
      "municipality": "19206",
      "recordId": "scheme-2bd767e39d38f8c2e166",
      "targetYear": "2026",
      "branch": {
        "branch_id": "otsuki-residential-battery-2026",
        "diagnostic_rule_ids": [
          "otsuki-residential-battery-2026"
        ],
        "target_equipment": [
          "蓄電池"
        ],
        "application_start": [],
        "application_end": [],
        "application_status": "受付中",
        "amount": {
          "display_text": null,
          "evidence_status": "not_classified"
        },
        "official_conditions": [],
        "gaps": [],
        "evidence_urls": [
          "https://www.city.otsuki.yamanashi.jp/kurashi/kankyo/2017-0707-0929-8.html",
          "https://www.city.otsuki.yamanashi.jp/reiki/reiki_honbun/e607RG00001010.html",
          "https://www.city.otsuki.yamanashi.jp/kurashi/kankyo/files/chikudenchi.pdf"
        ],
        "checked_at": "2026-09-20",
        "display_basis": "preparing",
        "migration_status": "pending_review",
        "legacy_municipal_rule_ids": []
      },
      "catalogAmount": {
        "raw_text": "家庭用リチウムイオン蓄電池は5万円／件．\n併用・経費調整の原記録：同一設備への他補助との重複可否は交付要件に従う．",
        "display_text": null,
        "evidence_status": "not_classified"
      },
      "rules": [
        {
          "id": "otsuki-residential-battery-2026",
          "government_level": "municipality",
          "prefecture_code": "19",
          "municipality_code": "19206",
          "program_name": "家庭用リチウムイオン蓄電池設置費補助金",
          "housing_ages": [
            "existing",
            "new"
          ],
          "equipment_packages": [
            "solar_plus_standard_battery"
          ],
          "application_status": "accepting",
          "diagnostic_scope": {
            "status": "in_scope",
            "in_scope_housing_ages": [
              "existing",
              "new"
            ],
            "excluded_branch_ids": [],
            "basis": "旧PV補助は2019年度で終了しており，現行の蓄電池枝だけを候補とする．"
          },
          "expense_scopes": [
            "battery"
          ],
          "conflict_program_ids": [],
          "official_urls": [
            "https://www.city.otsuki.yamanashi.jp/kurashi/kankyo/2017-0707-0929-8.html",
            "https://www.city.otsuki.yamanashi.jp/reiki/reiki_honbun/e607RG00001010.html",
            "https://www.city.otsuki.yamanashi.jp/kurashi/kankyo/files/chikudenchi.pdf"
          ],
          "confirmed_at": "2026-09-20",
          "required_confirmations": [
            "旧PV補助は2019年度で終了しており，現行の蓄電池枝だけを候補とする．",
            "申請時点の受付継続，予算残額，対象地域，施工者，納税，居住及び着工時期等の個別要件を確認する．"
          ],
          "machine_rule": "kansai_municipal_formula",
          "fit_compatible": true,
          "formula_components": [
            {
              "scope": "battery",
              "equipment_packages": [
                "solar_plus_standard_battery"
              ],
              "formula_type": "fixed",
              "cost_scope": null,
              "cost_tax": null,
              "cap_yen": null,
              "rounding_unit_yen": 1,
              "fixed_amount_yen": 50000,
              "solar_output_max_kw_exclusive": 10
            }
          ],
          "calculation_assumptions": [
            "10 kW未満のPVへ接続する適格家庭用蓄電池1件につき50,000円を算入する．"
          ],
          "source_ids": [
            "kansai-19-otsuki-residential-battery-2026-source-1",
            "kansai-19-otsuki-residential-battery-2026-source-2",
            "kansai-19-otsuki-residential-battery-2026-source-3"
          ]
        }
      ],
      "institutionalSource": "ef3714dd0b409dd9692a23801379926837bf588347ea1e83d8eef3d4f88d523c",
      "sections": [
        {
          "label": "蓄電池",
          "text": "5万円です．",
          "supplement": [
            "（適用条件）対象設備：家庭用リチウムイオン蓄電池"
          ]
        }
      ],
      "text": "5万円です．",
      "supplement": [
        "（適用条件）対象設備：家庭用リチウムイオン蓄電池"
      ],
      "commonSupplement": [],
      "equipment": "蓄電池",
      "savedSourceDetails": true
    },
    "minami-alps-residential-battery-2026": {
      "prefecture": "19",
      "municipality": "19208",
      "recordId": "scheme-34da1864858b8adeaa9a",
      "targetYear": "2026",
      "branch": {
        "branch_id": "minami-alps-residential-battery-2026",
        "diagnostic_rule_ids": [
          "minami-alps-residential-battery-2026"
        ],
        "target_equipment": [
          "蓄電池"
        ],
        "application_start": [
          {
            "branch_id": "application",
            "label": "申請受付",
            "date": "2026-04-01"
          }
        ],
        "application_end": [
          {
            "branch_id": "application",
            "label": "申請受付",
            "date": "2027-03-19"
          }
        ],
        "application_status": "受付中",
        "amount": {
          "display_text": null,
          "evidence_status": "not_classified"
        },
        "official_conditions": [],
        "gaps": [],
        "evidence_urls": [
          "https://www.city.minami-alps.yamanashi.jp/docs/1397.html",
          "https://www.city.minami-alps.yamanashi.jp/fs/1/4/2/0/5/7/_/_____________________R8.4.1___.pdf"
        ],
        "checked_at": "2026-09-20",
        "display_basis": "preparing",
        "migration_status": "pending_review",
        "legacy_municipal_rule_ids": []
      },
      "catalogAmount": {
        "raw_text": "家庭用蓄電池は3万円／件．\n併用・経費調整の原記録：同一設備への他補助との重複可否は交付要件に従う．",
        "display_text": null,
        "evidence_status": "not_classified"
      },
      "rules": [
        {
          "id": "minami-alps-residential-battery-2026",
          "government_level": "municipality",
          "prefecture_code": "19",
          "municipality_code": "19208",
          "program_name": "エコライフ促進補助金",
          "housing_ages": [
            "existing",
            "new"
          ],
          "equipment_packages": [
            "solar_plus_standard_battery"
          ],
          "application_status": "accepting",
          "diagnostic_scope": {
            "status": "in_scope",
            "in_scope_housing_ages": [
              "existing",
              "new"
            ],
            "excluded_branch_ids": [],
            "basis": "公式現行本文の3万円を採用する．新築建売のHEMS追加工事は本文に記載がある一方，令和8年度要綱第3条には記載がないため資料差として保持し，一般の自己設置蓄電池へ一般化しない．"
          },
          "expense_scopes": [
            "battery"
          ],
          "conflict_program_ids": [],
          "official_urls": [
            "https://www.city.minami-alps.yamanashi.jp/docs/1397.html",
            "https://www.city.minami-alps.yamanashi.jp/fs/1/4/2/0/5/7/_/_____________________R8.4.1___.pdf"
          ],
          "confirmed_at": "2026-09-20",
          "required_confirmations": [
            "公式現行本文の3万円を採用する．新築建売のHEMS追加工事は本文に記載がある一方，令和8年度要綱第3条には記載がないため資料差として保持し，一般の自己設置蓄電池へ一般化しない．",
            "申請時点の受付継続，予算残額，対象地域，施工者，納税，居住及び着工時期等の個別要件を確認する．"
          ],
          "machine_rule": "kansai_municipal_formula",
          "fit_compatible": true,
          "formula_components": [
            {
              "scope": "battery",
              "equipment_packages": [
                "solar_plus_standard_battery"
              ],
              "formula_type": "fixed",
              "cost_scope": null,
              "cost_tax": null,
              "cap_yen": null,
              "rounding_unit_yen": 1,
              "fixed_amount_yen": 30000,
              "solar_output_max_kw_exclusive": 10
            }
          ],
          "calculation_assumptions": [
            "10 kW未満の住宅用PVと同時設置する家庭用蓄電池1件につき30,000円を算入する．"
          ],
          "source_ids": [
            "kansai-19-minami-alps-residential-battery-2026-source-1",
            "kansai-19-minami-alps-residential-battery-2026-source-2"
          ]
        }
      ],
      "institutionalSource": "f952752f4bd11d1fe2e3f82ed3cdc925af400f04dce1eeb617d80f6f3eb24405",
      "sections": [
        {
          "label": "蓄電池",
          "text": "3万円です．",
          "supplement": [
            "（適用条件）対象設備：家庭用蓄電池"
          ]
        }
      ],
      "text": "3万円です．",
      "supplement": [
        "（適用条件）対象設備：家庭用蓄電池"
      ],
      "commonSupplement": [],
      "equipment": "蓄電池",
      "savedSourceDetails": true
    },
    "uenohara-residential-battery-2026": {
      "prefecture": "19",
      "municipality": "19212",
      "recordId": "scheme-8a264677a52f67f6d7ef",
      "targetYear": "2026",
      "branch": {
        "branch_id": "uenohara-residential-battery-2026",
        "diagnostic_rule_ids": [
          "uenohara-residential-battery-2026"
        ],
        "target_equipment": [
          "蓄電池"
        ],
        "application_start": [
          {
            "branch_id": "start-1",
            "label": "受付日程1（startのみ確認）",
            "date": "2026-06-15"
          },
          {
            "branch_id": "start-2",
            "label": "受付日程2（startのみ確認）",
            "date": "2026-09-15"
          },
          {
            "branch_id": "start-3",
            "label": "受付日程3（startのみ確認）",
            "date": "2026-12-15"
          },
          {
            "branch_id": "start-4",
            "label": "受付日程4（startのみ確認）",
            "date": "2027-02-01"
          },
          {
            "branch_id": "end-1",
            "label": "受付日程1（endのみ確認）",
            "date": ""
          },
          {
            "branch_id": "end-2",
            "label": "受付日程2（endのみ確認）",
            "date": ""
          },
          {
            "branch_id": "end-3",
            "label": "受付日程3（endのみ確認）",
            "date": ""
          },
          {
            "branch_id": "end-4",
            "label": "受付日程4（endのみ確認）",
            "date": ""
          }
        ],
        "application_end": [
          {
            "branch_id": "start-1",
            "label": "受付日程1（startのみ確認）",
            "date": ""
          },
          {
            "branch_id": "start-2",
            "label": "受付日程2（startのみ確認）",
            "date": ""
          },
          {
            "branch_id": "start-3",
            "label": "受付日程3（startのみ確認）",
            "date": ""
          },
          {
            "branch_id": "start-4",
            "label": "受付日程4（startのみ確認）",
            "date": ""
          },
          {
            "branch_id": "end-1",
            "label": "受付日程1（endのみ確認）",
            "date": "2026-07-15"
          },
          {
            "branch_id": "end-2",
            "label": "受付日程2（endのみ確認）",
            "date": "2026-10-15"
          },
          {
            "branch_id": "end-3",
            "label": "受付日程3（endのみ確認）",
            "date": "2027-01-15"
          },
          {
            "branch_id": "end-4",
            "label": "受付日程4（endのみ確認）",
            "date": "2027-03-15"
          }
        ],
        "application_status": "受付中",
        "amount": {
          "display_text": null,
          "evidence_status": "not_classified"
        },
        "official_conditions": [],
        "gaps": [],
        "evidence_urls": [
          "https://www.city.uenohara.yamanashi.jp/page/109604.html",
          "https://www.city.uenohara.yamanashi.jp/uploaded/attachment/7768.pdf"
        ],
        "checked_at": "2026-09-20",
        "display_basis": "preparing",
        "migration_status": "pending_review",
        "legacy_municipal_rule_ids": []
      },
      "catalogAmount": {
        "raw_text": "家庭用蓄電池は10万円／件．\n併用・経費調整の原記録：同一設備への他補助との重複可否は交付要件に従う．",
        "display_text": null,
        "evidence_status": "not_classified"
      },
      "rules": [
        {
          "id": "uenohara-residential-battery-2026",
          "government_level": "municipality",
          "prefecture_code": "19",
          "municipality_code": "19212",
          "program_name": "住宅用蓄電池システム設置費補助金",
          "housing_ages": [
            "existing",
            "new"
          ],
          "equipment_packages": [
            "solar_plus_standard_battery"
          ],
          "application_status": "accepting",
          "diagnostic_scope": {
            "status": "in_scope",
            "in_scope_housing_ages": [
              "existing",
              "new"
            ],
            "excluded_branch_ids": [],
            "basis": "標準蓄電池が製品登録要件を満たすモデル前提で10万円を候補額とする．接続PVの原文単位は10kWhであるが，kWと解釈した値を原文とは分離して保持する．"
          },
          "expense_scopes": [
            "battery"
          ],
          "conflict_program_ids": [],
          "official_urls": [
            "https://www.city.uenohara.yamanashi.jp/page/109604.html",
            "https://www.city.uenohara.yamanashi.jp/uploaded/attachment/7768.pdf"
          ],
          "confirmed_at": "2026-09-20",
          "required_confirmations": [
            "標準蓄電池が製品登録要件を満たすモデル前提で10万円を候補額とする．接続PVの原文単位は10kWhであるが，kWと解釈した値を原文とは分離して保持する．",
            "申請時点の受付継続，予算残額，対象地域，施工者，納税，居住及び着工時期等の個別要件を確認する．"
          ],
          "machine_rule": "kansai_municipal_formula",
          "fit_compatible": true,
          "formula_components": [
            {
              "scope": "battery",
              "equipment_packages": [
                "solar_plus_standard_battery"
              ],
              "formula_type": "fixed",
              "cost_scope": null,
              "cost_tax": null,
              "cap_yen": null,
              "rounding_unit_yen": 1,
              "fixed_amount_yen": 100000
            }
          ],
          "calculation_assumptions": [
            "標準蓄電池が製品登録要件を満たし，電力需給契約のあるPVへ接続する専用戸建の同時新設として100,000円を算入する．"
          ],
          "source_ids": [
            "kansai-19-uenohara-residential-battery-2026-source-1",
            "kansai-19-uenohara-residential-battery-2026-source-2"
          ]
        }
      ],
      "institutionalSource": "b9f65643819a27942c498e0959e1cc97b8440fa1ce04312a2df3a97b4e97d734",
      "sections": [
        {
          "label": "蓄電池",
          "text": "10万円です．",
          "supplement": [
            "（適用条件）対象設備：家庭用蓄電池"
          ]
        }
      ],
      "text": "10万円です．",
      "supplement": [
        "（適用条件）対象設備：家庭用蓄電池"
      ],
      "commonSupplement": [],
      "equipment": "蓄電池",
      "savedSourceDetails": true
    },
    "minobu-residential-solar-2026": {
      "prefecture": "19",
      "municipality": "19365",
      "recordId": "scheme-cc599c435898ab05093a",
      "targetYear": "2026",
      "branch": {
        "branch_id": "minobu-residential-solar-2026",
        "diagnostic_rule_ids": [
          "minobu-residential-solar-2026"
        ],
        "target_equipment": [
          "太陽光パネル"
        ],
        "application_start": [],
        "application_end": [],
        "application_status": "受付中",
        "amount": {
          "display_text": "住宅用太陽光の設置1件当たり50,000円の定額です．容量単価や費用に対する率ではなく，可搬型蓄電池等の別制度の額を加算しません．同一設備への他補助との重複可否等は交付要件によります．",
          "evidence_status": "partial"
        },
        "official_conditions": [],
        "gaps": [],
        "evidence_urls": [
          "https://www.town.minobu.lg.jp/page/1382.html"
        ],
        "checked_at": "2026-09-20",
        "display_basis": "preparing",
        "migration_status": "pending_review",
        "legacy_municipal_rule_ids": []
      },
      "catalogAmount": {
        "raw_text": "住宅用PVは5万円／件．\n併用・経費調整の原記録：同一設備への他補助との重複可否は交付要件に従う．",
        "display_text": "住宅用太陽光の設置1件当たり50,000円の定額です．容量単価や費用に対する率ではなく，可搬型蓄電池等の別制度の額を加算しません．同一設備への他補助との重複可否等は交付要件によります．",
        "evidence_status": "partial"
      },
      "rules": [
        {
          "id": "minobu-residential-solar-2026",
          "government_level": "municipality",
          "prefecture_code": "19",
          "municipality_code": "19365",
          "program_name": "身延町住宅用太陽光発電システム設置費補助金",
          "housing_ages": [
            "existing",
            "new"
          ],
          "equipment_packages": [
            "solar_only",
            "solar_plus_standard_battery"
          ],
          "application_status": "accepting",
          "diagnostic_scope": {
            "status": "in_scope",
            "in_scope_housing_ages": [
              "existing",
              "new"
            ],
            "excluded_branch_ids": [],
            "basis": "固定額5万円として標準PVへ算入可能な候補とする．"
          },
          "expense_scopes": [
            "solar"
          ],
          "conflict_program_ids": [],
          "official_urls": [
            "https://www.town.minobu.lg.jp/page/1382.html"
          ],
          "confirmed_at": "2026-09-20",
          "required_confirmations": [
            "固定額5万円として標準PVへ算入可能な候補とする．",
            "申請時点の受付継続，予算残額，対象地域，施工者，納税，居住及び着工時期等の個別要件を確認する．"
          ],
          "machine_rule": "kansai_municipal_formula",
          "fit_compatible": true,
          "formula_components": [
            {
              "scope": "solar",
              "equipment_packages": [
                "solar_only",
                "solar_plus_standard_battery"
              ],
              "formula_type": "fixed",
              "cost_scope": null,
              "cost_tax": null,
              "cap_yen": null,
              "rounding_unit_yen": 1,
              "fixed_amount_yen": 50000
            }
          ],
          "calculation_assumptions": [
            "電力受給契約を結ぶ住宅用PV1件につき50,000円を算入する．"
          ],
          "source_ids": [
            "kansai-19-minobu-residential-solar-2026-source-1"
          ]
        }
      ],
      "institutionalSource": "2f92005728ceb4cb52aa8a5ae5d39fff5d56b938ebdf7ae9bbb7ad50456cca57",
      "sections": [
        {
          "label": "太陽光",
          "text": "5万円です．",
          "supplement": []
        }
      ],
      "text": "5万円です．",
      "supplement": [],
      "commonSupplement": [],
      "equipment": "太陽光のみ"
    },
    "fujikawa-residential-solar-2026": {
      "prefecture": "19",
      "municipality": "19368",
      "recordId": "scheme-f06e58eadefbc39ca589",
      "targetYear": "2026",
      "branch": {
        "branch_id": "fujikawa-residential-solar-2026",
        "diagnostic_rule_ids": [
          "fujikawa-residential-solar-2026"
        ],
        "target_equipment": [
          "太陽光パネル"
        ],
        "application_start": [
          {
            "branch_id": "application",
            "label": "申請受付",
            "date": "2026-04-01"
          }
        ],
        "application_end": [
          {
            "branch_id": "application",
            "label": "申請受付",
            "date": "2027-03-31"
          }
        ],
        "application_status": "受付中",
        "amount": {
          "display_text": null,
          "evidence_status": "not_classified"
        },
        "official_conditions": [],
        "gaps": [],
        "evidence_urls": [
          "https://www.town.fujikawa.yamanashi.jp/docs/2023082300538/"
        ],
        "checked_at": "2026-09-20",
        "display_basis": "preparing",
        "migration_status": "pending_review",
        "legacy_municipal_rule_ids": []
      },
      "catalogAmount": {
        "raw_text": "PVは2万5千円/kW・上限5万円．\n併用・経費調整の原記録：同一設備への他補助との重複可否は交付要件に従う．",
        "display_text": null,
        "evidence_status": "not_classified"
      },
      "rules": [
        {
          "id": "fujikawa-residential-solar-2026",
          "government_level": "municipality",
          "prefecture_code": "19",
          "municipality_code": "19368",
          "program_name": "富士川町住宅用太陽光発電システム設置費補助金",
          "housing_ages": [
            "existing",
            "new"
          ],
          "equipment_packages": [
            "solar_only",
            "solar_plus_standard_battery"
          ],
          "application_status": "accepting",
          "diagnostic_scope": {
            "status": "in_scope",
            "in_scope_housing_ages": [
              "existing",
              "new"
            ],
            "excluded_branch_ids": [],
            "basis": "標準PVへ容量比例で算入可能な候補とする．"
          },
          "expense_scopes": [
            "solar"
          ],
          "conflict_program_ids": [],
          "official_urls": [
            "https://www.town.fujikawa.yamanashi.jp/docs/2023082300538/"
          ],
          "confirmed_at": "2026-09-20",
          "required_confirmations": [
            "標準PVへ容量比例で算入可能な候補とする．",
            "申請時点の受付継続，予算残額，対象地域，施工者，納税，居住及び着工時期等の個別要件を確認する．"
          ],
          "machine_rule": "kansai_municipal_formula",
          "fit_compatible": true,
          "formula_components": [
            {
              "scope": "solar",
              "equipment_packages": [
                "solar_only",
                "solar_plus_standard_battery"
              ],
              "formula_type": "capacity_rate",
              "cost_scope": null,
              "cost_tax": null,
              "cap_yen": 50000,
              "rounding_unit_yen": 1,
              "capacity_source": "solar_kw",
              "capacity_preprocessing": "none",
              "unit_amount_yen": 25000,
              "solar_output_max_kw_exclusive": 10,
              "capacity_cap": null
            }
          ],
          "calculation_assumptions": [
            "10 kW未満の入力PV容量へ25,000円／kW・上限50,000円を算入する．"
          ],
          "source_ids": [
            "kansai-19-fujikawa-residential-solar-2026-source-1"
          ]
        }
      ],
      "institutionalSource": "58eac0b142d4dc1b563651573a341f59e7fd17d0671fbc84b6be12eb0c05260d",
      "sections": [
        {
          "label": "太陽光",
          "text": "太陽光の出力1kWあたり2万5,000円です．",
          "supplement": [
            "（上限）5万円"
          ]
        }
      ],
      "text": "太陽光の出力1kWあたり2万5,000円です．",
      "supplement": [
        "（上限）5万円"
      ],
      "commonSupplement": [],
      "equipment": "太陽光",
      "savedSourceDetails": true
    },
    "showa-residential-solar-2026": {
      "prefecture": "19",
      "municipality": "19384",
      "recordId": "scheme-cc6a0940b0586eed0a85",
      "targetYear": "2026",
      "branch": {
        "branch_id": "showa-residential-solar-2026",
        "diagnostic_rule_ids": [
          "showa-residential-solar-2026"
        ],
        "target_equipment": [
          "太陽光パネル"
        ],
        "application_start": [
          {
            "branch_id": "application",
            "label": "申請受付",
            "date": "2026-04-01"
          }
        ],
        "application_end": [
          {
            "branch_id": "application",
            "label": "申請受付",
            "date": "2027-03-31"
          }
        ],
        "application_status": "受付中",
        "amount": {
          "display_text": "住宅用太陽光の設置1件当たり50,000円の定額です．容量単価や費用に対する率ではなく，可搬型蓄電池等の別制度の額を加算しません．同一設備への他補助との重複可否等は交付要件によります．",
          "evidence_status": "partial"
        },
        "official_conditions": [],
        "gaps": [],
        "evidence_urls": [
          "https://www.town.showa.yamanashi.jp/soshiki/8/13898.html",
          "https://www.town.showa.yamanashi.jp/soshiki/8/1609.html"
        ],
        "checked_at": "2026-09-20",
        "display_basis": "preparing",
        "migration_status": "pending_review",
        "legacy_municipal_rule_ids": []
      },
      "catalogAmount": {
        "raw_text": "住宅用PVは5万円／件．\n併用・経費調整の原記録：同一設備への他補助との重複可否は交付要件に従う．",
        "display_text": "住宅用太陽光の設置1件当たり50,000円の定額です．容量単価や費用に対する率ではなく，可搬型蓄電池等の別制度の額を加算しません．同一設備への他補助との重複可否等は交付要件によります．",
        "evidence_status": "partial"
      },
      "rules": [
        {
          "id": "showa-residential-solar-2026",
          "government_level": "municipality",
          "prefecture_code": "19",
          "municipality_code": "19384",
          "program_name": "昭和町住宅用太陽エネルギーシステム導入促進奨励金",
          "housing_ages": [
            "existing",
            "new"
          ],
          "equipment_packages": [
            "solar_only",
            "solar_plus_standard_battery"
          ],
          "application_status": "accepting",
          "diagnostic_scope": {
            "status": "in_scope",
            "in_scope_housing_ages": [
              "existing",
              "new"
            ],
            "excluded_branch_ids": [],
            "basis": "可搬型蓄電池の別制度は定置用蓄電池の対象外とし，PV固定額5万円だけを候補とする．"
          },
          "expense_scopes": [
            "solar"
          ],
          "conflict_program_ids": [],
          "official_urls": [
            "https://www.town.showa.yamanashi.jp/soshiki/8/13898.html",
            "https://www.town.showa.yamanashi.jp/soshiki/8/1609.html"
          ],
          "confirmed_at": "2026-09-20",
          "required_confirmations": [
            "可搬型蓄電池の別制度は定置用蓄電池の対象外とし，PV固定額5万円だけを候補とする．",
            "申請時点の受付継続，予算残額，対象地域，施工者，納税，居住及び着工時期等の個別要件を確認する．"
          ],
          "machine_rule": "kansai_municipal_formula",
          "fit_compatible": true,
          "formula_components": [
            {
              "scope": "solar",
              "equipment_packages": [
                "solar_only",
                "solar_plus_standard_battery"
              ],
              "formula_type": "fixed",
              "cost_scope": null,
              "cost_tax": null,
              "cap_yen": null,
              "rounding_unit_yen": 1,
              "fixed_amount_yen": 50000
            }
          ],
          "calculation_assumptions": [
            "住宅用PV1件につき50,000円を算入する．"
          ],
          "source_ids": [
            "kansai-19-showa-residential-solar-2026-source-1",
            "kansai-19-showa-residential-solar-2026-source-2"
          ]
        }
      ],
      "institutionalSource": "ad67d9861be87003739ad790983ceb70d6d44d516cb5fb6a8f4c50907319c9bc",
      "sections": [
        {
          "label": "太陽光",
          "text": "5万円です．",
          "supplement": []
        }
      ],
      "text": "5万円です．",
      "supplement": [],
      "commonSupplement": [],
      "equipment": "太陽光のみ"
    },
    "narusawa-environmental-equipment-2026": {
      "prefecture": "19",
      "municipality": "19429",
      "recordId": "scheme-bfe90f5e66d0bb3325ac",
      "targetYear": "2026",
      "branch": {
        "branch_id": "narusawa-environmental-equipment-2026",
        "diagnostic_rule_ids": [
          "narusawa-environmental-equipment-2026"
        ],
        "target_equipment": [
          "太陽光パネル"
        ],
        "application_start": [],
        "application_end": [],
        "application_status": "受付中",
        "amount": {
          "display_text": null,
          "evidence_status": "not_classified"
        },
        "official_conditions": [],
        "gaps": [],
        "evidence_urls": [
          "https://www.vill.narusawa.yamanashi.jp/gyosei/soshikikarasagasu/juminka/hojokin_joseiseido/1/526.html",
          "https://www.vill.narusawa.yamanashi.jp/material/files/group/7/kankyou_hojyo.pdf"
        ],
        "checked_at": "2026-09-20",
        "display_basis": "preparing",
        "migration_status": "pending_review",
        "legacy_municipal_rule_ids": []
      },
      "catalogAmount": {
        "raw_text": "住宅用PVの設置費用の2分の1，上限10万円．\n併用・経費調整の原記録：住宅用PV補助は同一人・同一世帯につき1回限り．",
        "display_text": null,
        "evidence_status": "not_classified"
      },
      "rules": [
        {
          "id": "narusawa-environmental-equipment-2026",
          "government_level": "municipality",
          "prefecture_code": "19",
          "municipality_code": "19429",
          "program_name": "鳴沢村環境対策施設設置補助金",
          "housing_ages": [
            "existing",
            "new"
          ],
          "equipment_packages": [
            "solar_only",
            "solar_plus_standard_battery"
          ],
          "application_status": "accepting",
          "diagnostic_scope": {
            "status": "in_scope",
            "in_scope_housing_ages": [
              "existing",
              "new"
            ],
            "excluded_branch_ids": [],
            "basis": "村公式現行導線と要綱がともに掲載されているため，PV費用連動・上限10万円の候補とする．"
          },
          "expense_scopes": [
            "solar"
          ],
          "conflict_program_ids": [],
          "official_urls": [
            "https://www.vill.narusawa.yamanashi.jp/gyosei/soshikikarasagasu/juminka/hojokin_joseiseido/1/526.html",
            "https://www.vill.narusawa.yamanashi.jp/material/files/group/7/kankyou_hojyo.pdf"
          ],
          "confirmed_at": "2026-09-20",
          "required_confirmations": [
            "村公式現行導線と要綱がともに掲載されているため，PV費用連動・上限10万円の候補とする．",
            "申請時点の受付継続，予算残額，対象地域，施工者，納税，居住及び着工時期等の個別要件を確認する．"
          ],
          "machine_rule": "kansai_municipal_formula",
          "fit_compatible": true,
          "formula_components": [
            {
              "scope": "solar",
              "equipment_packages": [
                "solar_only",
                "solar_plus_standard_battery"
              ],
              "formula_type": "cost_fraction",
              "cost_scope": "solar",
              "cost_tax": "approved_assumption_inclusive",
              "cap_yen": 100000,
              "rounding_unit_yen": 1000,
              "solar_output_max_kw_exclusive": 10,
              "fraction_numerator": 1,
              "fraction_denominator": 2
            }
          ],
          "calculation_assumptions": [
            "10 kW未満の住宅用PVについて，税込モデル設置費の2分の1・上限100,000円を千円未満切捨てで算入する．"
          ],
          "source_ids": [
            "kansai-19-narusawa-environmental-equipment-2026-source-1",
            "kansai-19-narusawa-environmental-equipment-2026-source-2"
          ]
        }
      ],
      "institutionalSource": "95d32a31ae4397a0f81591ad3e6ebcd2cd7e9e9c549642b096e85c19e6f36e75",
      "sections": [
        {
          "label": "太陽光",
          "text": "太陽光の設置費用の2分の1です．",
          "supplement": [
            "（適用条件）対象設備：住宅用PV",
            "（上限）10万円"
          ]
        }
      ],
      "text": "太陽光の設置費用の2分の1です．",
      "supplement": [
        "（適用条件）対象設備：住宅用PV",
        "（上限）10万円"
      ],
      "commonSupplement": [],
      "equipment": "太陽光",
      "savedSourceDetails": true
    },
    "nagano-20202-row-69-1-2026": {
      "prefecture": "20",
      "municipality": "20202",
      "recordId": "scheme-64076ceb5c3862e581ea",
      "targetYear": "2026",
      "branch": {
        "branch_id": "nagano-20202-row-69-1-2026",
        "diagnostic_rule_ids": [
          "nagano-20202-row-69-1-2026"
        ],
        "target_equipment": [
          "太陽光パネル",
          "蓄電池"
        ],
        "application_start": [],
        "application_end": [],
        "application_status": "受付中",
        "amount": {
          "display_text": null,
          "evidence_status": "not_classified"
        },
        "official_conditions": [],
        "gaps": [],
        "evidence_urls": [
          "https://www.city.matsumoto.nagano.jp/soshiki/85/4406.html",
          "https://www.city.matsumoto.nagano.jp/",
          "https://www.pref.nagano.lg.jp/zerocarbon/sai-ene/hojo.html",
          "https://www.pref.nagano.lg.jp/zerocarbon/sai-ene/documents/jyu-taku.pdf"
        ],
        "checked_at": "2026-09-20",
        "display_basis": "preparing",
        "migration_status": "pending_review",
        "legacy_municipal_rule_ids": []
      },
      "catalogAmount": {
        "raw_text": "PVは50,000円/kW・上限200,000円，定置型蓄電池は200,000円／件とする．PVの対象出力はモジュール合計とPCS定格出力の小さい値を用いる．\n併用・経費調整の原記録：長野県公式一覧では同一設備への併用可否を一律には確認できないため，申請時に国・県・当該自治体の要件を確認する．",
        "display_text": null,
        "evidence_status": "not_classified"
      },
      "rules": [
        {
          "id": "nagano-20202-row-69-1-2026",
          "government_level": "municipality",
          "prefecture_code": "20",
          "municipality_code": "20202",
          "program_name": "松本市住まいのゼロカーボン推進補助金",
          "housing_ages": [
            "existing",
            "new"
          ],
          "equipment_packages": [
            "solar_only",
            "solar_plus_standard_battery"
          ],
          "application_status": "accepting",
          "diagnostic_scope": {
            "status": "in_scope",
            "in_scope_housing_ages": [
              "existing",
              "new"
            ],
            "excluded_branch_ids": [],
            "basis": "2026年6月26日現在の長野県公式令和8年度住宅用一覧及びリンク先の通常申請案内を受付根拠とし，予算到達時は終了する．公式資料で確認された地区，施工者，税滞納，年齢又は世帯属性等の入力外条件だけを充足仮定とし，申請時確認事項として保持する．"
          },
          "expense_scopes": [
            "solar",
            "battery"
          ],
          "conflict_program_ids": [],
          "official_urls": [
            "https://www.city.matsumoto.nagano.jp/soshiki/85/4406.html",
            "https://www.city.matsumoto.nagano.jp/",
            "https://www.pref.nagano.lg.jp/zerocarbon/sai-ene/hojo.html",
            "https://www.pref.nagano.lg.jp/zerocarbon/sai-ene/documents/jyu-taku.pdf"
          ],
          "confirmed_at": "2026-09-20",
          "required_confirmations": [
            "2026年6月26日現在の長野県公式令和8年度住宅用一覧及びリンク先の通常申請案内を受付根拠とし，予算到達時は終了する．公式資料で確認された地区，施工者，税滞納，年齢又は世帯属性等の入力外条件だけを充足仮定とし，申請時確認事項として保持する．"
          ],
          "machine_rule": "kansai_municipal_formula",
          "fit_compatible": true,
          "formula_components": [
            {
              "scope": "solar",
              "equipment_packages": [
                "solar_only",
                "solar_plus_standard_battery"
              ],
              "formula_type": "capacity_rate",
              "cost_scope": null,
              "cost_tax": null,
              "cap_yen": 200000,
              "rounding_unit_yen": 1,
              "capacity_source": "solar_kw",
              "capacity_preprocessing": "none",
              "unit_amount_yen": 50000,
              "solar_output_max_kw_exclusive": 10,
              "capacity_cap": null
            },
            {
              "scope": "battery",
              "equipment_packages": [
                "solar_plus_standard_battery"
              ],
              "formula_type": "fixed",
              "cost_scope": null,
              "cost_tax": null,
              "cap_yen": null,
              "rounding_unit_yen": 1,
              "fixed_amount_yen": 200000
            }
          ],
          "calculation_assumptions": [
            "独立確認①PASS済み算式だけを構造化し，入力外条件を満たすモデル前提で算定する．",
            "申請時点の受付継続，予算残額，施工者，納税，居住，着工時期及び併用可否等の個別要件を確認する．"
          ],
          "source_ids": [
            "kansai-20-nagano-20202-row-69-1-2026-source-1",
            "kansai-20-nagano-20202-row-69-1-2026-source-2",
            "kansai-20-nagano-20202-row-69-1-2026-source-3",
            "kansai-20-nagano-20202-row-69-1-2026-source-4"
          ]
        }
      ],
      "institutionalSource": "1c0f148d696de2a30b8cad96016b22198d124a37085b7c6933a7a80a40217abd",
      "sections": [
        {
          "label": "太陽光",
          "text": "太陽光の出力1kWあたり5万円です．",
          "supplement": [
            "（算定対象）出力の基準：モジュール合計とPCS定格出力の小さい値",
            "（上限）20万円"
          ]
        },
        {
          "label": "蓄電池",
          "text": "20万円です．",
          "supplement": [
            "（適用条件）対象設備：定置型蓄電池"
          ]
        }
      ],
      "text": "太陽光：太陽光の出力1kWあたり5万円です．\n蓄電池：20万円です．",
      "supplement": [],
      "commonSupplement": [],
      "equipment": "太陽光・蓄電池",
      "savedSourceDetails": true
    },
    "nagano-20361-row-27-1-2026": {
      "prefecture": "20",
      "municipality": "20361",
      "recordId": "scheme-b33f3ab8f4bc892eed5d",
      "targetYear": "2026",
      "branch": {
        "branch_id": "nagano-20361-row-27-1-2026",
        "diagnostic_rule_ids": [
          "nagano-20361-row-27-1-2026"
        ],
        "target_equipment": [
          "太陽光パネル",
          "蓄電池"
        ],
        "application_start": [],
        "application_end": [],
        "application_status": "受付中",
        "amount": {
          "display_text": null,
          "evidence_status": "not_classified"
        },
        "official_conditions": [],
        "gaps": [],
        "evidence_urls": [
          "https://www.town.shimosuwa.lg.jp/www/contents/1710465664813/index.html",
          "https://www.town.shimosuwa.lg.jp/",
          "https://www.pref.nagano.lg.jp/zerocarbon/sai-ene/hojo.html",
          "https://www.pref.nagano.lg.jp/zerocarbon/sai-ene/documents/jyu-taku.pdf"
        ],
        "checked_at": "2026-09-20",
        "display_basis": "preparing",
        "migration_status": "pending_review",
        "legacy_municipal_rule_ids": []
      },
      "catalogAmount": {
        "raw_text": "PVは50,000円．蓄電池は国・県等の他補助額を購入費から控除した残額の10分の1・上限50,000円．\n併用・経費調整の原記録：国・県補助との併用可．他補助額を蓄電池購入費から控除する．",
        "display_text": null,
        "evidence_status": "not_classified"
      },
      "rules": [
        {
          "id": "nagano-20361-row-27-1-2026",
          "government_level": "municipality",
          "prefecture_code": "20",
          "municipality_code": "20361",
          "program_name": "下諏訪町ゼロカーボン補助金",
          "housing_ages": [
            "existing",
            "new"
          ],
          "equipment_packages": [
            "solar_only",
            "solar_plus_standard_battery"
          ],
          "application_status": "accepting",
          "diagnostic_scope": {
            "status": "in_scope",
            "in_scope_housing_ages": [
              "existing",
              "new"
            ],
            "excluded_branch_ids": [],
            "basis": "2026年6月26日現在の長野県公式令和8年度住宅用一覧及びリンク先の通常申請案内を受付根拠とし，予算到達時は終了する．公式資料で確認された地区，施工者，税滞納，年齢又は世帯属性等の入力外条件だけを充足仮定とし，申請時確認事項として保持する．"
          },
          "expense_scopes": [
            "solar",
            "battery"
          ],
          "conflict_program_ids": [],
          "official_urls": [
            "https://www.town.shimosuwa.lg.jp/www/contents/1710465664813/index.html",
            "https://www.town.shimosuwa.lg.jp/",
            "https://www.pref.nagano.lg.jp/zerocarbon/sai-ene/hojo.html",
            "https://www.pref.nagano.lg.jp/zerocarbon/sai-ene/documents/jyu-taku.pdf"
          ],
          "confirmed_at": "2026-09-20",
          "required_confirmations": [
            "2026年6月26日現在の長野県公式令和8年度住宅用一覧及びリンク先の通常申請案内を受付根拠とし，予算到達時は終了する．公式資料で確認された地区，施工者，税滞納，年齢又は世帯属性等の入力外条件だけを充足仮定とし，申請時確認事項として保持する．"
          ],
          "machine_rule": "kansai_municipal_formula",
          "fit_compatible": true,
          "formula_components": [
            {
              "scope": "solar",
              "equipment_packages": [
                "solar_only",
                "solar_plus_standard_battery"
              ],
              "formula_type": "fixed",
              "cost_scope": null,
              "cost_tax": null,
              "cap_yen": null,
              "rounding_unit_yen": 1,
              "fixed_amount_yen": 50000
            },
            {
              "scope": "battery",
              "equipment_packages": [
                "solar_plus_standard_battery"
              ],
              "formula_type": "cost_fraction",
              "cost_scope": "battery",
              "cost_tax": "approved_assumption_inclusive",
              "cap_yen": 50000,
              "rounding_unit_yen": 1,
              "fraction_numerator": 1,
              "fraction_denominator": 10,
              "deduct_other_subsidies": true
            }
          ],
          "calculation_assumptions": [
            "独立確認①PASS済み算式だけを構造化し，入力外条件を満たすモデル前提で算定する．",
            "申請時点の受付継続，予算残額，施工者，納税，居住，着工時期及び併用可否等の個別要件を確認する．"
          ],
          "source_ids": [
            "kansai-20-nagano-20361-row-27-1-2026-source-1",
            "kansai-20-nagano-20361-row-27-1-2026-source-2",
            "kansai-20-nagano-20361-row-27-1-2026-source-3",
            "kansai-20-nagano-20361-row-27-1-2026-source-4"
          ]
        }
      ],
      "institutionalSource": "07202b529593266e1e11de22b08c952d4dd66e40a605c4fcb624a73ca45a2dc5",
      "sections": [
        {
          "label": "太陽光",
          "text": "5万円です．",
          "supplement": []
        },
        {
          "label": "蓄電池",
          "text": "蓄電池の国・県等の他補助額を購入費から控除した残額の10分の1です．",
          "supplement": [
            "（上限）5万円"
          ]
        }
      ],
      "text": "太陽光：5万円です．\n蓄電池：蓄電池の国・県等の他補助額を購入費から控除した残額の10分の1です．",
      "supplement": [],
      "commonSupplement": [],
      "equipment": "太陽光・蓄電池",
      "savedSourceDetails": true
    },
    "nagano-20382-row-33-1-2026": {
      "prefecture": "20",
      "municipality": "20382",
      "recordId": "scheme-2038ad5396a087fda635",
      "targetYear": "2026",
      "branch": {
        "branch_id": "nagano-20382-row-33-1-2026",
        "diagnostic_rule_ids": [
          "nagano-20382-row-33-1-2026"
        ],
        "target_equipment": [
          "太陽光パネル",
          "蓄電池"
        ],
        "application_start": [],
        "application_end": [],
        "application_status": "受付対象外",
        "amount": {
          "display_text": null,
          "evidence_status": "not_classified"
        },
        "official_conditions": [],
        "gaps": [],
        "evidence_urls": [
          "https://www.town.tatsuno.lg.jp/gyosei/soshiki/somuka/kurashi_tetsuzuki/5/3292.html#R8",
          "https://www.town.tatsuno.lg.jp/",
          "https://www.pref.nagano.lg.jp/zerocarbon/sai-ene/hojo.html",
          "https://www.pref.nagano.lg.jp/zerocarbon/sai-ene/documents/jyu-taku.pdf"
        ],
        "checked_at": "2026-09-20",
        "display_basis": "preparing",
        "migration_status": "pending_review",
        "legacy_municipal_rule_ids": []
      },
      "catalogAmount": {
        "raw_text": "■太陽光発電設備\n１kWあたり2.5万円（上限額12.5万円）\n■定置型蓄電設備\n　１件あたり５万円\n併用・経費調整の原記録：長野県公式一覧では同一設備への併用可否を一律には確認できないため，申請時に国・県・当該自治体の要件を確認する．",
        "display_text": null,
        "evidence_status": "not_classified"
      },
      "rules": [
        {
          "id": "nagano-20382-row-33-1-2026",
          "government_level": "municipality",
          "prefecture_code": "20",
          "municipality_code": "20382",
          "program_name": "辰野町ゼロカーボン補助金",
          "housing_ages": [
            "existing",
            "new"
          ],
          "equipment_packages": [
            "solar_only",
            "solar_plus_standard_battery"
          ],
          "application_status": "closed",
          "diagnostic_scope": {
            "status": "in_scope",
            "in_scope_housing_ages": [
              "existing",
              "new"
            ],
            "excluded_branch_ids": [],
            "basis": "公式R8本文は予算上限到達による受付終了を明示する．ページ更新日2026年7月13日を終了実日へ読み替えない．正式独立レビューで現行診断への不適合又は受付終了を確認したため非算入とする．"
          },
          "expense_scopes": [
            "solar",
            "battery"
          ],
          "conflict_program_ids": [],
          "official_urls": [
            "https://www.town.tatsuno.lg.jp/gyosei/soshiki/somuka/kurashi_tetsuzuki/5/3292.html#R8",
            "https://www.town.tatsuno.lg.jp/",
            "https://www.pref.nagano.lg.jp/zerocarbon/sai-ene/hojo.html",
            "https://www.pref.nagano.lg.jp/zerocarbon/sai-ene/documents/jyu-taku.pdf"
          ],
          "confirmed_at": "2026-09-20",
          "required_confirmations": [
            "公式R8本文は予算上限到達による受付終了を明示する．ページ更新日2026年7月13日を終了実日へ読み替えない．正式独立レビューで現行診断への不適合又は受付終了を確認したため非算入とする．"
          ],
          "machine_rule": "kansai_municipal_non_adopted",
          "fit_compatible": true,
          "calculation_assumptions": [
            "独立確認①PASS済みの非採用理由を金額へ加えず0円で表示する．"
          ],
          "non_adoption_status": "excluded",
          "non_adoption_reason_code": "application_closed_or_fit_incompatible_or_out_of_scope",
          "source_ids": [
            "kansai-20-nagano-20382-row-33-1-2026-source-1",
            "kansai-20-nagano-20382-row-33-1-2026-source-2",
            "kansai-20-nagano-20382-row-33-1-2026-source-3",
            "kansai-20-nagano-20382-row-33-1-2026-source-4"
          ]
        }
      ],
      "institutionalSource": "ae145f679b850e3bf3c8106c72e30688888b6eb3ae58f5b2a1f966d3accdb921",
      "sections": [
        {
          "label": "太陽光",
          "text": "太陽光の出力1kWあたり2万5,000円です．",
          "supplement": [
            "（上限）12万5,000円"
          ]
        },
        {
          "label": "蓄電池",
          "text": "5万円です．",
          "supplement": [
            "（適用条件）対象設備：定置型蓄電設備"
          ]
        }
      ],
      "text": "太陽光：太陽光の出力1kWあたり2万5,000円です．\n蓄電池：5万円です．",
      "supplement": [],
      "commonSupplement": [],
      "equipment": "太陽光・蓄電池",
      "savedSourceDetails": true
    },
    "nagano-20404-row-50-1-2026": {
      "prefecture": "20",
      "municipality": "20404",
      "recordId": "scheme-efce31b5499aedb5c5eb",
      "targetYear": "2026",
      "branch": {
        "branch_id": "nagano-20404-row-50-1-2026",
        "diagnostic_rule_ids": [
          "nagano-20404-row-50-1-2026"
        ],
        "target_equipment": [
          "太陽光パネル",
          "蓄電池"
        ],
        "application_start": [],
        "application_end": [],
        "application_status": "不明",
        "amount": {
          "display_text": null,
          "evidence_status": "not_classified"
        },
        "official_conditions": [],
        "gaps": [],
        "evidence_urls": [
          "http://www.town.anan.nagano.jp/anan_town/hatsuden_chikuden_hojo/",
          "http://www.town.anan.nagano.jp/",
          "https://www.pref.nagano.lg.jp/zerocarbon/sai-ene/hojo.html",
          "https://www.pref.nagano.lg.jp/zerocarbon/sai-ene/documents/jyu-taku.pdf"
        ],
        "checked_at": "2026-09-20",
        "display_basis": "preparing",
        "migration_status": "pending_review",
        "legacy_municipal_rule_ids": []
      },
      "catalogAmount": {
        "raw_text": "■太陽光発電システム\n１ｋＷ当たり５万円（限度額20万円）\n\n\n\n■蓄電システム\nシステム設置に要した事業費の１/３\n（限度額30万円）\n併用・経費調整の原記録：長野県公式一覧では同一設備への併用可否を一律には確認できないため，申請時に国・県・当該自治体の要件を確認する．",
        "display_text": null,
        "evidence_status": "not_classified"
      },
      "rules": [
        {
          "id": "nagano-20404-row-50-1-2026",
          "government_level": "municipality",
          "prefecture_code": "20",
          "municipality_code": "20404",
          "program_name": "太陽光発電システム・蓄電システム設置費補助金交付要綱",
          "housing_ages": [
            "existing",
            "new"
          ],
          "equipment_packages": [
            "solar_only",
            "solar_plus_standard_battery"
          ],
          "application_status": "accepting",
          "diagnostic_scope": {
            "status": "in_scope",
            "in_scope_housing_ages": [
              "existing",
              "new"
            ],
            "excluded_branch_ids": [],
            "basis": "ユーザー承認済みの全国共通方針により，確認済み算式と明示したモデル仮定を現行入力へ適用して算入する．公式事実とモデル仮定を分離し，個別要件は申請時に確認する．"
          },
          "expense_scopes": [
            "solar",
            "battery"
          ],
          "conflict_program_ids": [],
          "official_urls": [
            "http://www.town.anan.nagano.jp/anan_town/hatsuden_chikuden_hojo/",
            "http://www.town.anan.nagano.jp/",
            "https://www.pref.nagano.lg.jp/zerocarbon/sai-ene/hojo.html",
            "https://www.pref.nagano.lg.jp/zerocarbon/sai-ene/documents/jyu-taku.pdf"
          ],
          "confirmed_at": "2026-09-20",
          "required_confirmations": [
            "申請時点の受付，予算残額，対象設備・製品，施工者，納税，居住，着工時期及び併用可否等の個別要件を確認する．"
          ],
          "machine_rule": "kansai_municipal_formula",
          "fit_compatible": true,
          "formula_components": [
            {
              "scope": "solar",
              "equipment_packages": [
                "solar_only",
                "solar_plus_standard_battery"
              ],
              "formula_type": "capacity_rate",
              "cost_scope": null,
              "cost_tax": null,
              "cap_yen": 200000,
              "rounding_unit_yen": 1,
              "capacity_source": "solar_kw",
              "capacity_preprocessing": "none",
              "unit_amount_yen": 50000,
              "capacity_cap": null
            },
            {
              "scope": "battery",
              "equipment_packages": [
                "solar_plus_standard_battery"
              ],
              "formula_type": "cost_fraction",
              "cost_scope": "battery",
              "cost_tax": "approved_assumption_inclusive",
              "cap_yen": 300000,
              "rounding_unit_yen": 1000,
              "fraction_numerator": 1,
              "fraction_denominator": 3,
              "deduct_other_subsidies": false
            }
          ],
          "calculation_assumptions": [
            "独立確認①PASS済み算式だけを構造化し，入力外条件を満たすモデル前提で算定する．",
            "申請時点の受付継続，予算残額，施工者，納税，居住，着工時期及び併用可否等の個別要件を確認する．",
            "令和8年度の公式制度一覧又は現行公式案内があり，終了・停止・開始前の明示がないため，診断上は受付継続を仮定する．"
          ],
          "source_ids": [
            "kansai-20-nagano-20404-row-50-1-2026-source-1",
            "kansai-20-nagano-20404-row-50-1-2026-source-2",
            "kansai-20-nagano-20404-row-50-1-2026-source-3",
            "kansai-20-nagano-20404-row-50-1-2026-source-4"
          ]
        }
      ],
      "institutionalSource": "ee00748afad52dbe0ef2a86db9f765d38be58db71be0bf8024ec6302bf696f4b",
      "sections": [
        {
          "label": "太陽光",
          "text": "太陽光の出力1kWあたり5万円です．",
          "supplement": [
            "（上限）20万円"
          ]
        },
        {
          "label": "蓄電池",
          "text": "蓄電池のシステム設置に要した事業費の3分の1です．",
          "supplement": [
            "（適用条件）対象設備：蓄電システム",
            "（上限）30万円"
          ]
        }
      ],
      "text": "太陽光：太陽光の出力1kWあたり5万円です．\n蓄電池：蓄電池のシステム設置に要した事業費の3分の1です．",
      "supplement": [],
      "commonSupplement": [],
      "equipment": "太陽光・蓄電池",
      "savedSourceDetails": true
    },
    "nagano-20410-row-53-1-2026": {
      "prefecture": "20",
      "municipality": "20410",
      "recordId": "scheme-060c1eb178faf73e5c47",
      "targetYear": "2026",
      "branch": {
        "branch_id": "nagano-20410-row-53-1-2026",
        "diagnostic_rule_ids": [
          "nagano-20410-row-53-1-2026"
        ],
        "target_equipment": [
          "太陽光パネル"
        ],
        "application_start": [],
        "application_end": [],
        "application_status": "受付中",
        "amount": {
          "display_text": null,
          "evidence_status": "not_classified"
        },
        "official_conditions": [],
        "gaps": [],
        "evidence_urls": [
          "https://www.nebamura.jp/nebalife/resident/",
          "https://www.nebamura.jp/",
          "https://www.pref.nagano.lg.jp/zerocarbon/sai-ene/hojo.html",
          "https://www.pref.nagano.lg.jp/zerocarbon/sai-ene/documents/jyu-taku.pdf"
        ],
        "checked_at": "2026-09-20",
        "display_basis": "preparing",
        "migration_status": "pending_review",
        "legacy_municipal_rule_ids": []
      },
      "catalogAmount": {
        "raw_text": "■太陽光発電システム\n　１kWあたり５万円（限度額20万円）\n併用・経費調整の原記録：長野県公式一覧では同一設備への併用可否を一律には確認できないため，申請時に国・県・当該自治体の要件を確認する．",
        "display_text": null,
        "evidence_status": "not_classified"
      },
      "rules": [
        {
          "id": "nagano-20410-row-53-1-2026",
          "government_level": "municipality",
          "prefecture_code": "20",
          "municipality_code": "20410",
          "program_name": "根羽村太陽光発電システム設置補助金",
          "housing_ages": [
            "existing",
            "new"
          ],
          "equipment_packages": [
            "solar_only",
            "solar_plus_standard_battery"
          ],
          "application_status": "accepting",
          "diagnostic_scope": {
            "status": "in_scope",
            "in_scope_housing_ages": [
              "existing",
              "new"
            ],
            "excluded_branch_ids": [],
            "basis": "2026年6月26日現在の長野県公式令和8年度住宅用一覧及びリンク先の通常申請案内を受付根拠とし，予算到達時は終了する．公式資料で確認された地区，施工者，税滞納，年齢又は世帯属性等の入力外条件だけを充足仮定とし，申請時確認事項として保持する．"
          },
          "expense_scopes": [
            "solar"
          ],
          "conflict_program_ids": [],
          "official_urls": [
            "https://www.nebamura.jp/nebalife/resident/",
            "https://www.nebamura.jp/",
            "https://www.pref.nagano.lg.jp/zerocarbon/sai-ene/hojo.html",
            "https://www.pref.nagano.lg.jp/zerocarbon/sai-ene/documents/jyu-taku.pdf"
          ],
          "confirmed_at": "2026-09-20",
          "required_confirmations": [
            "2026年6月26日現在の長野県公式令和8年度住宅用一覧及びリンク先の通常申請案内を受付根拠とし，予算到達時は終了する．公式資料で確認された地区，施工者，税滞納，年齢又は世帯属性等の入力外条件だけを充足仮定とし，申請時確認事項として保持する．"
          ],
          "machine_rule": "kansai_municipal_formula",
          "fit_compatible": true,
          "formula_components": [
            {
              "scope": "solar",
              "equipment_packages": [
                "solar_only",
                "solar_plus_standard_battery"
              ],
              "formula_type": "capacity_rate",
              "cost_scope": null,
              "cost_tax": null,
              "cap_yen": 200000,
              "rounding_unit_yen": 1,
              "capacity_source": "solar_kw",
              "capacity_preprocessing": "none",
              "unit_amount_yen": 50000,
              "capacity_cap": null
            }
          ],
          "calculation_assumptions": [
            "独立確認①PASS済み算式だけを構造化し，入力外条件を満たすモデル前提で算定する．",
            "申請時点の受付継続，予算残額，施工者，納税，居住，着工時期及び併用可否等の個別要件を確認する．"
          ],
          "source_ids": [
            "kansai-20-nagano-20410-row-53-1-2026-source-1",
            "kansai-20-nagano-20410-row-53-1-2026-source-2",
            "kansai-20-nagano-20410-row-53-1-2026-source-3",
            "kansai-20-nagano-20410-row-53-1-2026-source-4"
          ]
        }
      ],
      "institutionalSource": "188e39fb5bcaece5d3e802aceb29a3b45fe5081982342f4f9dbe1c5d3340be73",
      "sections": [
        {
          "label": "太陽光",
          "text": "太陽光の出力1kWあたり5万円です．",
          "supplement": [
            "（上限）20万円"
          ]
        }
      ],
      "text": "太陽光の出力1kWあたり5万円です．",
      "supplement": [
        "（上限）20万円"
      ],
      "commonSupplement": [],
      "equipment": "太陽光",
      "savedSourceDetails": true
    },
    "nagano-20422-row-64-1-2026": {
      "prefecture": "20",
      "municipality": "20422",
      "recordId": "scheme-1be2a80c081f8abeeae1",
      "targetYear": "2026",
      "branch": {
        "branch_id": "nagano-20422-row-64-1-2026",
        "diagnostic_rule_ids": [
          "nagano-20422-row-64-1-2026"
        ],
        "target_equipment": [
          "太陽光パネル",
          "蓄電池"
        ],
        "application_start": [],
        "application_end": [],
        "application_status": "受付中",
        "amount": {
          "display_text": null,
          "evidence_status": "not_classified"
        },
        "official_conditions": [],
        "gaps": [],
        "evidence_urls": [
          "https://www.town.agematsu.nagano.jp/kurashi/sumai_seikatsu/kannkyou/taiyoukouhojyo.html",
          "https://www.town.agematsu.nagano.jp/",
          "https://www.pref.nagano.lg.jp/zerocarbon/sai-ene/hojo.html",
          "https://www.pref.nagano.lg.jp/zerocarbon/sai-ene/documents/jyu-taku.pdf"
        ],
        "checked_at": "2026-09-20",
        "display_basis": "preparing",
        "migration_status": "pending_review",
        "legacy_municipal_rule_ids": []
      },
      "catalogAmount": {
        "raw_text": "■太陽光発電システム\n１kW当たり５万円　（限度額20万円）\n\n■蓄電システム\n１kWh当たり１万円　（限度額10万円）\n併用・経費調整の原記録：長野県補助との併用可．同一対象経費の重複は申請時に確認する．",
        "display_text": null,
        "evidence_status": "not_classified"
      },
      "rules": [
        {
          "id": "nagano-20422-row-64-1-2026",
          "government_level": "municipality",
          "prefecture_code": "20",
          "municipality_code": "20422",
          "program_name": "上松町太陽光発電システム等設置補助金",
          "housing_ages": [
            "existing",
            "new"
          ],
          "equipment_packages": [
            "solar_only",
            "solar_plus_standard_battery"
          ],
          "application_status": "accepting",
          "diagnostic_scope": {
            "status": "in_scope",
            "in_scope_housing_ages": [
              "existing",
              "new"
            ],
            "excluded_branch_ids": [],
            "basis": "2026年6月26日現在の長野県公式令和8年度住宅用一覧及びリンク先の通常申請案内を受付根拠とし，予算到達時は終了する．公式資料で確認された地区，施工者，税滞納，年齢又は世帯属性等の入力外条件だけを充足仮定とし，申請時確認事項として保持する．"
          },
          "expense_scopes": [
            "solar",
            "battery"
          ],
          "conflict_program_ids": [],
          "official_urls": [
            "https://www.town.agematsu.nagano.jp/kurashi/sumai_seikatsu/kannkyou/taiyoukouhojyo.html",
            "https://www.town.agematsu.nagano.jp/",
            "https://www.pref.nagano.lg.jp/zerocarbon/sai-ene/hojo.html",
            "https://www.pref.nagano.lg.jp/zerocarbon/sai-ene/documents/jyu-taku.pdf"
          ],
          "confirmed_at": "2026-09-20",
          "required_confirmations": [
            "2026年6月26日現在の長野県公式令和8年度住宅用一覧及びリンク先の通常申請案内を受付根拠とし，予算到達時は終了する．公式資料で確認された地区，施工者，税滞納，年齢又は世帯属性等の入力外条件だけを充足仮定とし，申請時確認事項として保持する．"
          ],
          "machine_rule": "kansai_municipal_formula",
          "fit_compatible": true,
          "formula_components": [
            {
              "scope": "solar",
              "equipment_packages": [
                "solar_only",
                "solar_plus_standard_battery"
              ],
              "formula_type": "capacity_rate",
              "cost_scope": null,
              "cost_tax": null,
              "cap_yen": 200000,
              "rounding_unit_yen": 1,
              "capacity_source": "solar_kw",
              "capacity_preprocessing": "none",
              "unit_amount_yen": 50000,
              "solar_output_max_kw_exclusive": 10,
              "capacity_cap": null
            },
            {
              "scope": "battery",
              "equipment_packages": [
                "solar_plus_standard_battery"
              ],
              "formula_type": "capacity_rate",
              "cost_scope": null,
              "cost_tax": null,
              "cap_yen": 100000,
              "rounding_unit_yen": 1,
              "capacity_source": "battery_kwh",
              "capacity_preprocessing": "none",
              "unit_amount_yen": 10000,
              "battery_capacity_min_kwh": 4,
              "capacity_cap": null
            }
          ],
          "calculation_assumptions": [
            "独立確認①PASS済み算式だけを構造化し，入力外条件を満たすモデル前提で算定する．",
            "申請時点の受付継続，予算残額，施工者，納税，居住，着工時期及び併用可否等の個別要件を確認する．"
          ],
          "source_ids": [
            "kansai-20-nagano-20422-row-64-1-2026-source-1",
            "kansai-20-nagano-20422-row-64-1-2026-source-2",
            "kansai-20-nagano-20422-row-64-1-2026-source-3",
            "kansai-20-nagano-20422-row-64-1-2026-source-4"
          ]
        }
      ],
      "institutionalSource": "19c3f37f397351edaae7599ad68f1fb4f707593f7fb6d7ad6f543ec4f1e7adbf",
      "sections": [
        {
          "label": "太陽光",
          "text": "太陽光の出力1kWあたり5万円です．",
          "supplement": [
            "（上限）20万円"
          ]
        },
        {
          "label": "蓄電池",
          "text": "蓄電池の容量1kWhあたり1万円です．",
          "supplement": [
            "（適用条件）対象設備：蓄電システム",
            "（上限）10万円"
          ]
        }
      ],
      "text": "太陽光：太陽光の出力1kWあたり5万円です．\n蓄電池：蓄電池の容量1kWhあたり1万円です．",
      "supplement": [],
      "commonSupplement": [],
      "equipment": "太陽光・蓄電池",
      "savedSourceDetails": true
    },
    "nagano-20563-row-97-1-2026": {
      "prefecture": "20",
      "municipality": "20563",
      "recordId": "scheme-6eb482f50d4219e2eb23",
      "targetYear": "2026",
      "branch": {
        "branch_id": "nagano-20563-row-97-1-2026",
        "diagnostic_rule_ids": [
          "nagano-20563-row-97-1-2026"
        ],
        "target_equipment": [
          "太陽光パネル"
        ],
        "application_start": [],
        "application_end": [],
        "application_status": "不明",
        "amount": {
          "display_text": null,
          "evidence_status": "not_classified"
        },
        "official_conditions": [],
        "gaps": [],
        "evidence_urls": [
          "https://www.vill.nozawaonsen.nagano.jp/www/contents/1050000000112/index.html",
          "https://www.vill.nozawaonsen.nagano.jp/",
          "https://www.pref.nagano.lg.jp/zerocarbon/sai-ene/hojo.html",
          "https://www.pref.nagano.lg.jp/zerocarbon/sai-ene/documents/jyu-taku.pdf"
        ],
        "checked_at": "2026-09-20",
        "display_basis": "preparing",
        "migration_status": "pending_review",
        "legacy_municipal_rule_ids": []
      },
      "catalogAmount": {
        "raw_text": "■太陽光発電システム\n１kW当たり4.2万円（限度額16.8万円）\n併用・経費調整の原記録：長野県公式一覧では同一設備への併用可否を一律には確認できないため，申請時に国・県・当該自治体の要件を確認する．",
        "display_text": null,
        "evidence_status": "not_classified"
      },
      "rules": [
        {
          "id": "nagano-20563-row-97-1-2026",
          "government_level": "municipality",
          "prefecture_code": "20",
          "municipality_code": "20563",
          "program_name": "野沢温泉村住宅用太陽光発電システム設置補助金",
          "housing_ages": [
            "existing",
            "new"
          ],
          "equipment_packages": [
            "solar_only",
            "solar_plus_standard_battery"
          ],
          "application_status": "accepting",
          "diagnostic_scope": {
            "status": "in_scope",
            "in_scope_housing_ages": [
              "existing",
              "new"
            ],
            "excluded_branch_ids": [],
            "basis": "ユーザー承認済みの全国共通方針により，確認済み算式と明示したモデル仮定を現行入力へ適用して算入する．公式事実とモデル仮定を分離し，個別要件は申請時に確認する．"
          },
          "expense_scopes": [
            "solar"
          ],
          "conflict_program_ids": [],
          "official_urls": [
            "https://www.vill.nozawaonsen.nagano.jp/www/contents/1050000000112/index.html",
            "https://www.vill.nozawaonsen.nagano.jp/",
            "https://www.pref.nagano.lg.jp/zerocarbon/sai-ene/hojo.html",
            "https://www.pref.nagano.lg.jp/zerocarbon/sai-ene/documents/jyu-taku.pdf"
          ],
          "confirmed_at": "2026-09-20",
          "required_confirmations": [
            "申請時点の受付，予算残額，対象設備・製品，施工者，納税，居住，着工時期及び併用可否等の個別要件を確認する．"
          ],
          "machine_rule": "kansai_municipal_formula",
          "fit_compatible": true,
          "formula_components": [
            {
              "scope": "solar",
              "equipment_packages": [
                "solar_only",
                "solar_plus_standard_battery"
              ],
              "formula_type": "capacity_rate",
              "cost_scope": null,
              "cost_tax": null,
              "cap_yen": 168000,
              "rounding_unit_yen": 1,
              "capacity_source": "solar_kw",
              "capacity_preprocessing": "none",
              "unit_amount_yen": 42000,
              "solar_output_max_kw_exclusive": 10,
              "capacity_cap": null
            }
          ],
          "calculation_assumptions": [
            "独立確認①PASS済み算式だけを構造化し，入力外条件を満たすモデル前提で算定する．",
            "申請時点の受付継続，予算残額，施工者，納税，居住，着工時期及び併用可否等の個別要件を確認する．",
            "令和8年度の公式制度一覧又は現行公式案内があり，終了・停止・開始前の明示がないため，診断上は受付継続を仮定する．"
          ],
          "source_ids": [
            "kansai-20-nagano-20563-row-97-1-2026-source-1",
            "kansai-20-nagano-20563-row-97-1-2026-source-2",
            "kansai-20-nagano-20563-row-97-1-2026-source-3",
            "kansai-20-nagano-20563-row-97-1-2026-source-4"
          ]
        }
      ],
      "institutionalSource": "250e65ed188d2afc79cab6f88951bb7e1f5b2884cc5f53c27f7d125d0288fea4",
      "sections": [
        {
          "label": "太陽光",
          "text": "太陽光の出力1kWあたり4万2,000円です．",
          "supplement": [
            "（上限）16万8,000円"
          ]
        }
      ],
      "text": "太陽光の出力1kWあたり4万2,000円です．",
      "supplement": [
        "（上限）16万8,000円"
      ],
      "commonSupplement": [],
      "equipment": "太陽光",
      "savedSourceDetails": true
    },
    "gifu-household-battery-2026": {
      "prefecture": "21",
      "municipality": "21201",
      "recordId": "scheme-1d0fa02b27c0624ec747",
      "targetYear": "2026",
      "branch": {
        "branch_id": "gifu-household-battery-2026",
        "diagnostic_rule_ids": [
          "gifu-household-battery-2026"
        ],
        "target_equipment": [
          "蓄電池"
        ],
        "application_start": [
          {
            "branch_id": "application",
            "label": "申請受付",
            "date": "2026-05-01"
          }
        ],
        "application_end": [
          {
            "branch_id": "application",
            "label": "申請受付",
            "date": ""
          }
        ],
        "application_status": "受付対象外",
        "amount": {
          "display_text": null,
          "evidence_status": "not_classified"
        },
        "official_conditions": [],
        "gaps": [],
        "evidence_urls": [
          "https://www.city.gifu.lg.jp/zero-carbon/support/1024914/1025364/1038318.html",
          "https://www.city.gifu.lg.jp/",
          "https://www.pref.gifu.lg.jp/page/489014.html"
        ],
        "checked_at": "2026-09-20",
        "display_basis": "preparing",
        "migration_status": "pending_review",
        "legacy_municipal_rule_ids": []
      },
      "catalogAmount": {
        "raw_text": "蓄電池の購入費及び設置工事費の合計額の3分の1を千円未満切捨て，上限5万円．\n併用・経費調整の原記録：国，公共団体その他の蓄電池補助及びDR家庭用蓄電池事業とは併用しない．",
        "display_text": null,
        "evidence_status": "not_classified"
      },
      "rules": [
        {
          "id": "gifu-household-battery-2026",
          "government_level": "municipality",
          "prefecture_code": "21",
          "municipality_code": "21201",
          "program_name": "岐阜市家庭用蓄電池普及促進補助金",
          "housing_ages": [
            "existing",
            "new"
          ],
          "equipment_packages": [
            "solar_plus_standard_battery"
          ],
          "application_status": "closed",
          "diagnostic_scope": {
            "status": "in_scope",
            "in_scope_housing_ages": [
              "existing",
              "new"
            ],
            "excluded_branch_ids": [],
            "basis": "算式は保持するが，確認日現在の受付終了により現行診断へは算入しない．"
          },
          "expense_scopes": [
            "battery"
          ],
          "conflict_program_ids": [],
          "official_urls": [
            "https://www.city.gifu.lg.jp/zero-carbon/support/1024914/1025364/1038318.html",
            "https://www.city.gifu.lg.jp/",
            "https://www.pref.gifu.lg.jp/page/489014.html"
          ],
          "confirmed_at": "2026-09-20",
          "required_confirmations": [
            "算式は保持するが，確認日現在の受付終了により現行診断へは算入しない．"
          ],
          "machine_rule": "kansai_municipal_non_adopted",
          "fit_compatible": true,
          "calculation_assumptions": [
            "独立確認①PASS済みの受付終了又は非FIT理由を金額へ加えず0円で表示する．"
          ],
          "non_adoption_status": "excluded",
          "non_adoption_reason_code": "application_closed_or_fit_incompatible",
          "source_ids": [
            "kansai-21-gifu-household-battery-2026-source-1",
            "kansai-21-gifu-household-battery-2026-source-2",
            "kansai-21-gifu-household-battery-2026-source-3"
          ]
        }
      ],
      "institutionalSource": "cfb367a022c75c436813e385ba97d538bab8360fc17b7db7a6652be2ee226a3c",
      "sections": [
        {
          "label": "蓄電池",
          "text": "蓄電池の購入費及び設置工事費の合計額の3分の1です．",
          "supplement": [
            "（上限）5万円",
            "（端数処理）1,000円未満切り捨て"
          ]
        }
      ],
      "text": "蓄電池の購入費及び設置工事費の合計額の3分の1です．",
      "supplement": [
        "（上限）5万円",
        "（端数処理）1,000円未満切り捨て"
      ],
      "commonSupplement": [],
      "equipment": "蓄電池",
      "savedSourceDetails": true
    },
    "shizuoka-22209-1-2026": {
      "prefecture": "22",
      "municipality": "22209",
      "recordId": "scheme-673a36a408f2909abd12",
      "targetYear": "2026",
      "branch": {
        "branch_id": "shizuoka-22209-1-2026",
        "diagnostic_rule_ids": [
          "shizuoka-22209-1-2026"
        ],
        "target_equipment": [
          "蓄電池"
        ],
        "application_start": [],
        "application_end": [],
        "application_status": "受付中",
        "amount": {
          "display_text": null,
          "evidence_status": "not_classified"
        },
        "official_conditions": [],
        "gaps": [],
        "evidence_urls": [
          "https://www.city.shimada.shizuoka.jp/kurashi-docs/281945682.html"
        ],
        "checked_at": "2026-09-20",
        "display_basis": "preparing",
        "migration_status": "pending_review",
        "legacy_municipal_rule_ids": []
      },
      "catalogAmount": {
        "raw_text": "定置用蓄電池は10万円／件．\n併用・経費調整の原記録：PV単体の補助枝はない．",
        "display_text": null,
        "evidence_status": "not_classified"
      },
      "rules": [
        {
          "id": "shizuoka-22209-1-2026",
          "government_level": "municipality",
          "prefecture_code": "22",
          "municipality_code": "22209",
          "program_name": "島田市住宅用省エネルギー設備設置費補助金",
          "housing_ages": [
            "existing",
            "new"
          ],
          "equipment_packages": [
            "solar_plus_standard_battery"
          ],
          "application_status": "accepting",
          "diagnostic_scope": {
            "status": "in_scope",
            "in_scope_housing_ages": [
              "existing",
              "new"
            ],
            "excluded_branch_ids": [],
            "basis": "標準PV・蓄電池同時設置では蓄電池枝10万円だけを候補額とする．"
          },
          "expense_scopes": [
            "battery"
          ],
          "conflict_program_ids": [],
          "official_urls": [
            "https://www.city.shimada.shizuoka.jp/kurashi-docs/281945682.html"
          ],
          "confirmed_at": "2026-09-20",
          "required_confirmations": [
            "標準PV・蓄電池同時設置では蓄電池枝10万円だけを候補額とする．"
          ],
          "machine_rule": "kansai_municipal_formula",
          "fit_compatible": true,
          "formula_components": [
            {
              "scope": "battery",
              "equipment_packages": [
                "solar_plus_standard_battery"
              ],
              "formula_type": "fixed",
              "cost_scope": null,
              "cost_tax": null,
              "cap_yen": null,
              "rounding_unit_yen": 1,
              "fixed_amount_yen": 100000
            }
          ],
          "calculation_assumptions": [
            "管理レビューPASS済み算式だけを構造化し，入力外条件を満たすモデル前提で算定する．",
            "申請時点の受付継続，予算残，施工者，納税，居住，着工時期及び併用可否等の個別要件を確認する．"
          ],
          "source_ids": [
            "kansai-22-shizuoka-22209-1-2026-source-1"
          ]
        }
      ],
      "institutionalSource": "05a2dc0737366829dc54c0ccb24e1317cee3124ad771e926f6de3efef62ca7e6",
      "sections": [
        {
          "label": "蓄電池",
          "text": "10万円です．",
          "supplement": [
            "（適用条件）対象設備：定置用蓄電池"
          ]
        }
      ],
      "text": "10万円です．",
      "supplement": [
        "（適用条件）対象設備：定置用蓄電池"
      ],
      "commonSupplement": [],
      "equipment": "蓄電池",
      "savedSourceDetails": true
    },
    "shizuoka-22212-1-2026": {
      "prefecture": "22",
      "municipality": "22212",
      "recordId": "scheme-414139d7d118f143bf71",
      "targetYear": "2026",
      "branch": {
        "branch_id": "shizuoka-22212-1-2026",
        "diagnostic_rule_ids": [
          "shizuoka-22212-1-2026"
        ],
        "target_equipment": [
          "太陽光パネル",
          "蓄電池"
        ],
        "application_start": [],
        "application_end": [],
        "application_status": "受付中",
        "amount": {
          "display_text": null,
          "evidence_status": "not_classified"
        },
        "official_conditions": [],
        "gaps": [],
        "evidence_urls": [
          "https://www.city.yaizu.lg.jp/life/kankyo/josei/solar.html"
        ],
        "checked_at": "2026-09-20",
        "display_basis": "preparing",
        "migration_status": "pending_review",
        "legacy_municipal_rule_ids": []
      },
      "catalogAmount": {
        "raw_text": "PVは5万円／件，家庭用蓄電池は4万円／件．\n併用・経費調整の原記録：設備間及び他制度との併用可否は申請時に公式要件を確認する．",
        "display_text": null,
        "evidence_status": "not_classified"
      },
      "rules": [
        {
          "id": "shizuoka-22212-1-2026",
          "government_level": "municipality",
          "prefecture_code": "22",
          "municipality_code": "22212",
          "program_name": "焼津市住宅用太陽光発電システム等設置事業補助金",
          "housing_ages": [
            "existing"
          ],
          "equipment_packages": [
            "solar_only",
            "solar_plus_standard_battery"
          ],
          "application_status": "accepting",
          "diagnostic_scope": {
            "status": "in_scope",
            "in_scope_housing_ages": [
              "existing"
            ],
            "excluded_branch_ids": [],
            "basis": "標準既存住宅の同時設置では合計9万円を候補額とする．"
          },
          "expense_scopes": [
            "solar",
            "battery"
          ],
          "conflict_program_ids": [],
          "official_urls": [
            "https://www.city.yaizu.lg.jp/life/kankyo/josei/solar.html"
          ],
          "confirmed_at": "2026-09-20",
          "required_confirmations": [
            "標準既存住宅の同時設置では合計9万円を候補額とする．"
          ],
          "machine_rule": "kansai_municipal_formula",
          "fit_compatible": true,
          "formula_components": [
            {
              "scope": "solar",
              "equipment_packages": [
                "solar_only",
                "solar_plus_standard_battery"
              ],
              "formula_type": "fixed",
              "cost_scope": null,
              "cost_tax": null,
              "cap_yen": null,
              "rounding_unit_yen": 1,
              "housing_ages": [
                "existing"
              ],
              "fixed_amount_yen": 50000
            },
            {
              "scope": "battery",
              "equipment_packages": [
                "solar_plus_standard_battery"
              ],
              "formula_type": "fixed",
              "cost_scope": null,
              "cost_tax": null,
              "cap_yen": null,
              "rounding_unit_yen": 1,
              "housing_ages": [
                "existing"
              ],
              "fixed_amount_yen": 40000
            }
          ],
          "calculation_assumptions": [
            "管理レビューPASS済み算式だけを構造化し，入力外条件を満たすモデル前提で算定する．",
            "申請時点の受付継続，予算残，施工者，納税，居住，着工時期及び併用可否等の個別要件を確認する．"
          ],
          "source_ids": [
            "kansai-22-shizuoka-22212-1-2026-source-1"
          ]
        }
      ],
      "institutionalSource": "9df70102408535da945ef54187987dadb05ee47738251cb0ca6c862cb6d808df",
      "sections": [
        {
          "label": "太陽光",
          "text": "5万円です．",
          "supplement": []
        },
        {
          "label": "蓄電池",
          "text": "4万円です．",
          "supplement": [
            "（適用条件）対象設備：家庭用蓄電池"
          ]
        }
      ],
      "text": "太陽光：5万円です．\n蓄電池：4万円です．",
      "supplement": [],
      "commonSupplement": [],
      "equipment": "太陽光・蓄電池",
      "savedSourceDetails": true
    },
    "shizuoka-22214-1-2026": {
      "prefecture": "22",
      "municipality": "22214",
      "recordId": "scheme-b7fed3b098cbaf182a90",
      "targetYear": "2026",
      "branch": {
        "branch_id": "shizuoka-22214-1-2026",
        "diagnostic_rule_ids": [
          "shizuoka-22214-1-2026"
        ],
        "target_equipment": [
          "蓄電池"
        ],
        "application_start": [],
        "application_end": [],
        "application_status": "受付中",
        "amount": {
          "display_text": null,
          "evidence_status": "not_classified"
        },
        "official_conditions": [],
        "gaps": [],
        "evidence_urls": [
          "https://www.city.fujieda.shizuoka.jp/soshiki/kankyosuido/kankyoseisaku/gyomu/2/kakushuhojokin0/16930.html"
        ],
        "checked_at": "2026-09-20",
        "display_basis": "preparing",
        "migration_status": "pending_review",
        "legacy_municipal_rule_ids": []
      },
      "catalogAmount": {
        "raw_text": "家庭用蓄電池は2万円/kWh，千円未満切捨て，上限6万円．\n併用・経費調整の原記録：設備間及び他制度との併用可否は申請時に公式要件を確認する．",
        "display_text": null,
        "evidence_status": "not_classified"
      },
      "rules": [
        {
          "id": "shizuoka-22214-1-2026",
          "government_level": "municipality",
          "prefecture_code": "22",
          "municipality_code": "22214",
          "program_name": "藤枝市家庭用蓄電池設置費補助金",
          "housing_ages": [
            "existing",
            "new"
          ],
          "equipment_packages": [
            "solar_plus_standard_battery"
          ],
          "application_status": "accepting",
          "diagnostic_scope": {
            "status": "in_scope",
            "in_scope_housing_ages": [
              "existing",
              "new"
            ],
            "excluded_branch_ids": [],
            "basis": "標準蓄電池9.5kWhでは上限6万円を候補額とする．"
          },
          "expense_scopes": [
            "battery"
          ],
          "conflict_program_ids": [],
          "official_urls": [
            "https://www.city.fujieda.shizuoka.jp/soshiki/kankyosuido/kankyoseisaku/gyomu/2/kakushuhojokin0/16930.html"
          ],
          "confirmed_at": "2026-09-20",
          "required_confirmations": [
            "標準蓄電池9.5kWhでは上限6万円を候補額とする．"
          ],
          "machine_rule": "kansai_municipal_formula",
          "fit_compatible": true,
          "formula_components": [
            {
              "scope": "battery",
              "equipment_packages": [
                "solar_plus_standard_battery"
              ],
              "formula_type": "capacity_rate",
              "cost_scope": null,
              "cost_tax": null,
              "cap_yen": 60000,
              "rounding_unit_yen": 1000,
              "capacity_source": "battery_kwh",
              "capacity_preprocessing": "none",
              "unit_amount_yen": 20000,
              "capacity_cap": null
            }
          ],
          "calculation_assumptions": [
            "管理レビューPASS済み算式だけを構造化し，入力外条件を満たすモデル前提で算定する．",
            "申請時点の受付継続，予算残，施工者，納税，居住，着工時期及び併用可否等の個別要件を確認する．"
          ],
          "source_ids": [
            "kansai-22-shizuoka-22214-1-2026-source-1"
          ]
        }
      ],
      "institutionalSource": "989a6e72a78ea244036f5207575e1590710aba171f5343b8c4e75547f7dfe759",
      "sections": [
        {
          "label": "蓄電池",
          "text": "蓄電池の容量1kWhあたり2万円です．",
          "supplement": [
            "（適用条件）対象設備：家庭用蓄電池",
            "（上限）6万円",
            "（端数処理）1,000円未満切り捨て"
          ]
        }
      ],
      "text": "蓄電池の容量1kWhあたり2万円です．",
      "supplement": [
        "（適用条件）対象設備：家庭用蓄電池",
        "（上限）6万円",
        "（端数処理）1,000円未満切り捨て"
      ],
      "commonSupplement": [],
      "equipment": "蓄電池",
      "savedSourceDetails": true
    },
    "shizuoka-22219-1-2026": {
      "prefecture": "22",
      "municipality": "22219",
      "recordId": "scheme-58cd3906ca9d120753c1",
      "targetYear": "2026",
      "branch": {
        "branch_id": "shizuoka-22219-1-2026",
        "diagnostic_rule_ids": [
          "shizuoka-22219-1-2026"
        ],
        "target_equipment": [
          "太陽光パネル"
        ],
        "application_start": [],
        "application_end": [],
        "application_status": "受付中",
        "amount": {
          "display_text": null,
          "evidence_status": "not_classified"
        },
        "official_conditions": [],
        "gaps": [],
        "evidence_urls": [
          "https://www.city.shimoda.shizuoka.jp/category/020800sumai_kentiku/147077.html"
        ],
        "checked_at": "2026-09-20",
        "display_basis": "preparing",
        "migration_status": "pending_review",
        "legacy_municipal_rule_ids": []
      },
      "catalogAmount": {
        "raw_text": "PVは3万円/kW・上限12万円．\n併用・経費調整の原記録：蓄電池枝はない．",
        "display_text": null,
        "evidence_status": "not_classified"
      },
      "rules": [
        {
          "id": "shizuoka-22219-1-2026",
          "government_level": "municipality",
          "prefecture_code": "22",
          "municipality_code": "22219",
          "program_name": "下田市住宅用太陽光発電システム設置費補助金",
          "housing_ages": [
            "existing",
            "new"
          ],
          "equipment_packages": [
            "solar_only",
            "solar_plus_standard_battery"
          ],
          "application_status": "accepting",
          "diagnostic_scope": {
            "status": "in_scope",
            "in_scope_housing_ages": [
              "existing",
              "new"
            ],
            "excluded_branch_ids": [],
            "basis": "標準4kWでは12万円を候補額とする．"
          },
          "expense_scopes": [
            "solar"
          ],
          "conflict_program_ids": [],
          "official_urls": [
            "https://www.city.shimoda.shizuoka.jp/category/020800sumai_kentiku/147077.html"
          ],
          "confirmed_at": "2026-09-20",
          "required_confirmations": [
            "標準4kWでは12万円を候補額とする．"
          ],
          "machine_rule": "kansai_municipal_formula",
          "fit_compatible": true,
          "formula_components": [
            {
              "scope": "solar",
              "equipment_packages": [
                "solar_only",
                "solar_plus_standard_battery"
              ],
              "formula_type": "capacity_rate",
              "cost_scope": null,
              "cost_tax": null,
              "cap_yen": 120000,
              "rounding_unit_yen": 1,
              "capacity_source": "solar_kw",
              "capacity_preprocessing": "none",
              "unit_amount_yen": 30000,
              "capacity_cap": null
            }
          ],
          "calculation_assumptions": [
            "管理レビューPASS済み算式だけを構造化し，入力外条件を満たすモデル前提で算定する．",
            "申請時点の受付継続，予算残，施工者，納税，居住，着工時期及び併用可否等の個別要件を確認する．"
          ],
          "source_ids": [
            "kansai-22-shizuoka-22219-1-2026-source-1"
          ]
        }
      ],
      "institutionalSource": "b1bba61342314a4efd76c60048d1db2e1489772ba4ce2fce4828eae3f3e6be53",
      "sections": [
        {
          "label": "太陽光",
          "text": "太陽光の出力1kWあたり3万円です．",
          "supplement": [
            "（上限）12万円"
          ]
        }
      ],
      "text": "太陽光の出力1kWあたり3万円です．",
      "supplement": [
        "（上限）12万円"
      ],
      "commonSupplement": [],
      "equipment": "太陽光",
      "savedSourceDetails": true
    },
    "shizuoka-22341-1-2026": {
      "prefecture": "22",
      "municipality": "22341",
      "recordId": "scheme-3f29bf4451d32e21d7c0",
      "targetYear": "2026",
      "branch": {
        "branch_id": "shizuoka-22341-1-2026",
        "diagnostic_rule_ids": [
          "shizuoka-22341-1-2026"
        ],
        "target_equipment": [
          "蓄電池"
        ],
        "application_start": [],
        "application_end": [],
        "application_status": "受付中",
        "amount": {
          "display_text": null,
          "evidence_status": "not_classified"
        },
        "official_conditions": [],
        "gaps": [],
        "evidence_urls": [
          "https://www.town.shimizu.shizuoka.jp/chiiki/chiiki00022.html"
        ],
        "checked_at": "2026-09-20",
        "display_basis": "preparing",
        "migration_status": "pending_review",
        "legacy_municipal_rule_ids": []
      },
      "catalogAmount": {
        "raw_text": "家庭用蓄電池は5万円／件．\n併用・経費調整の原記録：PV単体枝はない．",
        "display_text": null,
        "evidence_status": "not_classified"
      },
      "rules": [
        {
          "id": "shizuoka-22341-1-2026",
          "government_level": "municipality",
          "prefecture_code": "22",
          "municipality_code": "22341",
          "program_name": "清水町家庭用蓄電池システム補助金",
          "housing_ages": [
            "existing",
            "new"
          ],
          "equipment_packages": [
            "solar_plus_standard_battery"
          ],
          "application_status": "accepting",
          "diagnostic_scope": {
            "status": "in_scope",
            "in_scope_housing_ages": [
              "existing",
              "new"
            ],
            "excluded_branch_ids": [],
            "basis": "標準同時設置では蓄電池枝5万円だけを候補額とする．"
          },
          "expense_scopes": [
            "battery"
          ],
          "conflict_program_ids": [],
          "official_urls": [
            "https://www.town.shimizu.shizuoka.jp/chiiki/chiiki00022.html"
          ],
          "confirmed_at": "2026-09-20",
          "required_confirmations": [
            "標準同時設置では蓄電池枝5万円だけを候補額とする．"
          ],
          "machine_rule": "kansai_municipal_formula",
          "fit_compatible": true,
          "formula_components": [
            {
              "scope": "battery",
              "equipment_packages": [
                "solar_plus_standard_battery"
              ],
              "formula_type": "fixed",
              "cost_scope": null,
              "cost_tax": null,
              "cap_yen": null,
              "rounding_unit_yen": 1,
              "fixed_amount_yen": 50000
            }
          ],
          "calculation_assumptions": [
            "管理レビューPASS済み算式だけを構造化し，入力外条件を満たすモデル前提で算定する．",
            "申請時点の受付継続，予算残，施工者，納税，居住，着工時期及び併用可否等の個別要件を確認する．"
          ],
          "source_ids": [
            "kansai-22-shizuoka-22341-1-2026-source-1"
          ]
        }
      ],
      "institutionalSource": "06e0096e87eb38e8b02fac0689a290f29a50a82ed08801e989d18dc56299a9c2",
      "sections": [
        {
          "label": "蓄電池",
          "text": "5万円です．",
          "supplement": [
            "（適用条件）対象設備：家庭用蓄電池"
          ]
        }
      ],
      "text": "5万円です．",
      "supplement": [
        "（適用条件）対象設備：家庭用蓄電池"
      ],
      "commonSupplement": [],
      "equipment": "蓄電池",
      "savedSourceDetails": true
    },
    "shizuoka-22342-1-2026": {
      "prefecture": "22",
      "municipality": "22342",
      "recordId": "scheme-28ea0c517a370be57c9a",
      "targetYear": "2026",
      "branch": {
        "branch_id": "shizuoka-22342-1-2026",
        "diagnostic_rule_ids": [
          "shizuoka-22342-1-2026"
        ],
        "target_equipment": [
          "太陽光パネル",
          "蓄電池"
        ],
        "application_start": [],
        "application_end": [],
        "application_status": "受付中",
        "amount": {
          "display_text": null,
          "evidence_status": "not_classified"
        },
        "official_conditions": [],
        "gaps": [],
        "evidence_urls": [
          "https://www.town.nagaizumi.lg.jp/soshiki/kurashikankyo/3_1/8926.html"
        ],
        "checked_at": "2026-09-20",
        "display_basis": "preparing",
        "migration_status": "pending_review",
        "legacy_municipal_rule_ids": []
      },
      "catalogAmount": {
        "raw_text": "PVは10万円／件，家庭用蓄電池は10万円／件．\n併用・経費調整の原記録：ZEH又はZEH+枝はPV・蓄電池等の設備枝と併用しない．標準設備経路では設備別枝を用いる．",
        "display_text": null,
        "evidence_status": "not_classified"
      },
      "rules": [
        {
          "id": "shizuoka-22342-1-2026",
          "government_level": "municipality",
          "prefecture_code": "22",
          "municipality_code": "22342",
          "program_name": "長泉町サステナブル住宅支援事業費補助金",
          "housing_ages": [
            "existing",
            "new"
          ],
          "equipment_packages": [
            "solar_only",
            "solar_plus_standard_battery"
          ],
          "application_status": "accepting",
          "diagnostic_scope": {
            "status": "in_scope",
            "in_scope_housing_ages": [
              "existing",
              "new"
            ],
            "excluded_branch_ids": [],
            "basis": "標準同時設置では設備別合計20万円を候補額とする．"
          },
          "expense_scopes": [
            "solar",
            "battery"
          ],
          "conflict_program_ids": [],
          "official_urls": [
            "https://www.town.nagaizumi.lg.jp/soshiki/kurashikankyo/3_1/8926.html"
          ],
          "confirmed_at": "2026-09-20",
          "required_confirmations": [
            "標準同時設置では設備別合計20万円を候補額とする．"
          ],
          "machine_rule": "kansai_municipal_formula",
          "fit_compatible": true,
          "formula_components": [
            {
              "scope": "solar",
              "equipment_packages": [
                "solar_only",
                "solar_plus_standard_battery"
              ],
              "formula_type": "fixed",
              "cost_scope": null,
              "cost_tax": null,
              "cap_yen": null,
              "rounding_unit_yen": 1,
              "fixed_amount_yen": 100000,
              "solar_output_min_kw": 3,
              "solar_output_max_kw_exclusive": 10
            },
            {
              "scope": "battery",
              "equipment_packages": [
                "solar_plus_standard_battery"
              ],
              "formula_type": "fixed",
              "cost_scope": null,
              "cost_tax": null,
              "cap_yen": null,
              "rounding_unit_yen": 1,
              "fixed_amount_yen": 100000
            }
          ],
          "calculation_assumptions": [
            "管理レビューPASS済み算式だけを構造化し，入力外条件を満たすモデル前提で算定する．",
            "申請時点の受付継続，予算残，施工者，納税，居住，着工時期及び併用可否等の個別要件を確認する．"
          ],
          "source_ids": [
            "kansai-22-shizuoka-22342-1-2026-source-1"
          ]
        }
      ],
      "institutionalSource": "9c59e9502e39cbf2bd755b7f5360dfda158285488983f33759d8f43beeecc165",
      "sections": [
        {
          "label": "太陽光",
          "text": "10万円です．",
          "supplement": []
        },
        {
          "label": "蓄電池",
          "text": "10万円です．",
          "supplement": [
            "（適用条件）対象設備：家庭用蓄電池"
          ]
        }
      ],
      "text": "太陽光：10万円です．\n蓄電池：10万円です．",
      "supplement": [],
      "commonSupplement": [],
      "equipment": "太陽光・蓄電池",
      "savedSourceDetails": true
    },
    "shizuoka-22344-1-2026": {
      "prefecture": "22",
      "municipality": "22344",
      "recordId": "scheme-53918e869f8458952fff",
      "targetYear": "2026",
      "branch": {
        "branch_id": "shizuoka-22344-1-2026",
        "diagnostic_rule_ids": [
          "shizuoka-22344-1-2026"
        ],
        "target_equipment": [
          "太陽光パネル",
          "蓄電池"
        ],
        "application_start": [],
        "application_end": [],
        "application_status": "受付中",
        "amount": {
          "display_text": null,
          "evidence_status": "not_classified"
        },
        "official_conditions": [],
        "gaps": [],
        "evidence_urls": [
          "https://www.fuji-oyama.jp/page/1223.html"
        ],
        "checked_at": "2026-09-20",
        "display_basis": "preparing",
        "migration_status": "pending_review",
        "legacy_municipal_rule_ids": []
      },
      "catalogAmount": {
        "raw_text": "PVは5万円／件，蓄電池は5万円／件．\n併用・経費調整の原記録：町が包括協定を締結した企業のJ-クレジットプログラム「そらいろラボ」へ入会し，環境価値を当該企業へ譲渡する．",
        "display_text": null,
        "evidence_status": "not_classified"
      },
      "rules": [
        {
          "id": "shizuoka-22344-1-2026",
          "government_level": "municipality",
          "prefecture_code": "22",
          "municipality_code": "22344",
          "program_name": "小山町クリーンエネルギー機器設置事業助成金",
          "housing_ages": [
            "existing",
            "new"
          ],
          "equipment_packages": [
            "solar_only",
            "solar_plus_standard_battery"
          ],
          "application_status": "accepting",
          "diagnostic_scope": {
            "status": "in_scope",
            "in_scope_housing_ages": [
              "existing",
              "new"
            ],
            "excluded_branch_ids": [],
            "basis": "標準同時設置では合計10万円を候補額とする．"
          },
          "expense_scopes": [
            "solar",
            "battery"
          ],
          "conflict_program_ids": [],
          "official_urls": [
            "https://www.fuji-oyama.jp/page/1223.html"
          ],
          "confirmed_at": "2026-09-20",
          "required_confirmations": [
            "標準同時設置では合計10万円を候補額とする．"
          ],
          "machine_rule": "kansai_municipal_formula",
          "fit_compatible": true,
          "formula_components": [
            {
              "scope": "solar",
              "equipment_packages": [
                "solar_only",
                "solar_plus_standard_battery"
              ],
              "formula_type": "fixed",
              "cost_scope": null,
              "cost_tax": null,
              "cap_yen": null,
              "rounding_unit_yen": 1,
              "fixed_amount_yen": 50000
            },
            {
              "scope": "battery",
              "equipment_packages": [
                "solar_plus_standard_battery"
              ],
              "formula_type": "fixed",
              "cost_scope": null,
              "cost_tax": null,
              "cap_yen": null,
              "rounding_unit_yen": 1,
              "fixed_amount_yen": 50000
            }
          ],
          "calculation_assumptions": [
            "管理レビューPASS済み算式だけを構造化し，入力外条件を満たすモデル前提で算定する．",
            "申請時点の受付継続，予算残，施工者，納税，居住，着工時期及び併用可否等の個別要件を確認する．",
            "包括協定企業のJ-クレジットプログラム『そらいろラボ』へ入会し，環境価値を当該企業へ譲渡する条件を満たす前提とする．"
          ],
          "source_ids": [
            "kansai-22-shizuoka-22344-1-2026-source-1"
          ]
        }
      ],
      "institutionalSource": "646a8999c17e1d0df5aed8e8f0c44fb00516a4a44b0595ec16558003a9f7cf16",
      "sections": [
        {
          "label": "太陽光",
          "text": "5万円です．",
          "supplement": []
        },
        {
          "label": "蓄電池",
          "text": "5万円です．",
          "supplement": []
        }
      ],
      "text": "太陽光：5万円です．\n蓄電池：5万円です．",
      "supplement": [],
      "commonSupplement": [],
      "equipment": "太陽光・蓄電池",
      "savedSourceDetails": true
    },
    "shizuoka-22461-1-2026": {
      "prefecture": "22",
      "municipality": "22461",
      "recordId": "scheme-cbb812879f0eeb9c2e1a",
      "targetYear": "2026",
      "branch": {
        "branch_id": "shizuoka-22461-1-2026",
        "diagnostic_rule_ids": [
          "shizuoka-22461-1-2026"
        ],
        "target_equipment": [
          "太陽光パネル",
          "蓄電池"
        ],
        "application_start": [],
        "application_end": [],
        "application_status": "受付中",
        "amount": {
          "display_text": null,
          "evidence_status": "not_classified"
        },
        "official_conditions": [],
        "gaps": [],
        "evidence_urls": [
          "https://www.town.morimachi.shizuoka.jp/gyosei/machinososhiki/juminseikatsuka/seikatsukankyokakari/2/694.html"
        ],
        "checked_at": "2026-09-20",
        "display_basis": "preparing",
        "migration_status": "pending_review",
        "legacy_municipal_rule_ids": []
      },
      "catalogAmount": {
        "raw_text": "PVは1万円/kW・上限5万円，千円未満切捨て．家庭用蓄電池は5万円／件．\n併用・経費調整の原記録：PVと蓄電池は同時申請可能だが，予算により一方だけ受付となる場合がある．",
        "display_text": null,
        "evidence_status": "not_classified"
      },
      "rules": [
        {
          "id": "shizuoka-22461-1-2026",
          "government_level": "municipality",
          "prefecture_code": "22",
          "municipality_code": "22461",
          "program_name": "森町新エネルギー機器等導入促進事業費補助金",
          "housing_ages": [
            "existing",
            "new"
          ],
          "equipment_packages": [
            "solar_only",
            "solar_plus_standard_battery"
          ],
          "application_status": "accepting",
          "diagnostic_scope": {
            "status": "in_scope",
            "in_scope_housing_ages": [
              "existing",
              "new"
            ],
            "excluded_branch_ids": [],
            "basis": "標準4kW・9.8kWhではPV4万円と蓄電池5万円，合計9万円を候補額とする．"
          },
          "expense_scopes": [
            "solar",
            "battery"
          ],
          "conflict_program_ids": [],
          "official_urls": [
            "https://www.town.morimachi.shizuoka.jp/gyosei/machinososhiki/juminseikatsuka/seikatsukankyokakari/2/694.html"
          ],
          "confirmed_at": "2026-09-20",
          "required_confirmations": [
            "標準4kW・9.8kWhではPV4万円と蓄電池5万円，合計9万円を候補額とする．"
          ],
          "machine_rule": "kansai_municipal_formula",
          "fit_compatible": true,
          "formula_components": [
            {
              "scope": "solar",
              "equipment_packages": [
                "solar_only",
                "solar_plus_standard_battery"
              ],
              "formula_type": "capacity_rate",
              "cost_scope": null,
              "cost_tax": null,
              "cap_yen": 50000,
              "rounding_unit_yen": 1000,
              "capacity_source": "solar_kw",
              "capacity_preprocessing": "none",
              "unit_amount_yen": 10000,
              "solar_output_max_kw_exclusive": 10,
              "capacity_cap": null
            },
            {
              "scope": "battery",
              "equipment_packages": [
                "solar_plus_standard_battery"
              ],
              "formula_type": "fixed",
              "cost_scope": null,
              "cost_tax": null,
              "cap_yen": null,
              "rounding_unit_yen": 1,
              "fixed_amount_yen": 50000,
              "battery_capacity_min_kwh": 2
            }
          ],
          "calculation_assumptions": [
            "管理レビューPASS済み算式だけを構造化し，入力外条件を満たすモデル前提で算定する．",
            "申請時点の受付継続，予算残，施工者，納税，居住，着工時期及び併用可否等の個別要件を確認する．"
          ],
          "source_ids": [
            "kansai-22-shizuoka-22461-1-2026-source-1"
          ]
        }
      ],
      "institutionalSource": "51aa0bdd33abe9770623253c3577e4a644eab539d71a063a727718cb302548ed",
      "sections": [
        {
          "label": "太陽光",
          "text": "太陽光の出力1kWあたり1万円です．",
          "supplement": [
            "（上限）5万円",
            "（端数処理）1,000円未満切り捨て"
          ]
        },
        {
          "label": "蓄電池",
          "text": "5万円です．",
          "supplement": [
            "（適用条件）対象設備：家庭用蓄電池"
          ]
        }
      ],
      "text": "太陽光：太陽光の出力1kWあたり1万円です．\n蓄電池：5万円です．",
      "supplement": [],
      "commonSupplement": [],
      "equipment": "太陽光・蓄電池",
      "savedSourceDetails": true
    },
    "neyagawa-residential-pv-2026": {
      "prefecture": "27",
      "municipality": "27215",
      "recordId": "scheme-2cebd9e65d9c3dfe691a",
      "targetYear": "2026",
      "branch": {
        "branch_id": "neyagawa-residential-pv-2026",
        "diagnostic_rule_ids": [
          "neyagawa-residential-pv-2026"
        ],
        "target_equipment": [
          "太陽光パネル"
        ],
        "application_start": [
          {
            "branch_id": "main",
            "label": "交付申請",
            "date": "2026-04-01"
          }
        ],
        "application_end": [
          {
            "branch_id": "main",
            "label": "交付申請",
            "date": "2027-03-05"
          }
        ],
        "application_status": "受付中",
        "amount": {
          "display_text": null,
          "evidence_status": "not_classified"
        },
        "official_conditions": [],
        "gaps": [],
        "evidence_urls": [
          "https://www.city.neyagawa.osaka.jp/organization_list/kankyo/kankou_soumu/hojo/solar/index.html",
          "https://www.city.neyagawa.osaka.jp/organization_list/kankyo/kankou_soumu/hojo/solar/taiyoukou.html"
        ],
        "checked_at": "2026-09-19",
        "display_basis": "preparing",
        "migration_status": "pending_review",
        "legacy_municipal_rule_ids": []
      },
      "catalogAmount": {
        "raw_text": "min(30,000円×受給最大電力kW，120,000円)．1,000円未満切捨て．",
        "display_text": null,
        "evidence_status": "not_classified"
      },
      "rules": [
        {
          "id": "neyagawa-residential-pv-2026",
          "government_level": "municipality",
          "prefecture_code": "27",
          "municipality_code": "27215",
          "program_name": "寝屋川市太陽光発電システム設置費補助金",
          "housing_ages": [
            "existing",
            "new"
          ],
          "equipment_packages": [
            "solar_only",
            "solar_plus_standard_battery"
          ],
          "application_status": "accepting",
          "diagnostic_scope": {
            "status": "in_scope",
            "in_scope_housing_ages": [
              "existing",
              "new"
            ],
            "excluded_branch_ids": [],
            "basis": "独立確認済みの住宅用太陽光・定置用蓄電池枝を現行入力へ対応させる．"
          },
          "machine_rule": "kansai_municipal_formula",
          "fit_compatible": true,
          "expense_scopes": [
            "solar"
          ],
          "conflict_program_ids": [],
          "official_urls": [
            "https://www.city.neyagawa.osaka.jp/organization_list/kankyo/kankou_soumu/hojo/solar/index.html",
            "https://www.city.neyagawa.osaka.jp/organization_list/kankyo/kankou_soumu/hojo/solar/taiyoukou.html"
          ],
          "confirmed_at": "2026-09-19",
          "calculation_assumptions": [
            "入力太陽光容量を受給最大電力へ対応させる．"
          ],
          "required_confirmations": [
            "申請時点の受付，対象製品，居住・所有及び申請期限を確認する．"
          ],
          "formula_components": [
            {
              "scope": "solar",
              "equipment_packages": [
                "solar_only",
                "solar_plus_standard_battery"
              ],
              "formula_type": "capacity_rate",
              "cost_scope": null,
              "cost_tax": null,
              "cap_yen": 120000,
              "rounding_unit_yen": 1000,
              "capacity_source": "solar_kw",
              "capacity_preprocessing": "none",
              "unit_amount_yen": 30000,
              "capacity_cap": null
            }
          ],
          "source_ids": [
            "kansai-27-neyagawa-residential-pv-2026-source-1",
            "kansai-27-neyagawa-residential-pv-2026-source-2"
          ]
        }
      ],
      "institutionalSource": "ce7ce69a44503f9e9c99f1898520c39cc802da4081a37d864b3db08230b43443",
      "sections": [
        {
          "label": "太陽光",
          "text": "太陽光の出力1kWあたり3万円です．",
          "supplement": [
            "（算定対象）出力の基準：受給最大電力",
            "（上限）12万円",
            "（端数処理）最終補助額：1,000円未満切り捨て"
          ]
        }
      ],
      "text": "太陽光の出力1kWあたり3万円です．",
      "supplement": [
        "（算定対象）出力の基準：受給最大電力",
        "（上限）12万円",
        "（端数処理）最終補助額：1,000円未満切り捨て"
      ],
      "commonSupplement": [],
      "equipment": "太陽光",
      "savedSourceDetails": true
    },
    "okayama-33205-main-2026": {
      "prefecture": "33",
      "municipality": "33205",
      "recordId": "scheme-bd162386b67caefe1acd",
      "targetYear": "2026",
      "branch": {
        "branch_id": "okayama-33205-main-2026",
        "diagnostic_rule_ids": [
          "okayama-33205-main-2026"
        ],
        "target_equipment": [
          "蓄電池"
        ],
        "application_start": [
          {
            "branch_id": "battery",
            "label": "交付申請",
            "date": "2026-04-01"
          }
        ],
        "application_end": [
          {
            "branch_id": "battery",
            "label": "交付申請",
            "date": "2027-03-31"
          }
        ],
        "application_status": "受付中",
        "amount": {
          "display_text": null,
          "evidence_status": "not_classified"
        },
        "official_conditions": [],
        "gaps": [],
        "evidence_urls": [
          "https://www.city.kasaoka.okayama.jp/soshiki/18/54792.html",
          "https://www.city.kasaoka.okayama.jp/uploaded/attachment/47105.pdf"
        ],
        "checked_at": "2026-09-21",
        "display_basis": "preparing",
        "migration_status": "pending_review",
        "legacy_municipal_rule_ids": []
      },
      "catalogAmount": {
        "raw_text": "min(本体・付属機器・設置工事費×1/10，120,000円)．税区分：exclusive．対象経費から他補助額を控除した後に率を乗じる．千円未満切捨て．",
        "display_text": null,
        "evidence_status": "not_classified"
      },
      "rules": [
        {
          "id": "okayama-33205-main-2026",
          "government_level": "municipality",
          "prefecture_code": "33",
          "municipality_code": "33205",
          "program_name": "笠岡市スマートエネルギー導入補助金",
          "housing_ages": [
            "existing",
            "new"
          ],
          "equipment_packages": [
            "solar_plus_standard_battery"
          ],
          "application_status": "accepting",
          "diagnostic_scope": {
            "status": "in_scope",
            "in_scope_housing_ages": [
              "existing",
              "new"
            ],
            "excluded_branch_ids": [],
            "basis": "R8本文でBのみ対象．購入＋設置費を税抜，他補助控除後1/10，上限12万円，千円未満切捨て．SII製品，再エネ自家消費増目的．自己居住又は機器付き建売購入，賃貸共用部枝は対象外．市同種補助1住宅1回，市他制度不可・国県等可．4/1～3/31設置，完了3月又は3/31申請．"
          },
          "expense_scopes": [
            "battery"
          ],
          "conflict_program_ids": [],
          "official_urls": [
            "https://www.city.kasaoka.okayama.jp/soshiki/18/54792.html",
            "https://www.city.kasaoka.okayama.jp/uploaded/attachment/47105.pdf"
          ],
          "confirmed_at": "2026-09-21",
          "calculation_assumptions": [
            "公式所有要件の明記不足は空欄を維持し，本人所有・本人居住の戸建住宅という承認済みモデル前提を適用する．",
            "納税，過去受給，契約施工者，製品認定，申請期限等の入力外条件は満たすと仮定する．",
            "費用は公式税区分を優先し，明示なしだけ承認済み税込対応．明示的な併用禁止を優先する．",
            "現年度の通常募集案内に終了表示がないため受付継続を仮定．"
          ],
          "required_confirmations": [
            "R8本文でBのみ対象．購入＋設置費を税抜，他補助控除後1/10，上限12万円，千円未満切捨て．SII製品，再エネ自家消費増目的．自己居住又は機器付き建売購入，賃貸共用部枝は対象外．市同種補助1住宅1回，市他制度不可・国県等可．4/1～3/31設置，完了3月又は3/31申請．"
          ],
          "formula_components": [
            {
              "scope": "battery",
              "equipment_packages": [
                "solar_plus_standard_battery"
              ],
              "housing_ages": [
                "existing",
                "new"
              ],
              "formula_type": "cost_fraction",
              "cost_scope": "battery",
              "cost_tax": "exclusive",
              "cap_yen": 120000,
              "rounding_unit_yen": 1000,
              "deduct_other_subsidies": true,
              "fraction_numerator": 1,
              "fraction_denominator": 10
            }
          ],
          "machine_rule": "kansai_municipal_formula",
          "fit_compatible": true,
          "source_ids": [
            "kansai-33-okayama-33205-main-2026-source-1",
            "kansai-33-okayama-33205-main-2026-source-2"
          ]
        }
      ],
      "institutionalSource": "05b9882f38881fdd0f95325cf21a09c242b76a137ff70ad3157e9c760c214f79",
      "sections": [
        {
          "label": "蓄電池",
          "text": "税抜本体・付属機器・設置工事費から他補助額を差し引いた額の10分の1です．",
          "supplement": [
            "（上限）12万円",
            "（端数処理）最終補助額：1,000円未満切り捨て"
          ]
        }
      ],
      "text": "税抜本体・付属機器・設置工事費から他補助額を差し引いた額の10分の1です．",
      "supplement": [
        "（上限）12万円",
        "（端数処理）最終補助額：1,000円未満切り捨て"
      ],
      "commonSupplement": [],
      "equipment": "蓄電池",
      "savedSourceDetails": true
    },
    "okayama-33211-closed_or_incompatible-2026": {
      "prefecture": "33",
      "municipality": "33211",
      "recordId": "scheme-9923a2e16028158b6dfd",
      "targetYear": "2026",
      "branch": {
        "branch_id": "okayama-33211-closed_or_incompatible-2026",
        "diagnostic_rule_ids": [
          "okayama-33211-closed_or_incompatible-2026"
        ],
        "target_equipment": [
          "蓄電池"
        ],
        "application_start": [
          {
            "branch_id": "closed_or_incompatible",
            "label": "交付申請",
            "date": ""
          }
        ],
        "application_end": [
          {
            "branch_id": "closed_or_incompatible",
            "label": "交付申請",
            "date": ""
          }
        ],
        "application_status": "受付対象外",
        "amount": {
          "display_text": null,
          "evidence_status": "not_classified"
        },
        "official_conditions": [],
        "gaps": [],
        "evidence_urls": [
          "https://www.city.bizen.okayama.jp/soshiki/12/27998.html",
          "https://www.city.bizen.okayama.jp/uploaded/attachment/28961.pdf"
        ],
        "checked_at": "2026-09-21",
        "display_basis": "preparing",
        "migration_status": "pending_review",
        "legacy_municipal_rule_ids": []
      },
      "catalogAmount": {
        "raw_text": "min(対象経費（費目範囲未確認）×1/2，200,000円)．税区分：approved_assumption_inclusive．対象経費から他補助額を控除した後に率を乗じる．公式端数処理未確認，円単位概算．",
        "display_text": null,
        "evidence_status": "not_classified"
      },
      "rules": [
        {
          "id": "okayama-33211-closed_or_incompatible-2026",
          "government_level": "municipality",
          "prefecture_code": "33",
          "municipality_code": "33211",
          "program_name": "備前市ゼロ・カーボンシティ促進補助金",
          "housing_ages": [
            "existing",
            "new"
          ],
          "equipment_packages": [
            "solar_plus_standard_battery"
          ],
          "application_status": "closed",
          "diagnostic_scope": {
            "status": "branch_filtered",
            "in_scope_housing_ages": [],
            "excluded_branch_ids": [],
            "basis": "R8 7/10予算100％で受付終了．B対象費1/2上限20万円．PV記載は導入説明にあるが当年補助表にはB/EV/給湯器だけ． QAは未使用・新設・新築を明示し，国補助は対象費から控除．受付終了により算入なし．完全な費目・端数条項の確認は未完．"
          },
          "expense_scopes": [
            "battery"
          ],
          "conflict_program_ids": [],
          "official_urls": [
            "https://www.city.bizen.okayama.jp/soshiki/12/27998.html",
            "https://www.city.bizen.okayama.jp/uploaded/attachment/28961.pdf"
          ],
          "confirmed_at": "2026-09-21",
          "calculation_assumptions": [
            "確認不足又は対象外の枝は算入しない．未発見を制度不存在とは扱わない．"
          ],
          "required_confirmations": [
            "R8 7/10予算100％で受付終了．B対象費1/2上限20万円．PV記載は導入説明にあるが当年補助表にはB/EV/給湯器だけ． QAは未使用・新設・新築を明示し，国補助は対象費から控除．受付終了により算入なし．完全な費目・端数条項の確認は未完．"
          ],
          "machine_rule": "kansai_municipal_non_adopted",
          "non_adoption_status": "excluded",
          "non_adoption_reason_code": "application_closed",
          "fit_compatible": true,
          "source_ids": [
            "kansai-33-okayama-33211-closed_or_incompatible-2026-source-1",
            "kansai-33-okayama-33211-closed_or_incompatible-2026-source-2"
          ]
        }
      ],
      "institutionalSource": "12a5b5d82c72e095b2200ca3d915c5a85d68ba79a19a0dd88d6981e342286bc9",
      "sections": [
        {
          "label": "蓄電池",
          "text": "対象経費から他補助額を差し引いた額の2分の1です．",
          "supplement": [
            "（上限）20万円",
            "（未確認事項）対象経費の費目範囲",
            "（未確認事項）対象費用の税区分",
            "（未確認事項）最終補助額の端数処理"
          ]
        }
      ],
      "text": "対象経費から他補助額を差し引いた額の2分の1です．",
      "supplement": [
        "（上限）20万円",
        "（未確認事項）対象経費の費目範囲",
        "（未確認事項）対象費用の税区分",
        "（未確認事項）最終補助額の端数処理"
      ],
      "commonSupplement": [],
      "equipment": "蓄電池",
      "savedSourceDetails": true
    },
    "okayama-33215-closed_or_incompatible-2026": {
      "prefecture": "33",
      "municipality": "33215",
      "recordId": "scheme-2ae3a1a25a65317ae29d",
      "targetYear": "2026",
      "branch": {
        "branch_id": "okayama-33215-closed_or_incompatible-2026",
        "diagnostic_rule_ids": [
          "okayama-33215-closed_or_incompatible-2026"
        ],
        "target_equipment": [
          "蓄電池"
        ],
        "application_start": [
          {
            "branch_id": "closed_or_incompatible",
            "label": "交付申請",
            "date": ""
          }
        ],
        "application_end": [
          {
            "branch_id": "closed_or_incompatible",
            "label": "交付申請",
            "date": ""
          }
        ],
        "application_status": "受付対象外",
        "amount": {
          "display_text": null,
          "evidence_status": "not_classified"
        },
        "official_conditions": [],
        "gaps": [],
        "evidence_urls": [
          "https://www.city.mimasaka.lg.jp/soshiki/shimin/kankyo/kankyouhozen/7541.html",
          "https://www.city.mimasaka.lg.jp/material/files/group/14/syoeneyoko.pdf"
        ],
        "checked_at": "2026-09-21",
        "display_basis": "preparing",
        "migration_status": "pending_review",
        "legacy_municipal_rule_ids": []
      },
      "catalogAmount": {
        "raw_text": "min(本体・付属機器・設置工事費×1/3，100,000円)．税区分：exclusive．対象経費から他補助額を控除した後に率を乗じる．千円未満切捨て．",
        "display_text": null,
        "evidence_status": "not_classified"
      },
      "rules": [
        {
          "id": "okayama-33215-closed_or_incompatible-2026",
          "government_level": "municipality",
          "prefecture_code": "33",
          "municipality_code": "33215",
          "program_name": "美作市家庭の省エネ促進事業補助金",
          "housing_ages": [
            "existing"
          ],
          "equipment_packages": [
            "solar_plus_standard_battery"
          ],
          "application_status": "closed",
          "diagnostic_scope": {
            "status": "branch_filtered",
            "in_scope_housing_ages": [],
            "excluded_branch_ids": [],
            "basis": "R8予算到達で9/1受付終了．B購入又は設置費税抜1/3上限10万円，国補助控除．SII未使用，市内業者契約/施工，自己居住．4/1～翌1/29予定が前倒終了． 別URL8649は省エネ家電（エアコン・冷蔵庫・LED）で9/4終了，PV/B枝なし． 要綱第4条で千円切捨，第3条別表は自己居住住宅への設置，新築明示なし．新築明示未確認．受付終了により算入なし．"
          },
          "expense_scopes": [
            "battery"
          ],
          "conflict_program_ids": [],
          "official_urls": [
            "https://www.city.mimasaka.lg.jp/soshiki/shimin/kankyo/kankyouhozen/7541.html",
            "https://www.city.mimasaka.lg.jp/material/files/group/14/syoeneyoko.pdf"
          ],
          "confirmed_at": "2026-09-21",
          "calculation_assumptions": [
            "確認不足又は対象外の枝は算入しない．未発見を制度不存在とは扱わない．"
          ],
          "required_confirmations": [
            "R8予算到達で9/1受付終了．B購入又は設置費税抜1/3上限10万円，国補助控除．SII未使用，市内業者契約/施工，自己居住．4/1～翌1/29予定が前倒終了． 別URL8649は省エネ家電（エアコン・冷蔵庫・LED）で9/4終了，PV/B枝なし． 要綱第4条で千円切捨，第3条別表は自己居住住宅への設置，新築明示なし．新築明示未確認．受付終了により算入なし．"
          ],
          "machine_rule": "kansai_municipal_non_adopted",
          "non_adoption_status": "excluded",
          "non_adoption_reason_code": "application_closed",
          "fit_compatible": true,
          "source_ids": [
            "kansai-33-okayama-33215-closed_or_incompatible-2026-source-1",
            "kansai-33-okayama-33215-closed_or_incompatible-2026-source-2"
          ]
        }
      ],
      "institutionalSource": "dc610917462e80eff32093656e88575ca932c674f4055cac276eb350a0517116",
      "sections": [
        {
          "label": "蓄電池",
          "text": "税抜本体・付属機器・設置工事費から他補助額を差し引いた額の3分の1です．",
          "supplement": [
            "（上限）10万円",
            "（端数処理）最終補助額：1,000円未満切り捨て"
          ]
        }
      ],
      "text": "税抜本体・付属機器・設置工事費から他補助額を差し引いた額の3分の1です．",
      "supplement": [
        "（上限）10万円",
        "（端数処理）最終補助額：1,000円未満切り捨て"
      ],
      "commonSupplement": [],
      "equipment": "蓄電池",
      "savedSourceDetails": true
    },
    "okayama-33346-main-2026": {
      "prefecture": "33",
      "municipality": "33346",
      "recordId": "scheme-73e167513d17ce5c8750",
      "targetYear": "2026",
      "branch": {
        "branch_id": "okayama-33346-main-2026",
        "diagnostic_rule_ids": [
          "okayama-33346-main-2026"
        ],
        "target_equipment": [
          "蓄電池"
        ],
        "application_start": [
          {
            "branch_id": "battery",
            "label": "交付申請",
            "date": ""
          }
        ],
        "application_end": [
          {
            "branch_id": "battery",
            "label": "交付申請",
            "date": ""
          }
        ],
        "application_status": "受付中",
        "amount": {
          "display_text": null,
          "evidence_status": "not_classified"
        },
        "official_conditions": [],
        "gaps": [],
        "evidence_urls": [
          "https://www.town.wake.lg.jp/kurashi/sumai/hojokin_joseikin/1169.html",
          "https://www.town.wake.lg.jp/material/files/group/7/28.pdf",
          "https://www.town.wake.lg.jp/material/files/group/21/1.pdf"
        ],
        "checked_at": "2026-09-21",
        "display_basis": "preparing",
        "migration_status": "pending_review",
        "legacy_municipal_rule_ids": []
      },
      "catalogAmount": {
        "raw_text": "min(本体価格のみ×1/10，120,000円)．税区分：exclusive．対象経費から他補助額を控除した後に率を乗じる．千円未満切捨て．",
        "display_text": null,
        "evidence_status": "not_classified"
      },
      "rules": [
        {
          "id": "okayama-33346-main-2026",
          "government_level": "municipality",
          "prefecture_code": "33",
          "municipality_code": "33346",
          "program_name": "和気町家庭のスマートエネルギー化促進補助金",
          "housing_ages": [
            "existing",
            "new"
          ],
          "equipment_packages": [
            "solar_plus_standard_battery"
          ],
          "application_status": "accepting",
          "diagnostic_scope": {
            "status": "in_scope",
            "in_scope_housing_ages": [
              "existing",
              "new"
            ],
            "excluded_branch_ids": [],
            "basis": "R8更新・R9年度まで実施．PV/B本体価格1/10，他補助控除．省エネ種別共通上限12万円，PV含む場合15万円．PV+Bを単純加算不可．ZEH45万円住宅一式は設備枝と排他で別枝除外．居住予定は新築明示と扱わない． 概要は本体のみ税抜・施工費対象外，新築導入可．PV本体価格を総設置費に置換しない． 交付申請様式が千円切捨を明示．PV申請を含まないB単独申請では共通上限12万円とし，PV+B共同申請上限15万円を流用しない．"
          },
          "expense_scopes": [
            "battery"
          ],
          "conflict_program_ids": [],
          "official_urls": [
            "https://www.town.wake.lg.jp/kurashi/sumai/hojokin_joseikin/1169.html",
            "https://www.town.wake.lg.jp/material/files/group/7/28.pdf",
            "https://www.town.wake.lg.jp/material/files/group/21/1.pdf"
          ],
          "confirmed_at": "2026-09-21",
          "calculation_assumptions": [
            "公式所有要件の明記不足は空欄を維持し，本人所有・本人居住の戸建住宅という承認済みモデル前提を適用する．",
            "納税，過去受給，契約施工者，製品認定，申請期限等の入力外条件は満たすと仮定する．",
            "費用は公式税区分を優先し，明示なしだけ承認済み税込対応．明示的な併用禁止を優先する．",
            "現年度の通常募集案内に終了表示がないため受付継続を仮定．",
            "PV本体価格不明につきPV申請なしのB単独申請枝のみ算入．共通上限12万円．"
          ],
          "required_confirmations": [
            "R8更新・R9年度まで実施．PV/B本体価格1/10，他補助控除．省エネ種別共通上限12万円，PV含む場合15万円．PV+Bを単純加算不可．ZEH45万円住宅一式は設備枝と排他で別枝除外．居住予定は新築明示と扱わない． 概要は本体のみ税抜・施工費対象外，新築導入可．PV本体価格を総設置費に置換しない． 交付申請様式が千円切捨を明示．PV申請を含まないB単独申請では共通上限12万円とし，PV+B共同申請上限15万円を流用しない．",
            "PV本体価格のモデル入力がなく，設置工事を含むPV設置費へ置換しない．PV額とPV+B全体額は未算定，B単独申請枝のみ算入．"
          ],
          "formula_components": [
            {
              "scope": "battery",
              "equipment_packages": [
                "solar_plus_standard_battery"
              ],
              "housing_ages": [
                "existing",
                "new"
              ],
              "formula_type": "cost_fraction",
              "cost_scope": "battery_equipment",
              "cost_tax": "exclusive",
              "cap_yen": 120000,
              "rounding_unit_yen": 1000,
              "deduct_other_subsidies": true,
              "fraction_numerator": 1,
              "fraction_denominator": 10
            }
          ],
          "machine_rule": "kansai_municipal_formula",
          "fit_compatible": true,
          "source_ids": [
            "kansai-33-okayama-33346-main-2026-source-1",
            "kansai-33-okayama-33346-main-2026-source-2",
            "kansai-33-okayama-33346-main-2026-source-3"
          ]
        }
      ],
      "institutionalSource": "746078c6d8bf1b6c05776a3fe1f2b1f8c5887aac4058ea78a9f3c5855fb3d724",
      "sections": [
        {
          "label": "蓄電池",
          "text": "税抜本体価格のみから他補助額を差し引いた額の10分の1です．",
          "supplement": [
            "（上限）12万円",
            "（端数処理）最終補助額：1,000円未満切り捨て"
          ]
        }
      ],
      "text": "税抜本体価格のみから他補助額を差し引いた額の10分の1です．",
      "supplement": [
        "（上限）12万円",
        "（端数処理）最終補助額：1,000円未満切り捨て"
      ],
      "commonSupplement": [],
      "equipment": "蓄電池",
      "savedSourceDetails": true
    },
    "okayama-33346-unresolved_solar-2026": {
      "prefecture": "33",
      "municipality": "33346",
      "recordId": "scheme-73e167513d17ce5c8750",
      "targetYear": "2026",
      "branch": {
        "branch_id": "okayama-33346-unresolved_solar-2026",
        "diagnostic_rule_ids": [
          "okayama-33346-unresolved_solar-2026"
        ],
        "target_equipment": [
          "太陽光パネル"
        ],
        "application_start": [
          {
            "branch_id": "unresolved_solar",
            "label": "交付申請",
            "date": ""
          }
        ],
        "application_end": [
          {
            "branch_id": "unresolved_solar",
            "label": "交付申請",
            "date": ""
          }
        ],
        "application_status": "受付中",
        "amount": {
          "display_text": null,
          "evidence_status": "not_classified"
        },
        "official_conditions": [],
        "gaps": [],
        "evidence_urls": [
          "https://www.town.wake.lg.jp/kurashi/sumai/hojokin_joseikin/1169.html",
          "https://www.town.wake.lg.jp/material/files/group/7/28.pdf",
          "https://www.town.wake.lg.jp/material/files/group/21/1.pdf"
        ],
        "checked_at": "2026-09-21",
        "display_basis": "preparing",
        "migration_status": "pending_review",
        "legacy_municipal_rule_ids": []
      },
      "catalogAmount": {
        "raw_text": "min(本体価格のみ×1/10，150,000円)．税区分：exclusive．対象経費から他補助額を控除した後に率を乗じる．千円未満切捨て．",
        "display_text": null,
        "evidence_status": "not_classified"
      },
      "rules": [
        {
          "id": "okayama-33346-unresolved_solar-2026",
          "government_level": "municipality",
          "prefecture_code": "33",
          "municipality_code": "33346",
          "program_name": "和気町家庭のスマートエネルギー化促進補助金",
          "housing_ages": [
            "existing",
            "new"
          ],
          "equipment_packages": [
            "solar_only",
            "solar_plus_standard_battery"
          ],
          "application_status": "accepting",
          "diagnostic_scope": {
            "status": "branch_filtered",
            "in_scope_housing_ages": [],
            "excluded_branch_ids": [],
            "basis": "R8更新・R9年度まで実施．PV/B本体価格1/10，他補助控除．省エネ種別共通上限12万円，PV含む場合15万円．PV+Bを単純加算不可．ZEH45万円住宅一式は設備枝と排他で別枝除外．居住予定は新築明示と扱わない． 概要は本体のみ税抜・施工費対象外，新築導入可．PV本体価格を総設置費に置換しない． 交付申請様式が千円切捨を明示．PV申請を含まないB単独申請では共通上限12万円とし，PV+B共同申請上限15万円を流用しない．PV本体価格のモデル入力がなく，設置工事を含むPV設置費へ置換しない．PV額とPV+B全体額は未算定，B単独申請枝のみ算入．"
          },
          "expense_scopes": [
            "solar"
          ],
          "conflict_program_ids": [],
          "official_urls": [
            "https://www.town.wake.lg.jp/kurashi/sumai/hojokin_joseikin/1169.html",
            "https://www.town.wake.lg.jp/material/files/group/7/28.pdf",
            "https://www.town.wake.lg.jp/material/files/group/21/1.pdf"
          ],
          "confirmed_at": "2026-09-21",
          "calculation_assumptions": [
            "確認不足又は対象外の枝は算入しない．未発見を制度不存在とは扱わない．"
          ],
          "required_confirmations": [
            "R8更新・R9年度まで実施．PV/B本体価格1/10，他補助控除．省エネ種別共通上限12万円，PV含む場合15万円．PV+Bを単純加算不可．ZEH45万円住宅一式は設備枝と排他で別枝除外．居住予定は新築明示と扱わない． 概要は本体のみ税抜・施工費対象外，新築導入可．PV本体価格を総設置費に置換しない． 交付申請様式が千円切捨を明示．PV申請を含まないB単独申請では共通上限12万円とし，PV+B共同申請上限15万円を流用しない．PV本体価格のモデル入力がなく，設置工事を含むPV設置費へ置換しない．PV額とPV+B全体額は未算定，B単独申請枝のみ算入．"
          ],
          "machine_rule": "kansai_municipal_non_adopted",
          "non_adoption_status": "candidate",
          "non_adoption_reason_code": "eligible_cost_scope_unavailable",
          "fit_compatible": true,
          "source_ids": [
            "kansai-33-okayama-33346-unresolved_solar-2026-source-1",
            "kansai-33-okayama-33346-unresolved_solar-2026-source-2",
            "kansai-33-okayama-33346-unresolved_solar-2026-source-3"
          ]
        }
      ],
      "institutionalSource": "22198d034cb850aa9f503bbe4e7ce9b15040a7c11134116e17f136526d550b11",
      "sections": [
        {
          "label": "太陽光",
          "text": "税抜本体価格のみから他補助額を差し引いた額の10分の1です．",
          "supplement": [
            "（上限）15万円",
            "（端数処理）最終補助額：1,000円未満切り捨て"
          ]
        }
      ],
      "text": "税抜本体価格のみから他補助額を差し引いた額の10分の1です．",
      "supplement": [
        "（上限）15万円",
        "（端数処理）最終補助額：1,000円未満切り捨て"
      ],
      "commonSupplement": [],
      "equipment": "太陽光",
      "savedSourceDetails": true
    },
    "okayama-33423-choice_solar-2026": {
      "prefecture": "33",
      "municipality": "33423",
      "recordId": "scheme-303d75ea9293390ea29f",
      "targetYear": "2026",
      "branch": {
        "branch_id": "okayama-33423-choice_solar-2026",
        "diagnostic_rule_ids": [
          "okayama-33423-choice_solar-2026"
        ],
        "target_equipment": [
          "太陽光パネル"
        ],
        "application_start": [
          {
            "branch_id": "solar",
            "label": "交付申請",
            "date": "2026-04-01"
          }
        ],
        "application_end": [
          {
            "branch_id": "solar",
            "label": "交付申請",
            "date": "2027-03-25"
          }
        ],
        "application_status": "受付中",
        "amount": {
          "display_text": null,
          "evidence_status": "not_classified"
        },
        "official_conditions": [],
        "gaps": [],
        "evidence_urls": [
          "https://www.town.hayashima.lg.jp/soshiki/jogesuido/gyomu/sumai/958.html",
          "https://www1.g-reiki.net/town.hayashima/reiki_honbun/m228RG00000089.html"
        ],
        "checked_at": "2026-09-21",
        "display_basis": "preparing",
        "migration_status": "pending_review",
        "legacy_municipal_rule_ids": []
      },
      "catalogAmount": {
        "raw_text": "min(対象容量×20,000円，80,000円)．容量前処理：floor_0_01．千円未満切捨て．",
        "display_text": null,
        "evidence_status": "not_classified"
      },
      "rules": [
        {
          "id": "okayama-33423-choice_solar-2026",
          "government_level": "municipality",
          "prefecture_code": "33",
          "municipality_code": "33423",
          "program_name": "早島町住宅用スマートエネルギー導入促進補助金",
          "housing_ages": [
            "existing",
            "new"
          ],
          "equipment_packages": [
            "solar_only",
            "solar_plus_standard_battery"
          ],
          "application_status": "accepting",
          "diagnostic_scope": {
            "status": "in_scope",
            "in_scope_housing_ages": [
              "existing",
              "new"
            ],
            "excluded_branch_ids": [],
            "basis": "R8 9/1予算残211.4万円．自己所有居住，新築購入建設明示．PV2万円/kW上限8万円，B1/10上限10万円．同年度2種以上併用不可のため設備枝排他最大化．4/1～翌3/25受付，設置前年3/26～翌3/25． 要綱第3条税抜他補助控除，第4条千円切捨．PV module0.01切捨，B本体附属＋工事．"
          },
          "expense_scopes": [
            "solar"
          ],
          "conflict_program_ids": [
            "okayama-33423-choice_battery-2026"
          ],
          "official_urls": [
            "https://www.town.hayashima.lg.jp/soshiki/jogesuido/gyomu/sumai/958.html",
            "https://www1.g-reiki.net/town.hayashima/reiki_honbun/m228RG00000089.html"
          ],
          "confirmed_at": "2026-09-21",
          "calculation_assumptions": [
            "公式所有要件の明記不足は空欄を維持し，本人所有・本人居住の戸建住宅という承認済みモデル前提を適用する．",
            "納税，過去受給，契約施工者，製品認定，申請期限等の入力外条件は満たすと仮定する．",
            "費用は公式税区分を優先し，明示なしだけ承認済み税込対応．明示的な併用禁止を優先する．",
            "現年度の通常募集案内に終了表示がないため受付継続を仮定．"
          ],
          "required_confirmations": [
            "R8 9/1予算残211.4万円．自己所有居住，新築購入建設明示．PV2万円/kW上限8万円，B1/10上限10万円．同年度2種以上併用不可のため設備枝排他最大化．4/1～翌3/25受付，設置前年3/26～翌3/25． 要綱第3条税抜他補助控除，第4条千円切捨．PV module0.01切捨，B本体附属＋工事．"
          ],
          "formula_components": [
            {
              "scope": "solar",
              "equipment_packages": [
                "solar_only",
                "solar_plus_standard_battery"
              ],
              "housing_ages": [
                "existing",
                "new"
              ],
              "formula_type": "capacity_rate",
              "cost_scope": null,
              "cost_tax": null,
              "cap_yen": 80000,
              "rounding_unit_yen": 1000,
              "deduct_other_subsidies": false,
              "solar_output_max_kw_exclusive": 10,
              "capacity_source": "solar_kw",
              "capacity_preprocessing": "floor_0_01",
              "capacity_cap": null,
              "unit_amount_yen": 20000
            }
          ],
          "machine_rule": "kansai_municipal_formula",
          "fit_compatible": true,
          "source_ids": [
            "kansai-33-okayama-33423-choice_solar-2026-source-1",
            "kansai-33-okayama-33423-choice_solar-2026-source-2"
          ]
        }
      ],
      "institutionalSource": "5042d1b9f97b73f6ea38484af4fc499c677850011e7a185927b1b9785a788847",
      "sections": [
        {
          "label": "太陽光",
          "text": "太陽光の出力1kWあたり2万円です．",
          "supplement": [
            "（上限）8万円",
            "（端数処理）0.01kW未満切り捨て",
            "（端数処理）1,000円未満切り捨て"
          ]
        }
      ],
      "text": "太陽光の出力1kWあたり2万円です．",
      "supplement": [
        "（上限）8万円",
        "（端数処理）0.01kW未満切り捨て",
        "（端数処理）1,000円未満切り捨て"
      ],
      "commonSupplement": [],
      "equipment": "太陽光のみ"
    },
    "okayama-33423-choice_battery-2026": {
      "prefecture": "33",
      "municipality": "33423",
      "recordId": "scheme-303d75ea9293390ea29f",
      "targetYear": "2026",
      "branch": {
        "branch_id": "okayama-33423-choice_battery-2026",
        "diagnostic_rule_ids": [
          "okayama-33423-choice_battery-2026"
        ],
        "target_equipment": [
          "蓄電池"
        ],
        "application_start": [
          {
            "branch_id": "battery",
            "label": "交付申請",
            "date": "2026-04-01"
          }
        ],
        "application_end": [
          {
            "branch_id": "battery",
            "label": "交付申請",
            "date": "2027-03-25"
          }
        ],
        "application_status": "受付中",
        "amount": {
          "display_text": "蓄電池本体・付属機器・設置工事費の税抜対象経費から他補助額を控除し，控除後の額に1/10を掛け，上限100,000円と比較して千円未満を切り捨てます．補助額を算定した後に他補助を控除する扱いではありません．同年度に2種類以上の併用は不可で，太陽光の別枝とは排他です．蓄電池上限100,000円に太陽光の80,000円を加算しません．",
          "evidence_status": "partial"
        },
        "official_conditions": [],
        "gaps": [],
        "evidence_urls": [
          "https://www.town.hayashima.lg.jp/soshiki/jogesuido/gyomu/sumai/958.html",
          "https://www1.g-reiki.net/town.hayashima/reiki_honbun/m228RG00000089.html"
        ],
        "checked_at": "2026-09-21",
        "display_basis": "preparing",
        "migration_status": "pending_review",
        "legacy_municipal_rule_ids": []
      },
      "catalogAmount": {
        "raw_text": "min(本体・付属機器・設置工事費×1/10，100,000円)．税区分：exclusive．対象経費から他補助額を控除した後に率を乗じる．千円未満切捨て．",
        "display_text": "蓄電池本体・付属機器・設置工事費の税抜対象経費から他補助額を控除し，控除後の額に1/10を掛け，上限100,000円と比較して千円未満を切り捨てます．補助額を算定した後に他補助を控除する扱いではありません．同年度に2種類以上の併用は不可で，太陽光の別枝とは排他です．蓄電池上限100,000円に太陽光の80,000円を加算しません．",
        "evidence_status": "partial"
      },
      "rules": [
        {
          "id": "okayama-33423-choice_battery-2026",
          "government_level": "municipality",
          "prefecture_code": "33",
          "municipality_code": "33423",
          "program_name": "早島町住宅用スマートエネルギー導入促進補助金",
          "housing_ages": [
            "existing",
            "new"
          ],
          "equipment_packages": [
            "solar_plus_standard_battery"
          ],
          "application_status": "accepting",
          "diagnostic_scope": {
            "status": "in_scope",
            "in_scope_housing_ages": [
              "existing",
              "new"
            ],
            "excluded_branch_ids": [],
            "basis": "R8 9/1予算残211.4万円．自己所有居住，新築購入建設明示．PV2万円/kW上限8万円，B1/10上限10万円．同年度2種以上併用不可のため設備枝排他最大化．4/1～翌3/25受付，設置前年3/26～翌3/25． 要綱第3条税抜他補助控除，第4条千円切捨．PV module0.01切捨，B本体附属＋工事．"
          },
          "expense_scopes": [
            "battery"
          ],
          "conflict_program_ids": [
            "okayama-33423-choice_solar-2026"
          ],
          "official_urls": [
            "https://www.town.hayashima.lg.jp/soshiki/jogesuido/gyomu/sumai/958.html",
            "https://www1.g-reiki.net/town.hayashima/reiki_honbun/m228RG00000089.html"
          ],
          "confirmed_at": "2026-09-21",
          "calculation_assumptions": [
            "公式所有要件の明記不足は空欄を維持し，本人所有・本人居住の戸建住宅という承認済みモデル前提を適用する．",
            "納税，過去受給，契約施工者，製品認定，申請期限等の入力外条件は満たすと仮定する．",
            "費用は公式税区分を優先し，明示なしだけ承認済み税込対応．明示的な併用禁止を優先する．",
            "現年度の通常募集案内に終了表示がないため受付継続を仮定．"
          ],
          "required_confirmations": [
            "R8 9/1予算残211.4万円．自己所有居住，新築購入建設明示．PV2万円/kW上限8万円，B1/10上限10万円．同年度2種以上併用不可のため設備枝排他最大化．4/1～翌3/25受付，設置前年3/26～翌3/25． 要綱第3条税抜他補助控除，第4条千円切捨．PV module0.01切捨，B本体附属＋工事．"
          ],
          "formula_components": [
            {
              "scope": "battery",
              "equipment_packages": [
                "solar_plus_standard_battery"
              ],
              "housing_ages": [
                "existing",
                "new"
              ],
              "formula_type": "cost_fraction",
              "cost_scope": "battery",
              "cost_tax": "exclusive",
              "cap_yen": 100000,
              "rounding_unit_yen": 1000,
              "deduct_other_subsidies": true,
              "fraction_numerator": 1,
              "fraction_denominator": 10
            }
          ],
          "machine_rule": "kansai_municipal_formula",
          "fit_compatible": true,
          "source_ids": [
            "kansai-33-okayama-33423-choice_battery-2026-source-1",
            "kansai-33-okayama-33423-choice_battery-2026-source-2"
          ]
        }
      ],
      "institutionalSource": "60d58b9cf7bc5d15f8c9e424a8c3152551b7b59144a78906fd73a6dbc2677dfc",
      "sections": [
        {
          "label": "蓄電池",
          "text": "他補助額を控除した蓄電池本体・付属機器・設置工事費の税抜対象経費の10分の1です．",
          "supplement": [
            "（上限）10万円",
            "（端数処理）1,000円未満切り捨て"
          ]
        }
      ],
      "text": "他補助額を控除した蓄電池本体・付属機器・設置工事費の税抜対象経費の10分の1です．",
      "supplement": [
        "（上限）10万円",
        "（端数処理）1,000円未満切り捨て"
      ],
      "commonSupplement": [],
      "equipment": "蓄電池のみ"
    },
    "okayama-33461-unresolved-2026": {
      "prefecture": "33",
      "municipality": "33461",
      "recordId": "scheme-da2a5235165dfd03ce7f",
      "targetYear": "2026",
      "branch": {
        "branch_id": "okayama-33461-unresolved-2026",
        "diagnostic_rule_ids": [
          "okayama-33461-unresolved-2026"
        ],
        "target_equipment": [
          "蓄電池"
        ],
        "application_start": [
          {
            "branch_id": "unresolved",
            "label": "交付申請",
            "date": ""
          }
        ],
        "application_end": [
          {
            "branch_id": "unresolved",
            "label": "交付申請",
            "date": ""
          }
        ],
        "application_status": "受付中",
        "amount": {
          "display_text": null,
          "evidence_status": "not_classified"
        },
        "official_conditions": [],
        "gaps": [],
        "evidence_urls": [
          "http://www.town.yakage.okayama.jp/life/kankyo/hojyo.html",
          "https://www.town.yakage.okayama.jp/archive/令和８年度ホームページ掲載データ.zip"
        ],
        "checked_at": "2026-09-21",
        "display_basis": "preparing",
        "migration_status": "pending_review",
        "legacy_municipal_rule_ids": []
      },
      "catalogAmount": {
        "raw_text": "min(対象経費（費目範囲未確認）×1/10，150,000円)．税区分：inclusive．千円未満切捨て．",
        "display_text": null,
        "evidence_status": "not_classified"
      },
      "rules": [
        {
          "id": "okayama-33461-unresolved-2026",
          "government_level": "municipality",
          "prefecture_code": "33",
          "municipality_code": "33461",
          "program_name": "矢掛町スマートエネルギー導入促進補助",
          "housing_ages": [
            "existing",
            "new"
          ],
          "equipment_packages": [
            "solar_plus_standard_battery"
          ],
          "application_status": "accepting",
          "diagnostic_scope": {
            "status": "branch_filtered",
            "in_scope_housing_ages": [],
            "excluded_branch_ids": [],
            "basis": "R8予算900万円．B1/10上限15万円．自己所有居住（新築含む），事前申請4/1開始．他補助重複不可．PVは対象表なし． R8 ZIP内の申請記載例は導入経費税込・千円未満切捨．手続説明は町の他補助との併用禁止，本文は他補助一般禁止との表現差あり．費目の範囲は未確認．公式本文・ZIP様式・例規探索で導入経費の費目範囲が未確認．税と丸めは確認済みだが対象費用を推定して算入しない．"
          },
          "expense_scopes": [
            "battery"
          ],
          "conflict_program_ids": [],
          "official_urls": [
            "http://www.town.yakage.okayama.jp/life/kankyo/hojyo.html",
            "https://www.town.yakage.okayama.jp/archive/令和８年度ホームページ掲載データ.zip"
          ],
          "confirmed_at": "2026-09-21",
          "calculation_assumptions": [
            "確認不足又は対象外の枝は算入しない．未発見を制度不存在とは扱わない．"
          ],
          "required_confirmations": [
            "R8予算900万円．B1/10上限15万円．自己所有居住（新築含む），事前申請4/1開始．他補助重複不可．PVは対象表なし． R8 ZIP内の申請記載例は導入経費税込・千円未満切捨．手続説明は町の他補助との併用禁止，本文は他補助一般禁止との表現差あり．費目の範囲は未確認．公式本文・ZIP様式・例規探索で導入経費の費目範囲が未確認．税と丸めは確認済みだが対象費用を推定して算入しない．"
          ],
          "machine_rule": "kansai_municipal_non_adopted",
          "non_adoption_status": "candidate",
          "non_adoption_reason_code": "official_evidence_unresolved",
          "fit_compatible": true,
          "source_ids": [
            "kansai-33-okayama-33461-unresolved-2026-source-1",
            "kansai-33-okayama-33461-unresolved-2026-source-2"
          ]
        }
      ],
      "institutionalSource": "71a5640fadd882dcfce0f948ed19e24124e8ebe91fc1488bb804719e47ab6af7",
      "sections": [
        {
          "label": "蓄電池",
          "text": "税込対象経費の10分の1です．",
          "supplement": [
            "（上限）15万円",
            "（端数処理）最終補助額：1,000円未満切り捨て",
            "（未確認事項）対象経費の費目範囲"
          ]
        }
      ],
      "text": "税込対象経費の10分の1です．",
      "supplement": [
        "（上限）15万円",
        "（端数処理）最終補助額：1,000円未満切り捨て",
        "（未確認事項）対象経費の費目範囲"
      ],
      "commonSupplement": [],
      "equipment": "蓄電池",
      "savedSourceDetails": true
    },
    "okayama-33622-main-2026": {
      "prefecture": "33",
      "municipality": "33622",
      "recordId": "scheme-8815c79a7bb6e7e9abd0",
      "targetYear": "2026",
      "branch": {
        "branch_id": "okayama-33622-main-2026",
        "diagnostic_rule_ids": [
          "okayama-33622-main-2026"
        ],
        "target_equipment": [
          "蓄電池"
        ],
        "application_start": [
          {
            "branch_id": "battery",
            "label": "交付申請",
            "date": "2026-04-01"
          }
        ],
        "application_end": [
          {
            "branch_id": "battery",
            "label": "交付申請",
            "date": "2027-03-31"
          }
        ],
        "application_status": "受付中",
        "amount": {
          "display_text": null,
          "evidence_status": "not_classified"
        },
        "official_conditions": [],
        "gaps": [],
        "evidence_urls": [
          "https://www.town.shoo.lg.jp/soshiki/16/7358.html",
          "https://www.town.shoo.lg.jp/uploaded/attachment/3208.pdf",
          "https://www1.g-reiki.net/town.shoo/reiki_honbun/m266RG00000933.html"
        ],
        "checked_at": "2026-09-21",
        "display_basis": "preparing",
        "migration_status": "pending_review",
        "legacy_municipal_rule_ids": []
      },
      "catalogAmount": {
        "raw_text": "min(本体・付属機器・設置工事費×1/3，150,000円)．税区分：exclusive．対象経費から他補助額を控除した後に率を乗じる．千円未満切捨て．",
        "display_text": null,
        "evidence_status": "not_classified"
      },
      "rules": [
        {
          "id": "okayama-33622-main-2026",
          "government_level": "municipality",
          "prefecture_code": "33",
          "municipality_code": "33622",
          "program_name": "勝央町省エネ促進事業補助金",
          "housing_ages": [
            "existing",
            "new"
          ],
          "equipment_packages": [
            "solar_plus_standard_battery"
          ],
          "application_status": "accepting",
          "diagnostic_scope": {
            "status": "in_scope",
            "in_scope_housing_ages": [
              "existing",
              "new"
            ],
            "excluded_branch_ids": [],
            "basis": "R8 8/31残927.7万円．B対象税抜費用1/3上限15万円，国等類似補助控除．SII・未使用，建売引渡6か月以内明示で新築可．自己居住，4/1～翌3/31．ZEH20万円は住宅一式の別枝． 手引p4で千円切捨，p8で機器別申請を確認． R8/3/31改正の例規別表3でBの本体附属＋工事税抜，他補助控除後1/3を確認．"
          },
          "expense_scopes": [
            "battery"
          ],
          "conflict_program_ids": [],
          "official_urls": [
            "https://www.town.shoo.lg.jp/soshiki/16/7358.html",
            "https://www.town.shoo.lg.jp/uploaded/attachment/3208.pdf",
            "https://www1.g-reiki.net/town.shoo/reiki_honbun/m266RG00000933.html"
          ],
          "confirmed_at": "2026-09-21",
          "calculation_assumptions": [
            "公式所有要件の明記不足は空欄を維持し，本人所有・本人居住の戸建住宅という承認済みモデル前提を適用する．",
            "納税，過去受給，契約施工者，製品認定，申請期限等の入力外条件は満たすと仮定する．",
            "費用は公式税区分を優先し，明示なしだけ承認済み税込対応．明示的な併用禁止を優先する．",
            "現年度の通常募集案内に終了表示がないため受付継続を仮定．"
          ],
          "required_confirmations": [
            "R8 8/31残927.7万円．B対象税抜費用1/3上限15万円，国等類似補助控除．SII・未使用，建売引渡6か月以内明示で新築可．自己居住，4/1～翌3/31．ZEH20万円は住宅一式の別枝． 手引p4で千円切捨，p8で機器別申請を確認． R8/3/31改正の例規別表3でBの本体附属＋工事税抜，他補助控除後1/3を確認．"
          ],
          "formula_components": [
            {
              "scope": "battery",
              "equipment_packages": [
                "solar_plus_standard_battery"
              ],
              "housing_ages": [
                "existing",
                "new"
              ],
              "formula_type": "cost_fraction",
              "cost_scope": "battery",
              "cost_tax": "exclusive",
              "cap_yen": 150000,
              "rounding_unit_yen": 1000,
              "deduct_other_subsidies": true,
              "fraction_numerator": 1,
              "fraction_denominator": 3
            }
          ],
          "machine_rule": "kansai_municipal_formula",
          "fit_compatible": true,
          "source_ids": [
            "kansai-33-okayama-33622-main-2026-source-1",
            "kansai-33-okayama-33622-main-2026-source-2",
            "kansai-33-okayama-33622-main-2026-source-3"
          ]
        }
      ],
      "institutionalSource": "5254c48132d3a8eed64a0ba5e20f8d13f67d2f1edcbd1d68a7b96f34befff254",
      "sections": [
        {
          "label": "蓄電池",
          "text": "税抜本体・付属機器・設置工事費から他補助額を差し引いた額の3分の1です．",
          "supplement": [
            "（上限）15万円",
            "（端数処理）最終補助額：1,000円未満切り捨て"
          ]
        }
      ],
      "text": "税抜本体・付属機器・設置工事費から他補助額を差し引いた額の3分の1です．",
      "supplement": [
        "（上限）15万円",
        "（端数処理）最終補助額：1,000円未満切り捨て"
      ],
      "commonSupplement": [],
      "equipment": "蓄電池",
      "savedSourceDetails": true
    },
    "okayama-33623-main-2026": {
      "prefecture": "33",
      "municipality": "33623",
      "recordId": "scheme-7f111f1f05a1dc13a5d4",
      "targetYear": "2026",
      "branch": {
        "branch_id": "okayama-33623-main-2026",
        "diagnostic_rule_ids": [
          "okayama-33623-main-2026"
        ],
        "target_equipment": [
          "蓄電池"
        ],
        "application_start": [
          {
            "branch_id": "battery",
            "label": "交付申請",
            "date": ""
          }
        ],
        "application_end": [
          {
            "branch_id": "battery",
            "label": "交付申請",
            "date": ""
          }
        ],
        "application_status": "受付中",
        "amount": {
          "display_text": null,
          "evidence_status": "not_classified"
        },
        "official_conditions": [],
        "gaps": [],
        "evidence_urls": [
          "https://www.town.nagi.okayama.jp/gyousei/chikyuuonndannka.html",
          "https://www.town.nagi.okayama.jp/gyousei/documents/kousinnsei2025.pdf",
          "https://www.town.nagi.okayama.jp/reiki_int/reiki_honbun/m267RG00000888.html"
        ],
        "checked_at": "2026-09-21",
        "display_basis": "preparing",
        "migration_status": "pending_review",
        "legacy_municipal_rule_ids": []
      },
      "catalogAmount": {
        "raw_text": "min(本体・付属機器・設置工事費×1/10，200,000円)．税区分：inclusive．対象経費から他補助額を控除した後に率を乗じる．千円未満切捨て．",
        "display_text": null,
        "evidence_status": "not_classified"
      },
      "rules": [
        {
          "id": "okayama-33623-main-2026",
          "government_level": "municipality",
          "prefecture_code": "33",
          "municipality_code": "33623",
          "program_name": "奈義町地球温暖化対策設備導入補助金",
          "housing_ages": [
            "existing",
            "new"
          ],
          "equipment_packages": [
            "solar_plus_standard_battery"
          ],
          "application_status": "accepting",
          "diagnostic_scope": {
            "status": "in_scope",
            "in_scope_housing_ages": [
              "existing",
              "new"
            ],
            "excluded_branch_ids": [],
            "basis": "直取得9/9更新本文，R8機器追加あり．B税込本体部材＋直接設置工事1/10上限20万円．事前申請必須．給湯器の町内業者条件をBへ転用しない．町内住所又は転入予定． 例規第6条は税込・国県控除・千円切捨，別表末尾は税抜との不整合．9/9更新のR8募集本文が税込を明示するため最新募集を優先する．旧別表の金額差も保持．2026年9月21日ユーザー承認の全国共通ルール：確認済み公式資料に当該設備メニューの住宅区分指定がないため，新築・既存住宅の両方を対象と仮定する．公式に両区分の適用を明記した事実ではない．住宅の既設と設備の既設は区別し，年度・設備・費用式・申請・併用条件は維持する．"
          },
          "expense_scopes": [
            "battery"
          ],
          "conflict_program_ids": [],
          "official_urls": [
            "https://www.town.nagi.okayama.jp/gyousei/chikyuuonndannka.html",
            "https://www.town.nagi.okayama.jp/gyousei/documents/kousinnsei2025.pdf",
            "https://www.town.nagi.okayama.jp/reiki_int/reiki_honbun/m267RG00000888.html"
          ],
          "confirmed_at": "2026-09-21",
          "calculation_assumptions": [
            "公式所有要件の明記不足は空欄を維持し，本人所有・本人居住の戸建住宅という承認済みモデル前提を適用する．",
            "納税，過去受給，契約施工者，製品認定，申請期限等の入力外条件は満たすと仮定する．",
            "費用は公式税区分を優先し，明示なしだけ承認済み税込対応．明示的な併用禁止を優先する．",
            "現年度の通常募集案内に終了表示がないため受付継続を仮定．",
            "2026年9月21日ユーザー承認の全国共通ルール：確認済み公式資料に当該設備メニューの住宅区分指定がないため，新築・既存住宅の両方を対象と仮定する．公式に両区分の適用を明記した事実ではない．住宅の既設と設備の既設は区別し，年度・設備・費用式・申請・併用条件は維持する．"
          ],
          "required_confirmations": [
            "直取得9/9更新本文，R8機器追加あり．B税込本体部材＋直接設置工事1/10上限20万円．事前申請必須．給湯器の町内業者条件をBへ転用しない．町内住所又は転入予定． 例規第6条は税込・国県控除・千円切捨，別表末尾は税抜との不整合．9/9更新のR8募集本文が税込を明示するため最新募集を優先する．旧別表の金額差も保持．",
            "現行本文及び要綱第6条は税込，別表末尾は税抜．9/9更新のR8募集本文を優先して税込とする．",
            "2026年9月21日ユーザー承認の全国共通ルール：確認済み公式資料に当該設備メニューの住宅区分指定がないため，新築・既存住宅の両方を対象と仮定する．公式に両区分の適用を明記した事実ではない．住宅の既設と設備の既設は区別し，年度・設備・費用式・申請・併用条件は維持する．"
          ],
          "formula_components": [
            {
              "scope": "battery",
              "equipment_packages": [
                "solar_plus_standard_battery"
              ],
              "housing_ages": [
                "existing",
                "new"
              ],
              "formula_type": "cost_fraction",
              "cost_scope": "battery",
              "cost_tax": "inclusive",
              "cap_yen": 200000,
              "rounding_unit_yen": 1000,
              "deduct_other_subsidies": true,
              "fraction_numerator": 1,
              "fraction_denominator": 10
            }
          ],
          "machine_rule": "kansai_municipal_formula",
          "fit_compatible": true,
          "source_ids": [
            "kansai-33-okayama-33623-main-2026-source-1",
            "kansai-33-okayama-33623-main-2026-source-2",
            "kansai-33-okayama-33623-main-2026-source-3"
          ]
        }
      ],
      "institutionalSource": "8a938d402256284d09af9a7bc0e8c08a7b3614fca296e15e2b6ddacae2ac15c4",
      "sections": [
        {
          "label": "蓄電池",
          "text": "税込本体・付属機器・設置工事費から他補助額を差し引いた額の10分の1です．",
          "supplement": [
            "（上限）20万円",
            "（端数処理）最終補助額：1,000円未満切り捨て"
          ]
        }
      ],
      "text": "税込本体・付属機器・設置工事費から他補助額を差し引いた額の10分の1です．",
      "supplement": [
        "（上限）20万円",
        "（端数処理）最終補助額：1,000円未満切り捨て"
      ],
      "commonSupplement": [],
      "equipment": "蓄電池",
      "savedSourceDetails": true
    },
    "hiroshima-34204-nonfit_pv-2026": {
      "prefecture": "34",
      "municipality": "34204",
      "recordId": "scheme-7e5a680194d4b32915cc",
      "targetYear": "2026",
      "branch": {
        "branch_id": "hiroshima-34204-nonfit_pv-2026",
        "diagnostic_rule_ids": [
          "hiroshima-34204-nonfit_pv-2026"
        ],
        "target_equipment": [
          "太陽光パネル"
        ],
        "application_start": [
          {
            "branch_id": "nonfit_pv",
            "label": "交付申請",
            "date": ""
          }
        ],
        "application_end": [
          {
            "branch_id": "nonfit_pv",
            "label": "交付申請",
            "date": ""
          }
        ],
        "application_status": "受付中",
        "amount": {
          "display_text": null,
          "evidence_status": "not_classified"
        },
        "official_conditions": [],
        "gaps": [],
        "evidence_urls": [
          "https://www.city.mihara.hiroshima.jp/soshiki/18/195970.html",
          "https://www.city.mihara.hiroshima.jp/uploaded/attachment/162727.pdf",
          "https://www.city.mihara.hiroshima.jp/uploaded/attachment/162299.pdf",
          "https://www.city.mihara.hiroshima.jp/uploaded/attachment/163143.pdf"
        ],
        "checked_at": "2026-09-21",
        "display_basis": "preparing",
        "migration_status": "pending_review",
        "legacy_municipal_rule_ids": []
      },
      "catalogAmount": {
        "raw_text": "50,000円/kW，上限150,000円．",
        "display_text": null,
        "evidence_status": "not_classified"
      },
      "rules": [
        {
          "id": "hiroshima-34204-nonfit_pv-2026",
          "government_level": "municipality",
          "prefecture_code": "34",
          "municipality_code": "34204",
          "program_name": "三原市脱炭素社会推進補助金",
          "housing_ages": [
            "existing",
            "new"
          ],
          "equipment_packages": [
            "solar_only",
            "solar_plus_standard_battery"
          ],
          "application_status": "accepting",
          "diagnostic_scope": {
            "status": "branch_filtered",
            "in_scope_housing_ages": [],
            "excluded_branch_ids": [],
            "basis": "設備要件のPV列のみFIT/FIP禁止．独立Bへ転用しない．"
          },
          "expense_scopes": [
            "solar"
          ],
          "conflict_program_ids": [],
          "official_urls": [
            "https://www.city.mihara.hiroshima.jp/soshiki/18/195970.html",
            "https://www.city.mihara.hiroshima.jp/uploaded/attachment/162727.pdf",
            "https://www.city.mihara.hiroshima.jp/uploaded/attachment/162299.pdf",
            "https://www.city.mihara.hiroshima.jp/uploaded/attachment/163143.pdf"
          ],
          "confirmed_at": "2026-09-21",
          "calculation_assumptions": [
            "確認不足又は対象外の枝は算入しない．未発見を制度不存在とは扱わない．"
          ],
          "required_confirmations": [
            "設備要件のPV列のみFIT/FIP禁止．独立Bへ転用しない．"
          ],
          "machine_rule": "kansai_municipal_non_adopted",
          "non_adoption_status": "excluded",
          "non_adoption_reason_code": "sale_path_not_applicable",
          "fit_compatible": false,
          "source_ids": [
            "kansai-34-hiroshima-34204-nonfit_pv-2026-source-1",
            "kansai-34-hiroshima-34204-nonfit_pv-2026-source-2",
            "kansai-34-hiroshima-34204-nonfit_pv-2026-source-3",
            "kansai-34-hiroshima-34204-nonfit_pv-2026-source-4"
          ]
        }
      ],
      "institutionalSource": "08af0ab1d0390cafb3ab96ca92d55345769488feacb8f90110df67ed0dfe4f32",
      "sections": [
        {
          "label": "太陽光",
          "text": "太陽光の出力1kWあたり5万円です．",
          "supplement": [
            "（上限）15万円"
          ]
        }
      ],
      "text": "太陽光の出力1kWあたり5万円です．",
      "supplement": [
        "（上限）15万円"
      ],
      "commonSupplement": [],
      "equipment": "太陽光",
      "savedSourceDetails": true
    },
    "hiroshima-34213-carport-2026": {
      "prefecture": "34",
      "municipality": "34213",
      "recordId": "scheme-3f2eee9a6e1f930aa2f2",
      "targetYear": "2026",
      "branch": {
        "branch_id": "hiroshima-34213-carport-2026",
        "diagnostic_rule_ids": [
          "hiroshima-34213-carport-2026"
        ],
        "target_equipment": [
          "太陽光パネル"
        ],
        "application_start": [
          {
            "branch_id": "carport",
            "label": "交付申請",
            "date": ""
          }
        ],
        "application_end": [
          {
            "branch_id": "carport",
            "label": "交付申請",
            "date": ""
          }
        ],
        "application_status": "受付中",
        "amount": {
          "display_text": null,
          "evidence_status": "not_classified"
        },
        "official_conditions": [],
        "gaps": [],
        "evidence_urls": [
          "https://www.city.hatsukaichi.hiroshima.jp/soshiki/131/93549.html",
          "https://www.city.hatsukaichi.hiroshima.jp/uploaded/attachment/92820.pdf"
        ],
        "checked_at": "2026-09-21",
        "display_basis": "preparing",
        "migration_status": "pending_review",
        "legacy_municipal_rule_ids": []
      },
      "catalogAmount": {
        "raw_text": "対象費1/3．",
        "display_text": null,
        "evidence_status": "not_classified"
      },
      "rules": [
        {
          "id": "hiroshima-34213-carport-2026",
          "government_level": "municipality",
          "prefecture_code": "34",
          "municipality_code": "34213",
          "program_name": "廿日市市住宅用太陽光発電設備等導入促進補助金",
          "housing_ages": [
            "existing",
            "new"
          ],
          "equipment_packages": [
            "solar_only",
            "solar_plus_standard_battery"
          ],
          "application_status": "accepting",
          "diagnostic_scope": {
            "status": "branch_filtered",
            "in_scope_housing_ages": [],
            "excluded_branch_ids": [],
            "basis": "ソーラーカーポートという別構造物が必要．"
          },
          "expense_scopes": [
            "solar"
          ],
          "conflict_program_ids": [],
          "official_urls": [
            "https://www.city.hatsukaichi.hiroshima.jp/soshiki/131/93549.html",
            "https://www.city.hatsukaichi.hiroshima.jp/uploaded/attachment/92820.pdf"
          ],
          "confirmed_at": "2026-09-21",
          "calculation_assumptions": [
            "確認不足又は対象外の枝は算入しない．未発見を制度不存在とは扱わない．"
          ],
          "required_confirmations": [
            "ソーラーカーポートという別構造物が必要．"
          ],
          "machine_rule": "kansai_municipal_non_adopted",
          "non_adoption_status": "excluded",
          "non_adoption_reason_code": "required_external_work",
          "fit_compatible": true,
          "source_ids": [
            "kansai-34-hiroshima-34213-carport-2026-source-1",
            "kansai-34-hiroshima-34213-carport-2026-source-2"
          ]
        }
      ],
      "institutionalSource": "37e1a89ab7e49f7cd095a0d168fc461cde490f070bce0f1e8e20d49a1e4d3104",
      "sections": [
        {
          "label": "太陽光",
          "text": "対象費の3分の1です．",
          "supplement": []
        }
      ],
      "text": "対象費の3分の1です．",
      "supplement": [],
      "commonSupplement": [],
      "equipment": "太陽光",
      "savedSourceDetails": true
    },
    "yamaguchi-35201-leading_pv_nonfit-2026": {
      "prefecture": "35",
      "municipality": "35201",
      "recordId": "scheme-1c6529bbb7bc0d5f3bc2",
      "targetYear": "2026",
      "branch": {
        "branch_id": "yamaguchi-35201-leading_pv_nonfit-2026",
        "diagnostic_rule_ids": [
          "yamaguchi-35201-leading_pv_nonfit-2026"
        ],
        "target_equipment": [
          "太陽光パネル"
        ],
        "application_start": [
          {
            "branch_id": "leading_pv_nonfit",
            "label": "交付申請",
            "date": "2026-04-23"
          }
        ],
        "application_end": [
          {
            "branch_id": "leading_pv_nonfit",
            "label": "交付申請",
            "date": "2026-12-25"
          }
        ],
        "application_status": "受付中",
        "amount": {
          "display_text": null,
          "evidence_status": "not_classified"
        },
        "official_conditions": [],
        "gaps": [],
        "evidence_urls": [
          "https://www.city.shimonoseki.lg.jp/soshiki/53/136323.html",
          "https://www.city.shimonoseki.lg.jp/uploaded/attachment/97448.pdf"
        ],
        "checked_at": "2026-09-21",
        "display_basis": "preparing",
        "migration_status": "pending_review",
        "legacy_municipal_rule_ids": []
      },
      "catalogAmount": {
        "raw_text": "設備・工事税抜費の2/3，上限なし，千円未満切捨て．",
        "display_text": null,
        "evidence_status": "not_classified"
      },
      "rules": [
        {
          "id": "yamaguchi-35201-leading_pv_nonfit-2026",
          "government_level": "municipality",
          "prefecture_code": "35",
          "municipality_code": "35201",
          "program_name": "下関市脱炭素先行モデル地区設備導入支援（住宅対象）補助金",
          "housing_ages": [
            "existing"
          ],
          "equipment_packages": [
            "solar_only",
            "solar_plus_standard_battery"
          ],
          "application_status": "accepting",
          "diagnostic_scope": {
            "status": "branch_filtered",
            "in_scope_housing_ages": [],
            "excluded_branch_ids": [],
            "basis": "PV設備枝はFIT/FIP認定不可．受付中であるが現行FIT診断には不適合．"
          },
          "expense_scopes": [
            "solar"
          ],
          "conflict_program_ids": [],
          "official_urls": [
            "https://www.city.shimonoseki.lg.jp/soshiki/53/136323.html",
            "https://www.city.shimonoseki.lg.jp/uploaded/attachment/97448.pdf"
          ],
          "confirmed_at": "2026-09-21",
          "calculation_assumptions": [
            "確認不足又は対象外の枝は算入しない．未発見を制度不存在とは扱わない．"
          ],
          "required_confirmations": [
            "PV設備枝はFIT/FIP認定不可．受付中であるが現行FIT診断には不適合．"
          ],
          "machine_rule": "kansai_municipal_non_adopted",
          "non_adoption_status": "excluded",
          "non_adoption_reason_code": "non_fit_required",
          "fit_compatible": false,
          "source_ids": [
            "kansai-35-yamaguchi-35201-leading_pv_nonfit-2026-source-1",
            "kansai-35-yamaguchi-35201-leading_pv_nonfit-2026-source-2"
          ]
        }
      ],
      "institutionalSource": "dbd599c59acef37ab2b2eeaba2bb3a074c7b09e7a7c3e37380a1c7bdd1216ca3",
      "sections": [
        {
          "label": "太陽光",
          "text": "設備・工事税抜費の3分の2です．",
          "supplement": [
            "（端数処理）1,000円未満切り捨て"
          ]
        }
      ],
      "text": "設備・工事税抜費の3分の2です．",
      "supplement": [
        "（端数処理）1,000円未満切り捨て"
      ],
      "commonSupplement": [],
      "equipment": "太陽光",
      "savedSourceDetails": true
    },
    "tokushima-36207-migrant_solar-2026": {
      "prefecture": "36",
      "municipality": "36207",
      "recordId": "scheme-12ea08ead27922f3398b",
      "targetYear": "2026",
      "branch": {
        "branch_id": "tokushima-36207-migrant_solar-2026",
        "diagnostic_rule_ids": [
          "tokushima-36207-migrant_solar-2026"
        ],
        "target_equipment": [
          "太陽光パネル"
        ],
        "application_start": [
          {
            "branch_id": "migrant_solar",
            "label": "交付申請",
            "date": "2026-04-01"
          }
        ],
        "application_end": [
          {
            "branch_id": "migrant_solar",
            "label": "交付申請",
            "date": "2027-02-26"
          }
        ],
        "application_status": "受付中",
        "amount": {
          "display_text": null,
          "evidence_status": "not_classified"
        },
        "official_conditions": [],
        "gaps": [],
        "evidence_urls": [
          "https://www.city.mima.lg.jp/iju/kurashi-docs/30292.html",
          "https://www.city.mima.lg.jp/fs/3/4/2/3/0/3/_/R8_ijyuusyamuke_Re-formsien.pdf?_=1778130903"
        ],
        "checked_at": "2026-09-21",
        "display_basis": "preparing",
        "migration_status": "pending_review",
        "legacy_municipal_rule_ids": []
      },
      "catalogAmount": {
        "raw_text": "min(2×C_PV/3，400,000円)を千円未満切捨て．\n併用・経費調整の原記録：併用条件：他制度で補助を受けた同一経費は対象外（R8募集要項p3）．別の蓄電池費だけへの補助はこの条項による排他対象ではない．\n上限：設備別上限は計算式を参照．県間接財源は別加算しない．",
        "display_text": null,
        "evidence_status": "not_classified"
      },
      "rules": [
        {
          "id": "tokushima-36207-migrant_solar-2026",
          "government_level": "municipality",
          "prefecture_code": "36",
          "municipality_code": "36207",
          "program_name": "美馬市移住者向けリフォーム支援事業補助金",
          "housing_ages": [
            "existing"
          ],
          "equipment_packages": [
            "solar_only",
            "solar_plus_standard_battery"
          ],
          "application_status": "accepting",
          "diagnostic_scope": {
            "status": "in_scope",
            "in_scope_housing_ages": [
              "existing"
            ],
            "excluded_branch_ids": [],
            "basis": "令和8年度募集要項p2で太陽光発電システム設置を明記．市外5年以上，転入前又は転入1年未満，空き家バンク登録住宅に本人居住，市内業者施工，実績時住民登録を入力外条件として仮定．住宅の既存設備（玄関・居室・台所・便所・浴室）確保を仮定し，他の住宅工事費を算入しない．決定後着工，年度末工事完了・完了30日内実績．"
          },
          "expense_scopes": [
            "solar"
          ],
          "conflict_program_ids": [
            "tokushima-residential-solar-battery-non-fit-2026"
          ],
          "official_urls": [
            "https://www.city.mima.lg.jp/iju/kurashi-docs/30292.html",
            "https://www.city.mima.lg.jp/fs/3/4/2/3/0/3/_/R8_ijyuusyamuke_Re-formsien.pdf?_=1778130903"
          ],
          "confirmed_at": "2026-09-21",
          "calculation_assumptions": [
            "納税，施工者，製品認定，接続，保証，所定の申請・設置期限等の入力外条件を満たすと仮定する．",
            "終了明示のない現行募集について受付継続を仮定する．公式予算残とは区別する．",
            "容量上の出力は診断入力を対応させるモデル仮定．費用の税区分は公式指定を優先し，指定不明だけ税込仮定．",
            "公式所有要件の明記不足は空欄を維持し，本人所有・本人居住の戸建という承認済みモデル前提を適用する．",
            "確認済み募集資料に住宅所有要件は明記不足．本人所有仮定を採用．税区分不明は税込費用仮定．",
            "現行モデルはPV対象費を分割しないため，同じPV費を対象とする制度とは選択比較し重複算入しない．PV費の部分配賦による併用最適化は未対応．別B費の補助まで一律禁止する公式事実はない．"
          ],
          "required_confirmations": [
            "令和8年度募集要項p2で太陽光発電システム設置を明記．市外5年以上，転入前又は転入1年未満，空き家バンク登録住宅に本人居住，市内業者施工，実績時住民登録を入力外条件として仮定．住宅の既存設備（玄関・居室・台所・便所・浴室）確保を仮定し，他の住宅工事費を算入しない．決定後着工，年度末工事完了・完了30日内実績．",
            "他制度で補助を受けた同一経費は対象外（R8募集要項p3）．別の蓄電池費だけへの補助はこの条項による排他対象ではない．",
            "確認済み募集資料に住宅所有要件は明記不足．本人所有仮定を採用．税区分不明は税込費用仮定．",
            "現行モデルはPV対象費を分割しないため，同じPV費を対象とする制度とは選択比較し重複算入しない．PV費の部分配賦による併用最適化は未対応．別B費の補助まで一律禁止する公式事実はない．"
          ],
          "formula_components": [
            {
              "scope": "solar",
              "formula_type": "cost_fraction",
              "cost_scope": "solar",
              "cost_tax": "approved_assumption_inclusive",
              "fraction_numerator": 2,
              "fraction_denominator": 3,
              "cap_yen": 400000,
              "rounding_unit_yen": 1000,
              "equipment_packages": [
                "solar_only",
                "solar_plus_standard_battery"
              ],
              "housing_ages": [
                "existing"
              ],
              "deduct_other_subsidies": false
            }
          ],
          "machine_rule": "kansai_municipal_formula",
          "fit_compatible": true,
          "source_ids": [
            "kansai-36-tokushima-36207-migrant_solar-2026-source-1",
            "kansai-36-tokushima-36207-migrant_solar-2026-source-2"
          ]
        }
      ],
      "institutionalSource": "805d8c79ebac8a62a9ed5b2a670d128ee4320d575b88964f7743733933f5a06a",
      "sections": [
        {
          "label": "太陽光",
          "text": "太陽光の補助対象経費の3分の2です．",
          "supplement": [
            "（上限）40万円",
            "（端数処理）最終補助額：1,000円未満切り捨て"
          ]
        }
      ],
      "text": "太陽光の補助対象経費の3分の2です．",
      "supplement": [
        "（上限）40万円",
        "（端数処理）最終補助額：1,000円未満切り捨て"
      ],
      "commonSupplement": [],
      "equipment": "太陽光",
      "savedSourceDetails": true
    },
    "tokushima-36302-solar-2026": {
      "prefecture": "36",
      "municipality": "36302",
      "recordId": "scheme-c06ec8a65f7bb1aa0612",
      "targetYear": "2026",
      "branch": {
        "branch_id": "tokushima-36302-solar-2026",
        "diagnostic_rule_ids": [
          "tokushima-36302-solar-2026"
        ],
        "target_equipment": [
          "太陽光パネル"
        ],
        "application_start": [
          {
            "branch_id": "solar",
            "label": "交付申請",
            "date": "2026-04-01"
          }
        ],
        "application_end": [
          {
            "branch_id": "solar",
            "label": "交付申請",
            "date": "2026-12-24"
          }
        ],
        "application_status": "受付中",
        "amount": {
          "display_text": null,
          "evidence_status": "not_classified"
        },
        "official_conditions": [],
        "gaps": [],
        "evidence_urls": [
          "https://www.kamikatsu.jp/docs/2026033100041/file_contents/kouhou202604.pdf",
          "https://www.pref.tokushima.lg.jp/ippannokata/kurashi/shizen/5016680/"
        ],
        "checked_at": "2026-09-21",
        "display_basis": "preparing",
        "migration_status": "pending_review",
        "legacy_municipal_rule_ids": []
      },
      "catalogAmount": {
        "raw_text": "min(C_PV/4，50,000円×X，200,000円)を千円未満切捨て．\n併用・経費調整の原記録：併用条件：国・県・その他団体と併用可能と広報に明記．\n上限：設備別上限は計算式を参照．県間接財源は別加算しない．",
        "display_text": null,
        "evidence_status": "not_classified"
      },
      "rules": [
        {
          "id": "tokushima-36302-solar-2026",
          "government_level": "municipality",
          "prefecture_code": "36",
          "municipality_code": "36302",
          "program_name": "上勝町再生可能エネルギー活用促進事業補助金",
          "housing_ages": [
            "existing",
            "new"
          ],
          "equipment_packages": [
            "solar_only",
            "solar_plus_standard_battery"
          ],
          "application_status": "accepting",
          "diagnostic_scope": {
            "status": "in_scope",
            "in_scope_housing_ages": [
              "existing",
              "new"
            ],
            "excluded_branch_ids": [],
            "basis": "公式広報2026年4月号27ページを画像で確認．町内住所，自己居住住宅への設備設置，本体購入・設置費，電力事業者との受給契約，納税，1種類年1回・全5種類5年1回，過去同建物同設備/耐用年数超の更新は不可，設備保持10年・モニター協力．工事着手前申請，年度内完了．県等他団体の補助併用可． 町の生活支援累計は個人120万円・事業所200万円まで．本モデルは個人の累計枠残を満たす仮定．2026年9月21日ユーザー承認の全国共通ルール：確認済み公式資料に当該設備メニューの住宅区分指定がないため，新築・既存住宅の両方を対象と仮定する．公式に両区分の適用を明記した事実ではない．住宅の既設と設備の既設は区別し，年度・設備・費用式・申請・併用条件は維持する．"
          },
          "expense_scopes": [
            "solar"
          ],
          "conflict_program_ids": [],
          "official_urls": [
            "https://www.kamikatsu.jp/docs/2026033100041/file_contents/kouhou202604.pdf",
            "https://www.pref.tokushima.lg.jp/ippannokata/kurashi/shizen/5016680/"
          ],
          "confirmed_at": "2026-09-21",
          "calculation_assumptions": [
            "納税，施工者，製品認定，接続，保証，所定の申請・設置期限等の入力外条件を満たすと仮定する．",
            "終了明示のない現行募集について受付継続を仮定する．公式予算残とは区別する．",
            "容量上の出力は診断入力を対応させるモデル仮定．費用の税区分は公式指定を優先し，指定不明だけ税込仮定．",
            "公式所有要件の明記不足は空欄を維持し，本人所有・本人居住の戸建という承認済みモデル前提を適用する．",
            "税区分の明示未確認のため税込費用仮定．",
            "2026年9月21日ユーザー承認の全国共通ルール：確認済み公式資料に当該設備メニューの住宅区分指定がないため，新築・既存住宅の両方を対象と仮定する．公式に両区分の適用を明記した事実ではない．住宅の既設と設備の既設は区別し，年度・設備・費用式・申請・併用条件は維持する．"
          ],
          "required_confirmations": [
            "公式広報2026年4月号27ページを画像で確認．町内住所，自己居住住宅への設備設置，本体購入・設置費，電力事業者との受給契約，納税，1種類年1回・全5種類5年1回，過去同建物同設備/耐用年数超の更新は不可，設備保持10年・モニター協力．工事着手前申請，年度内完了．県等他団体の補助併用可． 町の生活支援累計は個人120万円・事業所200万円まで．本モデルは個人の累計枠残を満たす仮定．",
            "国・県・その他団体と併用可能と広報に明記．",
            "税区分の明示未確認のため税込費用仮定．",
            "2026年9月21日ユーザー承認の全国共通ルール：確認済み公式資料に当該設備メニューの住宅区分指定がないため，新築・既存住宅の両方を対象と仮定する．公式に両区分の適用を明記した事実ではない．住宅の既設と設備の既設は区別し，年度・設備・費用式・申請・併用条件は維持する．"
          ],
          "formula_components": [
            {
              "scope": "solar",
              "formula_type": "capacity_rate_cost_fraction",
              "capacity_source": "solar_kw",
              "capacity_preprocessing": "none",
              "capacity_cap": null,
              "unit_amount_yen": 50000,
              "cost_scope": "solar",
              "cost_tax": "approved_assumption_inclusive",
              "cap_yen": 200000,
              "rounding_unit_yen": 1000,
              "fraction_numerator": 1,
              "fraction_denominator": 4,
              "equipment_packages": [
                "solar_only",
                "solar_plus_standard_battery"
              ],
              "housing_ages": [
                "existing",
                "new"
              ],
              "deduct_other_subsidies": false
            }
          ],
          "machine_rule": "kansai_municipal_formula",
          "fit_compatible": true,
          "source_ids": [
            "kansai-36-tokushima-36302-solar-2026-source-1",
            "kansai-36-tokushima-36302-solar-2026-source-2"
          ]
        }
      ],
      "institutionalSource": "e02f614648c1da394af598b3f09012ff1009a149fe797bcf6a15442da284d866",
      "sections": [
        {
          "label": "太陽光",
          "text": "太陽光の補助対象経費の4分の1と太陽光の対象出力に1kWあたり5万円を掛けた額のうち，低い額です．",
          "supplement": [
            "（上限）20万円",
            "（端数処理）最終補助額：1,000円未満切り捨て"
          ]
        }
      ],
      "text": "太陽光の補助対象経費の4分の1と太陽光の対象出力に1kWあたり5万円を掛けた額のうち，低い額です．",
      "supplement": [
        "（上限）20万円",
        "（端数処理）最終補助額：1,000円未満切り捨て"
      ],
      "commonSupplement": [],
      "equipment": "太陽光",
      "savedSourceDetails": true
    },
    "tokushima-36387-solar-2026": {
      "prefecture": "36",
      "municipality": "36387",
      "recordId": "scheme-06336c99c76f0efa8a1a",
      "targetYear": "2026",
      "branch": {
        "branch_id": "tokushima-36387-solar-2026",
        "diagnostic_rule_ids": [
          "tokushima-36387-solar-2026"
        ],
        "target_equipment": [
          "太陽光パネル"
        ],
        "application_start": [
          {
            "branch_id": "solar",
            "label": "交付申請",
            "date": ""
          }
        ],
        "application_end": [
          {
            "branch_id": "solar",
            "label": "交付申請",
            "date": ""
          }
        ],
        "application_status": "受付中",
        "amount": {
          "display_text": null,
          "evidence_status": "not_classified"
        },
        "official_conditions": [],
        "gaps": [],
        "evidence_urls": [
          "https://www.town.minami.lg.jp/docs/209.html",
          "https://www.town.minami.lg.jp/docs/186.html",
          "https://www.town.minami.lg.jp/fs/5/6/0/0/9/8/_/%E8%A8%98%E5%85%A5%E3%81%AE%E4%BB%95%E6%96%B9.pdf",
          "https://www.pref.tokushima.lg.jp/ippannokata/kurashi/shizen/5016680/"
        ],
        "checked_at": "2026-09-21",
        "display_basis": "preparing",
        "migration_status": "pending_review",
        "legacy_municipal_rule_ids": []
      },
      "catalogAmount": {
        "raw_text": "min(70,000円×X，300,000円)を千円未満切捨て．\n併用・経費調整の原記録：併用条件：県一覧は県補助併用不可．その他禁止未確認は共通仮定．\n上限：設備別上限は計算式を参照．県間接財源は別加算しない．",
        "display_text": null,
        "evidence_status": "not_classified"
      },
      "rules": [
        {
          "id": "tokushima-36387-solar-2026",
          "government_level": "municipality",
          "prefecture_code": "36",
          "municipality_code": "36387",
          "program_name": "美波町環境対策支援事業",
          "housing_ages": [
            "existing",
            "new"
          ],
          "equipment_packages": [
            "solar_only",
            "solar_plus_standard_battery"
          ],
          "application_status": "accepting",
          "diagnostic_scope": {
            "status": "in_scope",
            "in_scope_housing_ages": [
              "existing",
              "new"
            ],
            "excluded_branch_ids": [],
            "basis": "町公式常設案内と県令和8年度一覧を対応確認．申請記入例は新築家屋の確認済証を明記し新築も対象．町民個人・非営利・新エネルギー財団整備基準・納税・世帯1回，決定後着工，年度末完了，完了30日以内又は年度末報告．系統連系後報告と四国電力契約書を要求し，余剰売電型を対象に採用．"
          },
          "expense_scopes": [
            "solar"
          ],
          "conflict_program_ids": [
            "tokushima-residential-solar-battery-non-fit-2026"
          ],
          "official_urls": [
            "https://www.town.minami.lg.jp/docs/209.html",
            "https://www.town.minami.lg.jp/docs/186.html",
            "https://www.town.minami.lg.jp/fs/5/6/0/0/9/8/_/%E8%A8%98%E5%85%A5%E3%81%AE%E4%BB%95%E6%96%B9.pdf",
            "https://www.pref.tokushima.lg.jp/ippannokata/kurashi/shizen/5016680/"
          ],
          "confirmed_at": "2026-09-21",
          "calculation_assumptions": [
            "納税，施工者，製品認定，接続，保証，所定の申請・設置期限等の入力外条件を満たすと仮定する．",
            "終了明示のない現行募集について受付継続を仮定する．公式予算残とは区別する．",
            "容量上の出力は診断入力を対応させるモデル仮定．費用の税区分は公式指定を優先し，指定不明だけ税込仮定．",
            "公式所有要件の明記不足は空欄を維持し，本人所有・本人居住の戸建という承認済みモデル前提を適用する．",
            "公式は発電量1kW当たりと表記．設備出力へ対応するモデル仮定を保持する．受付は常設案内＋県令和8年度一覧の現行性に基づく継続仮定．"
          ],
          "required_confirmations": [
            "町公式常設案内と県令和8年度一覧を対応確認．申請記入例は新築家屋の確認済証を明記し新築も対象．町民個人・非営利・新エネルギー財団整備基準・納税・世帯1回，決定後着工，年度末完了，完了30日以内又は年度末報告．系統連系後報告と四国電力契約書を要求し，余剰売電型を対象に採用．",
            "県一覧は県補助併用不可．その他禁止未確認は共通仮定．",
            "公式は発電量1kW当たりと表記．設備出力へ対応するモデル仮定を保持する．受付は常設案内＋県令和8年度一覧の現行性に基づく継続仮定．"
          ],
          "formula_components": [
            {
              "scope": "solar",
              "formula_type": "capacity_rate",
              "capacity_source": "solar_kw",
              "capacity_preprocessing": "none",
              "capacity_cap": null,
              "unit_amount_yen": 70000,
              "cost_scope": null,
              "cost_tax": null,
              "cap_yen": 300000,
              "rounding_unit_yen": 1000,
              "equipment_packages": [
                "solar_only",
                "solar_plus_standard_battery"
              ],
              "housing_ages": [
                "existing",
                "new"
              ],
              "deduct_other_subsidies": false
            }
          ],
          "machine_rule": "kansai_municipal_formula",
          "fit_compatible": true,
          "source_ids": [
            "kansai-36-tokushima-36387-solar-2026-source-1",
            "kansai-36-tokushima-36387-solar-2026-source-2",
            "kansai-36-tokushima-36387-solar-2026-source-3",
            "kansai-36-tokushima-36387-solar-2026-source-4"
          ]
        }
      ],
      "institutionalSource": "7f75b4fe3d3880598664ae6f734579029bb750ed4585426fd48f94ceac19dc63",
      "sections": [
        {
          "label": "太陽光",
          "text": "太陽光の出力1kWあたり7万円です．",
          "supplement": [
            "（上限）30万円",
            "（端数処理）最終補助額：1,000円未満切り捨て"
          ]
        }
      ],
      "text": "太陽光の出力1kWあたり7万円です．",
      "supplement": [
        "（上限）30万円",
        "（端数処理）最終補助額：1,000円未満切り捨て"
      ],
      "commonSupplement": [],
      "equipment": "太陽光",
      "savedSourceDetails": true
    },
    "kochi-39211-solar-2026": {
      "prefecture": "39",
      "municipality": "39211",
      "recordId": "scheme-41240c5eac2cda6af1dd",
      "targetYear": "2026",
      "branch": {
        "branch_id": "kochi-39211-solar-2026",
        "diagnostic_rule_ids": [
          "kochi-39211-solar-2026"
        ],
        "target_equipment": [
          "太陽光パネル"
        ],
        "application_start": [
          {
            "branch_id": "solar",
            "label": "所定申請（詳細は要件参照）",
            "date": "2026-04-01"
          }
        ],
        "application_end": [
          {
            "branch_id": "solar",
            "label": "所定申請（詳細は要件参照）",
            "date": ""
          }
        ],
        "application_status": "受付中",
        "amount": {
          "display_text": null,
          "evidence_status": "not_classified"
        },
        "official_conditions": [],
        "gaps": [],
        "evidence_urls": [
          "https://www.city.kochi-konan.lg.jp/soshikikarasagasu/kankyotaisakuka/kankyohozen/1/858.html",
          "https://www.city.kochi-konan.lg.jp/material/files/group/8/R8kounannsijyuutakuyoutaiyoukouhatudennsisutemugaiyou.pdf"
        ],
        "checked_at": "2026-09-21",
        "display_basis": "preparing",
        "migration_status": "pending_review",
        "legacy_municipal_rule_ids": []
      },
      "catalogAmount": {
        "raw_text": "式 (39211-1)：PV=min(60000,60000)，1円単位切捨て．\n併用・経費調整の原記録：併用条件：明示禁止未確認は併用可とする共通仮定．相手制度条件を優先し県の間接財源は重複加算しない．\n上限：設備別上限は計算式を参照．県間接財源は別加算しない．",
        "display_text": null,
        "evidence_status": "not_classified"
      },
      "rules": [
        {
          "id": "kochi-39211-solar-2026",
          "government_level": "municipality",
          "prefecture_code": "39",
          "municipality_code": "39211",
          "program_name": "香南市住宅用太陽光発電システム設置費補助金",
          "housing_ages": [
            "existing",
            "new"
          ],
          "equipment_packages": [
            "solar_only"
          ],
          "application_status": "accepting",
          "diagnostic_scope": {
            "status": "in_scope",
            "in_scope_housing_ages": [
              "existing",
              "new"
            ],
            "excluded_branch_ids": [],
            "basis": "独立PV単体制度はR8最終年度20件先着．8/12終了告知は別の設備等導入推進事業に対応．独立PV制度の終了明示は確認できず受付継続仮定．"
          },
          "expense_scopes": [
            "solar"
          ],
          "conflict_program_ids": [],
          "official_urls": [
            "https://www.city.kochi-konan.lg.jp/soshikikarasagasu/kankyotaisakuka/kankyohozen/1/858.html",
            "https://www.city.kochi-konan.lg.jp/material/files/group/8/R8kounannsijyuutakuyoutaiyoukouhatudennsisutemugaiyou.pdf"
          ],
          "confirmed_at": "2026-09-21",
          "calculation_assumptions": [
            "納税，施工者，製品認定，接続，保証，所定の申請・設置期限等の入力外条件を満たすと仮定する．",
            "終了明示のない現行募集について受付継続を仮定する．公式予算残とは区別する．",
            "容量上の出力は診断入力を対応させるモデル仮定．費用の税区分は公式指定を優先し，指定不明だけ税込仮定．",
            "公式所有要件の明記不足は空欄を維持し，本人所有・本人居住の戸建という承認済みモデル前提を適用する．"
          ],
          "required_confirmations": [
            "対象となる新品設備，接続，保証及び所定の申請・設置期限を確認してください．",
            "太陽光のみを設置する場合の制度です．対象費は税抜50万円/kW以下が必要です．"
          ],
          "formula_components": [
            {
              "scope": "solar",
              "formula_type": "fixed",
              "fixed_amount_yen": 60000,
              "cost_scope": null,
              "cost_tax": null,
              "cap_yen": 60000,
              "rounding_unit_yen": 1,
              "equipment_packages": [
                "solar_only"
              ],
              "solar_output_max_kw_exclusive": 10,
              "housing_ages": [
                "existing",
                "new"
              ],
              "deduct_other_subsidies": false
            }
          ],
          "machine_rule": "kansai_municipal_formula",
          "fit_compatible": true,
          "source_ids": [
            "kansai-39-kochi-39211-solar-2026-source-1",
            "kansai-39-kochi-39211-solar-2026-source-2"
          ]
        }
      ],
      "institutionalSource": "6c7b4c73f2790aceefc6409e200e00834831aa1d9f485ba0f6e03e1d584d3e86",
      "sections": [
        {
          "label": "太陽光",
          "text": "6万円です．",
          "supplement": [
            "（端数処理）最終補助額：1円未満切り捨て"
          ]
        }
      ],
      "text": "6万円です．",
      "supplement": [
        "（端数処理）最終補助額：1円未満切り捨て"
      ],
      "commonSupplement": [],
      "equipment": "太陽光",
      "savedSourceDetails": true
    },
    "kumamoto-43204-zero-carbon-carport-2026": {
      "prefecture": "43",
      "municipality": "43204",
      "recordId": "scheme-4c0888e34f6a0867e9f8",
      "targetYear": "2026",
      "branch": {
        "branch_id": "kumamoto-43204-zero-carbon-carport-2026",
        "diagnostic_rule_ids": [
          "kumamoto-43204-zero-carbon-carport-2026"
        ],
        "target_equipment": [
          "太陽光パネル"
        ],
        "application_start": [
          {
            "branch_id": "kumamoto-43204-zero-carbon-carport-2026",
            "label": "交付申請",
            "date": "2026-05-01"
          }
        ],
        "application_end": [
          {
            "branch_id": "kumamoto-43204-zero-carbon-carport-2026",
            "label": "交付申請",
            "date": "2027-01-08"
          }
        ],
        "application_status": "受付中",
        "amount": {
          "display_text": null,
          "evidence_status": "not_classified"
        },
        "official_conditions": [],
        "gaps": [],
        "evidence_urls": [
          "https://www.city.arao.lg.jp/fs/2/6/4/5/5/4/_/_______________________.pdf"
        ],
        "checked_at": "2026-09-27",
        "display_basis": "preparing",
        "migration_status": "pending_review",
        "legacy_municipal_rule_ids": []
      },
      "catalogAmount": {
        "raw_text": "設備整備事業費の1/3，千円未満切捨て．",
        "display_text": null,
        "evidence_status": "not_classified"
      },
      "rules": [
        {
          "id": "kumamoto-43204-zero-carbon-carport-2026",
          "government_level": "municipality",
          "prefecture_code": "43",
          "municipality_code": "43204",
          "program_name": "荒尾市ゼロカーボン機器等導入促進補助金（ソーラーカーポート）",
          "housing_ages": [
            "existing",
            "new"
          ],
          "equipment_packages": [
            "solar_only",
            "solar_plus_standard_battery"
          ],
          "application_status": "accepting",
          "diagnostic_scope": {
            "status": "in_scope",
            "in_scope_housing_ages": [
              "existing",
              "new"
            ],
            "excluded_branch_ids": [],
            "basis": "事業者所有・別構造物必須のため非算入．候補保存であり診断採用又は独立検収完了ではない．所有・居住の確認範囲はownership_condition_review，診断仮定はcalculation_assumptionsに分離．所有範囲の空配列だけを非算入理由としない．"
          },
          "expense_scopes": [
            "solar"
          ],
          "conflict_program_ids": [],
          "official_urls": [
            "https://www.city.arao.lg.jp/fs/2/6/4/5/5/4/_/_______________________.pdf"
          ],
          "confirmed_at": "2026-09-27",
          "calculation_assumptions": [
            "本人所有・本人居住の戸建・新品自己購入を仮定．公式未明記を公式条件へ補完しない．",
            "事業者向けの太陽光一体型又は搭載型カーポート．非FIT・非FIPと別構造物が必須．",
            "所有・居住の公式組合せは未確定．本人所有・本人居住は検討モデルの仮定として別記し，公式対象範囲へ補完しない．",
            "併用不可：確認資料に明記なし．相手制度側の制限を別途適用．\n上限：個別の金額式のとおり．他制度との共通上限は未確認．"
          ],
          "required_confirmations": [
            "事業者所有・別構造物必須のため非算入．候補保存であり診断採用又は独立検収完了ではない．所有・居住の確認範囲はownership_condition_review，診断仮定はcalculation_assumptionsに分離．所有範囲の空配列だけを非算入理由としない．"
          ],
          "source_ids": [
            "kansai-43-kumamoto-43204-zero-carbon-carport-2026-source-1"
          ],
          "machine_rule": "kansai_municipal_non_adopted",
          "non_adoption_status": "excluded",
          "non_adoption_reason_code": "official_conditions_not_applicable"
        }
      ],
      "institutionalSource": "d9760277793ad04a6f79357f40ca7128a410ad62720b523589a3251d4dac96d6",
      "sections": [
        {
          "label": "太陽光",
          "text": "設備整備事業費の3分の1です．",
          "supplement": [
            "（端数処理）1,000円未満切り捨て"
          ]
        }
      ],
      "text": "設備整備事業費の3分の1です．",
      "supplement": [
        "（端数処理）1,000円未満切り捨て"
      ],
      "commonSupplement": [],
      "equipment": "太陽光",
      "savedSourceDetails": true
    },
    "aomori-02205-self-consumption-pv-2026": {
      "prefecture": "02",
      "municipality": "02205",
      "recordId": "scheme-5b570975ce6d45c896f5e3f827490e3f",
      "targetYear": "2026",
      "branch": {
        "branch_id": "aomori-02205-self-consumption-pv-2026",
        "diagnostic_rule_ids": [
          "aomori-02205-self-consumption-pv-2026"
        ],
        "target_equipment": [
          "太陽光パネル"
        ],
        "application_start": [
          {
            "branch_id": "aomori-02205-self-consumption-pv-2026",
            "label": "交付申請",
            "date": ""
          }
        ],
        "application_end": [
          {
            "branch_id": "aomori-02205-self-consumption-pv-2026",
            "label": "交付申請",
            "date": "2026-12-28"
          }
        ],
        "application_status": "受付中",
        "amount": {
          "display_text": "太陽光の税抜対象経費の実支出額，出力1kW当たり5万円の額，25万円のうち最も低い額以内です．出力はモジュールとパワーコンディショナーの小さい方を整数kWに切り捨てた値です．補助額の千円未満を切り捨てます．",
          "evidence_status": "partial"
        },
        "official_conditions": [],
        "gaps": [],
        "evidence_urls": [
          "https://www.city.goshogawara.lg.jp/kurashi/sumai/taiyoukou-setubidounyuusien.html",
          "https://www.city.goshogawara.lg.jp/kurashi/sumai/files/R8taiyoukou_youkou.pdf",
          "https://www.city.goshogawara.lg.jp/kurashi/sumai/files/R8taiyoukou_youkoubeppyou.pdf",
          "https://www.city.goshogawara.lg.jp/kurashi/sumai/files/R8taiyoukou_tebiki.pdf",
          "https://aomori-taiyoko.pref.aomori.lg.jp/residential/",
          "https://aomori-taiyoko.pref.aomori.lg.jp/residential/status/"
        ],
        "checked_at": "2026-09-27",
        "display_basis": "preparing",
        "migration_status": "pending_review",
        "legacy_municipal_rule_ids": []
      },
      "catalogAmount": {
        "raw_text": "PV原式：対象経費の実支出額，5万円/kWに応じた額，25万円の最小額以内．税抜対象経費を用いる．出力はモジュールとPCSの小さい値をkW単位で整数切捨て（自治体案内・手引）．金額は千円未満切捨て．",
        "display_text": "太陽光の税抜対象経費の実支出額，出力1kW当たり5万円の額，25万円のうち最も低い額以内です．出力はモジュールとパワーコンディショナーの小さい方を整数kWに切り捨てた値です．補助額の千円未満を切り捨てます．",
        "evidence_status": "partial"
      },
      "rules": [
        {
          "id": "aomori-02205-self-consumption-pv-2026",
          "government_level": "municipality",
          "prefecture_code": "02",
          "municipality_code": "02205",
          "program_name": "五所川原市住宅用自家消費型太陽光発電設備等導入支援事業費補助金",
          "housing_ages": [
            "existing",
            "new"
          ],
          "equipment_packages": [
            "solar_only",
            "solar_plus_standard_battery"
          ],
          "application_status": "accepting",
          "diagnostic_scope": {
            "status": "in_scope",
            "in_scope_housing_ages": [
              "existing",
              "new"
            ],
            "excluded_branch_ids": [],
            "basis": "非FIT・非FIPの新設PV（蓄電池は同時導入）を要する県連携制度のためFIT診断へ非算入．原式・全文根拠・市町固有の期限を保持．補助対象経費の費目，併用禁止範囲，手続・完了期限の逐条統合は添付原文抜粋に残し，独立検収まで検証完了としない．"
          },
          "expense_scopes": [
            "solar"
          ],
          "conflict_program_ids": [],
          "official_urls": [
            "https://www.city.goshogawara.lg.jp/kurashi/sumai/taiyoukou-setubidounyuusien.html",
            "https://www.city.goshogawara.lg.jp/kurashi/sumai/files/R8taiyoukou_youkou.pdf",
            "https://www.city.goshogawara.lg.jp/kurashi/sumai/files/R8taiyoukou_youkoubeppyou.pdf",
            "https://www.city.goshogawara.lg.jp/kurashi/sumai/files/R8taiyoukou_tebiki.pdf",
            "https://aomori-taiyoko.pref.aomori.lg.jp/residential/",
            "https://aomori-taiyoko.pref.aomori.lg.jp/residential/status/"
          ],
          "confirmed_at": "2026-09-27",
          "calculation_assumptions": [
            "本人所有・本人居住の戸建1戸をモデルとして採用．住宅性能の個別条件は対象設備・その他条件に記す．",
            "本人居住の個人を検討対象とし，資料で定める住民登録・税等要件は充足を仮定．他の属性は原文の条件を参照し推測で追加しない．",
            "住宅用自家消費型PV．蓄電池のみの導入は対象外．非FIT・非FIP条件，製品要件及び容量上限は自治体資料及び県共通案内の根拠全文に保存．",
            "原文の着手届，実績報告の相対期限，併用禁止の適用範囲を監査抜粋に保持．",
            "併用不可：国費による同一対象事業への重複助成禁止を含む．自治体ごとの原文範囲は監査抜粋を参照し，併用可へ一括補完しない．\n上限：個別の金額式のとおり．他制度との共通上限は未確認．",
            "本人所有・本人居住の戸建を仮定．公式に住宅所有の限定がない場合は仮定として区別．"
          ],
          "required_confirmations": [
            "非FIT・非FIPの新設PV（蓄電池は同時導入）を要する県連携制度のためFIT診断へ非算入．原式・全文根拠・市町固有の期限を保持．補助対象経費の費目，併用禁止範囲，手続・完了期限の逐条統合は添付原文抜粋に残し，独立検収まで検証完了としない．",
            "最新の受付・予算残高，対象機種・資格・申請順序を申請時に確認する．",
            "交付申請受付：開始日未確認〜2026-12-28．工事完了・実績報告の期限とは別．"
          ],
          "source_ids": [
            "kansai-02-aomori-02205-self-consumption-pv-2026-source-1",
            "kansai-02-aomori-02205-self-consumption-pv-2026-source-2",
            "kansai-02-aomori-02205-self-consumption-pv-2026-source-3",
            "kansai-02-aomori-02205-self-consumption-pv-2026-source-4",
            "kansai-02-aomori-02205-self-consumption-pv-2026-source-5",
            "kansai-02-aomori-02205-self-consumption-pv-2026-source-6"
          ],
          "machine_rule": "kansai_municipal_non_adopted",
          "non_adoption_status": "excluded",
          "non_adoption_reason_code": "official_conditions_not_applicable",
          "fit_compatible": false
        }
      ],
      "institutionalSource": "9cf31188e4533077c6eab77c9722daaddbf638aff6f8a1cbf8b9a90a06a63a7d",
      "sections": [
        {
          "label": "太陽光",
          "text": "太陽光の税抜対象経費の実支出額と太陽光の対象出力に1kWあたり5万円を掛けた額のうち，低い額以内です．",
          "supplement": [
            "（算定対象）出力の基準：モジュールとパワーコンディショナーの小さい方",
            "（上限）25万円",
            "（端数処理）1kW未満切り捨て",
            "（端数処理）1,000円未満切り捨て"
          ]
        }
      ],
      "text": "太陽光の税抜対象経費の実支出額と太陽光の対象出力に1kWあたり5万円を掛けた額のうち，低い額以内です．",
      "supplement": [
        "（算定対象）出力の基準：モジュールとパワーコンディショナーの小さい方",
        "（上限）25万円",
        "（端数処理）1kW未満切り捨て",
        "（端数処理）1,000円未満切り捨て"
      ],
      "commonSupplement": [],
      "equipment": "太陽光のみ"
    },
    "aomori-02205-self-consumption-battery-2026": {
      "prefecture": "02",
      "municipality": "02205",
      "recordId": "scheme-5b570975ce6d45c896f5e3f827490e3f",
      "targetYear": "2026",
      "branch": {
        "branch_id": "aomori-02205-self-consumption-battery-2026",
        "diagnostic_rule_ids": [
          "aomori-02205-self-consumption-battery-2026"
        ],
        "target_equipment": [
          "蓄電池"
        ],
        "application_start": [
          {
            "branch_id": "aomori-02205-self-consumption-battery-2026",
            "label": "交付申請",
            "date": ""
          }
        ],
        "application_end": [
          {
            "branch_id": "aomori-02205-self-consumption-battery-2026",
            "label": "交付申請",
            "date": "2026-12-28"
          }
        ],
        "application_status": "受付中",
        "amount": {
          "display_text": "工事費込みの税抜蓄電池対象経費の実支出額の3分の1，蓄電容量に1kWh当たり14.1万円を掛けた額の3分の1，35万円のうち最も低い額以内です．蓄電容量は0.1kWh単位で切り捨て，補助額の千円未満を切り捨てます．1kWh当たり14.1万円は対象経費の上限単価で，補助単価ではありません．",
          "evidence_status": "partial"
        },
        "official_conditions": [],
        "gaps": [],
        "evidence_urls": [
          "https://www.city.goshogawara.lg.jp/kurashi/sumai/taiyoukou-setubidounyuusien.html",
          "https://www.city.goshogawara.lg.jp/kurashi/sumai/files/R8taiyoukou_youkou.pdf",
          "https://www.city.goshogawara.lg.jp/kurashi/sumai/files/R8taiyoukou_youkoubeppyou.pdf",
          "https://www.city.goshogawara.lg.jp/kurashi/sumai/files/R8taiyoukou_tebiki.pdf",
          "https://aomori-taiyoko.pref.aomori.lg.jp/residential/",
          "https://aomori-taiyoko.pref.aomori.lg.jp/residential/status/"
        ],
        "checked_at": "2026-09-27",
        "display_basis": "preparing",
        "migration_status": "pending_review",
        "legacy_municipal_rule_ids": []
      },
      "catalogAmount": {
        "raw_text": "蓄電池原式：税抜対象経費実支出額の1/3，蓄電容量×141,000円/kWhの1/3，350,000円の最小額以内．工事費込み．14.1万円/kWhは補助単価でなく対象経費上限．蓄電容量は小数第2位以下切捨て（0.1kWh単位）．金額は千円未満切捨て．",
        "display_text": "工事費込みの税抜蓄電池対象経費の実支出額の3分の1，蓄電容量に1kWh当たり14.1万円を掛けた額の3分の1，35万円のうち最も低い額以内です．蓄電容量は0.1kWh単位で切り捨て，補助額の千円未満を切り捨てます．1kWh当たり14.1万円は対象経費の上限単価で，補助単価ではありません．",
        "evidence_status": "partial"
      },
      "rules": [
        {
          "id": "aomori-02205-self-consumption-battery-2026",
          "government_level": "municipality",
          "prefecture_code": "02",
          "municipality_code": "02205",
          "program_name": "五所川原市住宅用自家消費型太陽光発電設備等導入支援事業費補助金",
          "housing_ages": [
            "existing",
            "new"
          ],
          "equipment_packages": [
            "solar_plus_standard_battery"
          ],
          "application_status": "accepting",
          "diagnostic_scope": {
            "status": "in_scope",
            "in_scope_housing_ages": [
              "existing",
              "new"
            ],
            "excluded_branch_ids": [],
            "basis": "非FIT・非FIPの新設PV（蓄電池は同時導入）を要する県連携制度のためFIT診断へ非算入．原式・全文根拠・市町固有の期限を保持．補助対象経費の費目，併用禁止範囲，手続・完了期限の逐条統合は添付原文抜粋に残し，独立検収まで検証完了としない．"
          },
          "expense_scopes": [
            "battery"
          ],
          "conflict_program_ids": [],
          "official_urls": [
            "https://www.city.goshogawara.lg.jp/kurashi/sumai/taiyoukou-setubidounyuusien.html",
            "https://www.city.goshogawara.lg.jp/kurashi/sumai/files/R8taiyoukou_youkou.pdf",
            "https://www.city.goshogawara.lg.jp/kurashi/sumai/files/R8taiyoukou_youkoubeppyou.pdf",
            "https://www.city.goshogawara.lg.jp/kurashi/sumai/files/R8taiyoukou_tebiki.pdf",
            "https://aomori-taiyoko.pref.aomori.lg.jp/residential/",
            "https://aomori-taiyoko.pref.aomori.lg.jp/residential/status/"
          ],
          "confirmed_at": "2026-09-27",
          "calculation_assumptions": [
            "本人所有・本人居住の戸建1戸をモデルとして採用．住宅性能の個別条件は対象設備・その他条件に記す．",
            "本人居住の個人を検討対象とし，資料で定める住民登録・税等要件は充足を仮定．他の属性は原文の条件を参照し推測で追加しない．",
            "住宅用自家消費型PV．蓄電池のみの導入は対象外．非FIT・非FIP条件，製品要件及び容量上限は自治体資料及び県共通案内の根拠全文に保存．",
            "原文の着手届，実績報告の相対期限，併用禁止の適用範囲を監査抜粋に保持．",
            "併用不可：国費による同一対象事業への重複助成禁止を含む．自治体ごとの原文範囲は監査抜粋を参照し，併用可へ一括補完しない．\n上限：個別の金額式のとおり．他制度との共通上限は未確認．",
            "本人所有・本人居住の戸建を仮定．公式に住宅所有の限定がない場合は仮定として区別．"
          ],
          "required_confirmations": [
            "非FIT・非FIPの新設PV（蓄電池は同時導入）を要する県連携制度のためFIT診断へ非算入．原式・全文根拠・市町固有の期限を保持．補助対象経費の費目，併用禁止範囲，手続・完了期限の逐条統合は添付原文抜粋に残し，独立検収まで検証完了としない．",
            "最新の受付・予算残高，対象機種・資格・申請順序を申請時に確認する．",
            "交付申請受付：開始日未確認〜2026-12-28．工事完了・実績報告の期限とは別．"
          ],
          "source_ids": [
            "kansai-02-aomori-02205-self-consumption-battery-2026-source-1",
            "kansai-02-aomori-02205-self-consumption-battery-2026-source-2",
            "kansai-02-aomori-02205-self-consumption-battery-2026-source-3",
            "kansai-02-aomori-02205-self-consumption-battery-2026-source-4",
            "kansai-02-aomori-02205-self-consumption-battery-2026-source-5",
            "kansai-02-aomori-02205-self-consumption-battery-2026-source-6"
          ],
          "machine_rule": "kansai_municipal_non_adopted",
          "non_adoption_status": "excluded",
          "non_adoption_reason_code": "official_conditions_not_applicable",
          "fit_compatible": false
        }
      ],
      "institutionalSource": "5ff3913116bfce31d111d558c85e1acc02be7065cd2b22685de1b524b20b5b29",
      "sections": [
        {
          "label": "蓄電池",
          "text": "工事費込みの税抜蓄電池対象経費の実支出額の3分の1と蓄電池の対象容量に1kWhあたり14万1,000円を掛けた額の3分の1のうち，低い額以内です．",
          "supplement": [
            "（上限）35万円",
            "（端数処理）0.1kWh未満切り捨て",
            "（端数処理）1,000円未満切り捨て"
          ]
        }
      ],
      "text": "工事費込みの税抜蓄電池対象経費の実支出額の3分の1と蓄電池の対象容量に1kWhあたり14万1,000円を掛けた額の3分の1のうち，低い額以内です．",
      "supplement": [
        "（上限）35万円",
        "（端数処理）0.1kWh未満切り捨て",
        "（端数処理）1,000円未満切り捨て"
      ],
      "commonSupplement": [],
      "equipment": "蓄電池のみ"
    },
    "aomori-02209-self-consumption-pv-2026": {
      "prefecture": "02",
      "municipality": "02209",
      "recordId": "scheme-b9e1f199bd7947459cf04b1bf9cf6111",
      "targetYear": "2026",
      "branch": {
        "branch_id": "aomori-02209-self-consumption-pv-2026",
        "diagnostic_rule_ids": [
          "aomori-02209-self-consumption-pv-2026"
        ],
        "target_equipment": [
          "太陽光パネル"
        ],
        "application_start": [
          {
            "branch_id": "aomori-02209-self-consumption-pv-2026",
            "label": "交付申請",
            "date": "2026-06-10"
          }
        ],
        "application_end": [
          {
            "branch_id": "aomori-02209-self-consumption-pv-2026",
            "label": "交付申請",
            "date": "2026-12-28"
          }
        ],
        "application_status": "受付中",
        "amount": {
          "display_text": "太陽光の税抜対象経費の実支出額，出力1kW当たり5万円の額，25万円のうち最も低い額以内です．出力はモジュールとパワーコンディショナーの小さい方を整数kWに切り捨てた値です．補助額の千円未満を切り捨てます．",
          "evidence_status": "partial"
        },
        "official_conditions": [],
        "gaps": [],
        "evidence_urls": [
          "https://www.city.tsugaru.aomori.jp/soshiki/somu/energyseisakuka/eneseisaku/10939.html",
          "https://www.city.tsugaru.aomori.jp/material/files/group/57/R8kouhuyoko.pdf",
          "https://www.city.tsugaru.aomori.jp/material/files/group/57/R8tebiki.pdf",
          "https://aomori-taiyoko.pref.aomori.lg.jp/residential/",
          "https://aomori-taiyoko.pref.aomori.lg.jp/residential/status/"
        ],
        "checked_at": "2026-09-27",
        "display_basis": "preparing",
        "migration_status": "pending_review",
        "legacy_municipal_rule_ids": []
      },
      "catalogAmount": {
        "raw_text": "PV原式：対象経費の実支出額，5万円/kWに応じた額，25万円の最小額以内．税抜対象経費を用いる．出力はモジュールとPCSの小さい値をkW単位で整数切捨て（自治体案内・手引）．金額は千円未満切捨て．",
        "display_text": "太陽光の税抜対象経費の実支出額，出力1kW当たり5万円の額，25万円のうち最も低い額以内です．出力はモジュールとパワーコンディショナーの小さい方を整数kWに切り捨てた値です．補助額の千円未満を切り捨てます．",
        "evidence_status": "partial"
      },
      "rules": [
        {
          "id": "aomori-02209-self-consumption-pv-2026",
          "government_level": "municipality",
          "prefecture_code": "02",
          "municipality_code": "02209",
          "program_name": "つがる市住宅用自家消費型太陽光発電設備等導入支援事業費補助金",
          "housing_ages": [
            "existing",
            "new"
          ],
          "equipment_packages": [
            "solar_only",
            "solar_plus_standard_battery"
          ],
          "application_status": "accepting",
          "diagnostic_scope": {
            "status": "in_scope",
            "in_scope_housing_ages": [
              "existing",
              "new"
            ],
            "excluded_branch_ids": [],
            "basis": "非FIT・非FIPの新設PV（蓄電池は同時導入）を要する県連携制度のためFIT診断へ非算入．原式・全文根拠・市町固有の期限を保持．補助対象経費の費目，併用禁止範囲，手続・完了期限の逐条統合は添付原文抜粋に残し，独立検収まで検証完了としない．"
          },
          "expense_scopes": [
            "solar"
          ],
          "conflict_program_ids": [],
          "official_urls": [
            "https://www.city.tsugaru.aomori.jp/soshiki/somu/energyseisakuka/eneseisaku/10939.html",
            "https://www.city.tsugaru.aomori.jp/material/files/group/57/R8kouhuyoko.pdf",
            "https://www.city.tsugaru.aomori.jp/material/files/group/57/R8tebiki.pdf",
            "https://aomori-taiyoko.pref.aomori.lg.jp/residential/",
            "https://aomori-taiyoko.pref.aomori.lg.jp/residential/status/"
          ],
          "confirmed_at": "2026-09-27",
          "calculation_assumptions": [
            "本人所有・本人居住の戸建1戸をモデルとして採用．住宅性能の個別条件は対象設備・その他条件に記す．",
            "本人居住の個人を検討対象とし，資料で定める住民登録・税等要件は充足を仮定．他の属性は原文の条件を参照し推測で追加しない．",
            "住宅用自家消費型PV．蓄電池のみの導入は対象外．非FIT・非FIP条件，製品要件及び容量上限は自治体資料及び県共通案内の根拠全文に保存．",
            "市案内は実績報告を工事完了又は支払の遅い日から30日以内又は2027-01-31までと記載．他市の1/29へ統一しない．原文の着手届，実績報告の相対期限，併用禁止の適用範囲を監査抜粋に保持．",
            "併用不可：国費による同一対象事業への重複助成禁止を含む．自治体ごとの原文範囲は監査抜粋を参照し，併用可へ一括補完しない．\n上限：個別の金額式のとおり．他制度との共通上限は未確認．",
            "本人所有・本人居住の戸建を仮定．公式に住宅所有の限定がない場合は仮定として区別．"
          ],
          "required_confirmations": [
            "非FIT・非FIPの新設PV（蓄電池は同時導入）を要する県連携制度のためFIT診断へ非算入．原式・全文根拠・市町固有の期限を保持．補助対象経費の費目，併用禁止範囲，手続・完了期限の逐条統合は添付原文抜粋に残し，独立検収まで検証完了としない．",
            "最新の受付・予算残高，対象機種・資格・申請順序を申請時に確認する．",
            "交付申請受付：2026-06-10〜2026-12-28．工事完了・実績報告の期限とは別．"
          ],
          "source_ids": [
            "kansai-02-aomori-02209-self-consumption-pv-2026-source-1",
            "kansai-02-aomori-02209-self-consumption-pv-2026-source-2",
            "kansai-02-aomori-02209-self-consumption-pv-2026-source-3",
            "kansai-02-aomori-02209-self-consumption-pv-2026-source-4",
            "kansai-02-aomori-02209-self-consumption-pv-2026-source-5"
          ],
          "machine_rule": "kansai_municipal_non_adopted",
          "non_adoption_status": "excluded",
          "non_adoption_reason_code": "official_conditions_not_applicable",
          "fit_compatible": false
        }
      ],
      "institutionalSource": "d45ccebdf578b3e982f9d4ce156f1182ff763a922f6d583caa06a30197625183",
      "sections": [
        {
          "label": "太陽光",
          "text": "太陽光の税抜対象経費の実支出額と太陽光の対象出力に1kWあたり5万円を掛けた額のうち，低い額以内です．",
          "supplement": [
            "（算定対象）出力の基準：モジュールとパワーコンディショナーの小さい方",
            "（上限）25万円",
            "（端数処理）1kW未満切り捨て",
            "（端数処理）1,000円未満切り捨て"
          ]
        }
      ],
      "text": "太陽光の税抜対象経費の実支出額と太陽光の対象出力に1kWあたり5万円を掛けた額のうち，低い額以内です．",
      "supplement": [
        "（算定対象）出力の基準：モジュールとパワーコンディショナーの小さい方",
        "（上限）25万円",
        "（端数処理）1kW未満切り捨て",
        "（端数処理）1,000円未満切り捨て"
      ],
      "commonSupplement": [],
      "equipment": "太陽光のみ"
    },
    "aomori-02209-self-consumption-battery-2026": {
      "prefecture": "02",
      "municipality": "02209",
      "recordId": "scheme-b9e1f199bd7947459cf04b1bf9cf6111",
      "targetYear": "2026",
      "branch": {
        "branch_id": "aomori-02209-self-consumption-battery-2026",
        "diagnostic_rule_ids": [
          "aomori-02209-self-consumption-battery-2026"
        ],
        "target_equipment": [
          "蓄電池"
        ],
        "application_start": [
          {
            "branch_id": "aomori-02209-self-consumption-battery-2026",
            "label": "交付申請",
            "date": "2026-06-10"
          }
        ],
        "application_end": [
          {
            "branch_id": "aomori-02209-self-consumption-battery-2026",
            "label": "交付申請",
            "date": "2026-12-28"
          }
        ],
        "application_status": "受付中",
        "amount": {
          "display_text": "工事費込みの税抜蓄電池対象経費の実支出額の3分の1，蓄電容量に1kWh当たり14.1万円を掛けた額の3分の1，35万円のうち最も低い額以内です．蓄電容量は0.1kWh単位で切り捨て，補助額の千円未満を切り捨てます．1kWh当たり14.1万円は対象経費の上限単価で，補助単価ではありません．",
          "evidence_status": "partial"
        },
        "official_conditions": [],
        "gaps": [],
        "evidence_urls": [
          "https://www.city.tsugaru.aomori.jp/soshiki/somu/energyseisakuka/eneseisaku/10939.html",
          "https://www.city.tsugaru.aomori.jp/material/files/group/57/R8kouhuyoko.pdf",
          "https://www.city.tsugaru.aomori.jp/material/files/group/57/R8tebiki.pdf",
          "https://aomori-taiyoko.pref.aomori.lg.jp/residential/",
          "https://aomori-taiyoko.pref.aomori.lg.jp/residential/status/"
        ],
        "checked_at": "2026-09-27",
        "display_basis": "preparing",
        "migration_status": "pending_review",
        "legacy_municipal_rule_ids": []
      },
      "catalogAmount": {
        "raw_text": "蓄電池原式：税抜対象経費実支出額の1/3，蓄電容量×141,000円/kWhの1/3，350,000円の最小額以内．工事費込み．14.1万円/kWhは補助単価でなく対象経費上限．蓄電容量は小数第2位以下切捨て（0.1kWh単位）．金額は千円未満切捨て．",
        "display_text": "工事費込みの税抜蓄電池対象経費の実支出額の3分の1，蓄電容量に1kWh当たり14.1万円を掛けた額の3分の1，35万円のうち最も低い額以内です．蓄電容量は0.1kWh単位で切り捨て，補助額の千円未満を切り捨てます．1kWh当たり14.1万円は対象経費の上限単価で，補助単価ではありません．",
        "evidence_status": "partial"
      },
      "rules": [
        {
          "id": "aomori-02209-self-consumption-battery-2026",
          "government_level": "municipality",
          "prefecture_code": "02",
          "municipality_code": "02209",
          "program_name": "つがる市住宅用自家消費型太陽光発電設備等導入支援事業費補助金",
          "housing_ages": [
            "existing",
            "new"
          ],
          "equipment_packages": [
            "solar_plus_standard_battery"
          ],
          "application_status": "accepting",
          "diagnostic_scope": {
            "status": "in_scope",
            "in_scope_housing_ages": [
              "existing",
              "new"
            ],
            "excluded_branch_ids": [],
            "basis": "非FIT・非FIPの新設PV（蓄電池は同時導入）を要する県連携制度のためFIT診断へ非算入．原式・全文根拠・市町固有の期限を保持．補助対象経費の費目，併用禁止範囲，手続・完了期限の逐条統合は添付原文抜粋に残し，独立検収まで検証完了としない．"
          },
          "expense_scopes": [
            "battery"
          ],
          "conflict_program_ids": [],
          "official_urls": [
            "https://www.city.tsugaru.aomori.jp/soshiki/somu/energyseisakuka/eneseisaku/10939.html",
            "https://www.city.tsugaru.aomori.jp/material/files/group/57/R8kouhuyoko.pdf",
            "https://www.city.tsugaru.aomori.jp/material/files/group/57/R8tebiki.pdf",
            "https://aomori-taiyoko.pref.aomori.lg.jp/residential/",
            "https://aomori-taiyoko.pref.aomori.lg.jp/residential/status/"
          ],
          "confirmed_at": "2026-09-27",
          "calculation_assumptions": [
            "本人所有・本人居住の戸建1戸をモデルとして採用．住宅性能の個別条件は対象設備・その他条件に記す．",
            "本人居住の個人を検討対象とし，資料で定める住民登録・税等要件は充足を仮定．他の属性は原文の条件を参照し推測で追加しない．",
            "住宅用自家消費型PV．蓄電池のみの導入は対象外．非FIT・非FIP条件，製品要件及び容量上限は自治体資料及び県共通案内の根拠全文に保存．",
            "市案内は実績報告を工事完了又は支払の遅い日から30日以内又は2027-01-31までと記載．他市の1/29へ統一しない．原文の着手届，実績報告の相対期限，併用禁止の適用範囲を監査抜粋に保持．",
            "併用不可：国費による同一対象事業への重複助成禁止を含む．自治体ごとの原文範囲は監査抜粋を参照し，併用可へ一括補完しない．\n上限：個別の金額式のとおり．他制度との共通上限は未確認．",
            "本人所有・本人居住の戸建を仮定．公式に住宅所有の限定がない場合は仮定として区別．"
          ],
          "required_confirmations": [
            "非FIT・非FIPの新設PV（蓄電池は同時導入）を要する県連携制度のためFIT診断へ非算入．原式・全文根拠・市町固有の期限を保持．補助対象経費の費目，併用禁止範囲，手続・完了期限の逐条統合は添付原文抜粋に残し，独立検収まで検証完了としない．",
            "最新の受付・予算残高，対象機種・資格・申請順序を申請時に確認する．",
            "交付申請受付：2026-06-10〜2026-12-28．工事完了・実績報告の期限とは別．"
          ],
          "source_ids": [
            "kansai-02-aomori-02209-self-consumption-battery-2026-source-1",
            "kansai-02-aomori-02209-self-consumption-battery-2026-source-2",
            "kansai-02-aomori-02209-self-consumption-battery-2026-source-3",
            "kansai-02-aomori-02209-self-consumption-battery-2026-source-4",
            "kansai-02-aomori-02209-self-consumption-battery-2026-source-5"
          ],
          "machine_rule": "kansai_municipal_non_adopted",
          "non_adoption_status": "excluded",
          "non_adoption_reason_code": "official_conditions_not_applicable",
          "fit_compatible": false
        }
      ],
      "institutionalSource": "926fceff5e2235888b867c0030d54e77f8017d3a4f048748002cf6445ad00403",
      "sections": [
        {
          "label": "蓄電池",
          "text": "工事費込みの税抜蓄電池対象経費の実支出額の3分の1と蓄電池の対象容量に1kWhあたり14万1,000円を掛けた額の3分の1のうち，低い額以内です．",
          "supplement": [
            "（上限）35万円",
            "（端数処理）0.1kWh未満切り捨て",
            "（端数処理）1,000円未満切り捨て"
          ]
        }
      ],
      "text": "工事費込みの税抜蓄電池対象経費の実支出額の3分の1と蓄電池の対象容量に1kWhあたり14万1,000円を掛けた額の3分の1のうち，低い額以内です．",
      "supplement": [
        "（上限）35万円",
        "（端数処理）0.1kWh未満切り捨て",
        "（端数処理）1,000円未満切り捨て"
      ],
      "commonSupplement": [],
      "equipment": "蓄電池のみ"
    },
    "aomori-02301-self-consumption-pv-2026": {
      "prefecture": "02",
      "municipality": "02301",
      "recordId": "scheme-1eea5b74fc79442e8db66d2aaf7b05de",
      "targetYear": "2026",
      "branch": {
        "branch_id": "aomori-02301-self-consumption-pv-2026",
        "diagnostic_rule_ids": [
          "aomori-02301-self-consumption-pv-2026"
        ],
        "target_equipment": [
          "太陽光パネル"
        ],
        "application_start": [
          {
            "branch_id": "aomori-02301-self-consumption-pv-2026",
            "label": "交付申請",
            "date": ""
          }
        ],
        "application_end": [
          {
            "branch_id": "aomori-02301-self-consumption-pv-2026",
            "label": "交付申請",
            "date": "2026-12-28"
          }
        ],
        "application_status": "受付中",
        "amount": {
          "display_text": "太陽光の税抜対象経費の実支出額，出力1kW当たり5万円の額，25万円のうち最も低い額以内です．出力はモジュールとパワーコンディショナーの小さい方を整数kWに切り捨てた値です．補助額の千円未満を切り捨てます．",
          "evidence_status": "partial"
        },
        "official_conditions": [],
        "gaps": [],
        "evidence_urls": [
          "https://www.town.hiranai.aomori.jp/kurashi/gomi/4/2441.html",
          "https://www.town.hiranai.aomori.jp/material/files/group/5/06151.pdf",
          "https://www.town.hiranai.aomori.jp/material/files/group/5/06152.pdf",
          "https://www.town.hiranai.aomori.jp/material/files/group/5/061512.pdf",
          "https://aomori-taiyoko.pref.aomori.lg.jp/residential/",
          "https://aomori-taiyoko.pref.aomori.lg.jp/residential/status/"
        ],
        "checked_at": "2026-09-27",
        "display_basis": "preparing",
        "migration_status": "pending_review",
        "legacy_municipal_rule_ids": []
      },
      "catalogAmount": {
        "raw_text": "PV原式：対象経費の実支出額，5万円/kWに応じた額，25万円の最小額以内．税抜対象経費を用いる．出力はモジュールとPCSの小さい値をkW単位で整数切捨て（自治体案内・手引）．金額は千円未満切捨て．",
        "display_text": "太陽光の税抜対象経費の実支出額，出力1kW当たり5万円の額，25万円のうち最も低い額以内です．出力はモジュールとパワーコンディショナーの小さい方を整数kWに切り捨てた値です．補助額の千円未満を切り捨てます．",
        "evidence_status": "partial"
      },
      "rules": [
        {
          "id": "aomori-02301-self-consumption-pv-2026",
          "government_level": "municipality",
          "prefecture_code": "02",
          "municipality_code": "02301",
          "program_name": "平内町住宅用自家消費型太陽光発電設備等導入支援事業費補助金",
          "housing_ages": [
            "existing",
            "new"
          ],
          "equipment_packages": [
            "solar_only",
            "solar_plus_standard_battery"
          ],
          "application_status": "accepting",
          "diagnostic_scope": {
            "status": "in_scope",
            "in_scope_housing_ages": [
              "existing",
              "new"
            ],
            "excluded_branch_ids": [],
            "basis": "非FIT・非FIPの新設PV（蓄電池は同時導入）を要する県連携制度のためFIT診断へ非算入．原式・全文根拠・市町固有の期限を保持．補助対象経費の費目，併用禁止範囲，手続・完了期限の逐条統合は添付原文抜粋に残し，独立検収まで検証完了としない．"
          },
          "expense_scopes": [
            "solar"
          ],
          "conflict_program_ids": [],
          "official_urls": [
            "https://www.town.hiranai.aomori.jp/kurashi/gomi/4/2441.html",
            "https://www.town.hiranai.aomori.jp/material/files/group/5/06151.pdf",
            "https://www.town.hiranai.aomori.jp/material/files/group/5/06152.pdf",
            "https://www.town.hiranai.aomori.jp/material/files/group/5/061512.pdf",
            "https://aomori-taiyoko.pref.aomori.lg.jp/residential/",
            "https://aomori-taiyoko.pref.aomori.lg.jp/residential/status/"
          ],
          "confirmed_at": "2026-09-27",
          "calculation_assumptions": [
            "本人所有・本人居住の戸建1戸をモデルとして採用．住宅性能の個別条件は対象設備・その他条件に記す．",
            "本人居住の個人を検討対象とし，資料で定める住民登録・税等要件は充足を仮定．他の属性は原文の条件を参照し推測で追加しない．",
            "住宅用自家消費型PV．蓄電池のみの導入は対象外．非FIT・非FIP条件，製品要件及び容量上限は自治体資料及び県共通案内の根拠全文に保存．",
            "別表の実績報告最終期限は1/31，手引等との日付整合を独立レビュー対象に保持．原文の着手届，実績報告の相対期限，併用禁止の適用範囲を監査抜粋に保持．",
            "併用不可：国費による同一対象事業への重複助成禁止を含む．自治体ごとの原文範囲は監査抜粋を参照し，併用可へ一括補完しない．\n上限：個別の金額式のとおり．他制度との共通上限は未確認．",
            "本人所有・本人居住の戸建を仮定．公式に住宅所有の限定がない場合は仮定として区別．"
          ],
          "required_confirmations": [
            "非FIT・非FIPの新設PV（蓄電池は同時導入）を要する県連携制度のためFIT診断へ非算入．原式・全文根拠・市町固有の期限を保持．補助対象経費の費目，併用禁止範囲，手続・完了期限の逐条統合は添付原文抜粋に残し，独立検収まで検証完了としない．",
            "最新の受付・予算残高，対象機種・資格・申請順序を申請時に確認する．",
            "交付申請受付：開始日未確認〜2026-12-28．工事完了・実績報告の期限とは別．"
          ],
          "source_ids": [
            "kansai-02-aomori-02301-self-consumption-pv-2026-source-1",
            "kansai-02-aomori-02301-self-consumption-pv-2026-source-2",
            "kansai-02-aomori-02301-self-consumption-pv-2026-source-3",
            "kansai-02-aomori-02301-self-consumption-pv-2026-source-4",
            "kansai-02-aomori-02301-self-consumption-pv-2026-source-5",
            "kansai-02-aomori-02301-self-consumption-pv-2026-source-6"
          ],
          "machine_rule": "kansai_municipal_non_adopted",
          "non_adoption_status": "excluded",
          "non_adoption_reason_code": "official_conditions_not_applicable",
          "fit_compatible": false
        }
      ],
      "institutionalSource": "656d00b3ce5962ac9c245fb44dae17b29e79b3bc37d64d829b5b98504fd8247e",
      "sections": [
        {
          "label": "太陽光",
          "text": "太陽光の税抜対象経費の実支出額と太陽光の対象出力に1kWあたり5万円を掛けた額のうち，低い額以内です．",
          "supplement": [
            "（算定対象）出力の基準：モジュールとパワーコンディショナーの小さい方",
            "（上限）25万円",
            "（端数処理）1kW未満切り捨て",
            "（端数処理）1,000円未満切り捨て"
          ]
        }
      ],
      "text": "太陽光の税抜対象経費の実支出額と太陽光の対象出力に1kWあたり5万円を掛けた額のうち，低い額以内です．",
      "supplement": [
        "（算定対象）出力の基準：モジュールとパワーコンディショナーの小さい方",
        "（上限）25万円",
        "（端数処理）1kW未満切り捨て",
        "（端数処理）1,000円未満切り捨て"
      ],
      "commonSupplement": [],
      "equipment": "太陽光のみ"
    },
    "aomori-02301-self-consumption-battery-2026": {
      "prefecture": "02",
      "municipality": "02301",
      "recordId": "scheme-1eea5b74fc79442e8db66d2aaf7b05de",
      "targetYear": "2026",
      "branch": {
        "branch_id": "aomori-02301-self-consumption-battery-2026",
        "diagnostic_rule_ids": [
          "aomori-02301-self-consumption-battery-2026"
        ],
        "target_equipment": [
          "蓄電池"
        ],
        "application_start": [
          {
            "branch_id": "aomori-02301-self-consumption-battery-2026",
            "label": "交付申請",
            "date": ""
          }
        ],
        "application_end": [
          {
            "branch_id": "aomori-02301-self-consumption-battery-2026",
            "label": "交付申請",
            "date": "2026-12-28"
          }
        ],
        "application_status": "受付中",
        "amount": {
          "display_text": "工事費込みの税抜蓄電池対象経費の実支出額の3分の1，蓄電容量に1kWh当たり14.1万円を掛けた額の3分の1，35万円のうち最も低い額以内です．蓄電容量は0.1kWh単位で切り捨て，補助額の千円未満を切り捨てます．1kWh当たり14.1万円は対象経費の上限単価で，補助単価ではありません．",
          "evidence_status": "partial"
        },
        "official_conditions": [],
        "gaps": [],
        "evidence_urls": [
          "https://www.town.hiranai.aomori.jp/kurashi/gomi/4/2441.html",
          "https://www.town.hiranai.aomori.jp/material/files/group/5/06151.pdf",
          "https://www.town.hiranai.aomori.jp/material/files/group/5/06152.pdf",
          "https://www.town.hiranai.aomori.jp/material/files/group/5/061512.pdf",
          "https://aomori-taiyoko.pref.aomori.lg.jp/residential/",
          "https://aomori-taiyoko.pref.aomori.lg.jp/residential/status/"
        ],
        "checked_at": "2026-09-27",
        "display_basis": "preparing",
        "migration_status": "pending_review",
        "legacy_municipal_rule_ids": []
      },
      "catalogAmount": {
        "raw_text": "蓄電池原式：税抜対象経費実支出額の1/3，蓄電容量×141,000円/kWhの1/3，350,000円の最小額以内．工事費込み．14.1万円/kWhは補助単価でなく対象経費上限．蓄電容量は小数第2位以下切捨て（0.1kWh単位）．金額は千円未満切捨て．",
        "display_text": "工事費込みの税抜蓄電池対象経費の実支出額の3分の1，蓄電容量に1kWh当たり14.1万円を掛けた額の3分の1，35万円のうち最も低い額以内です．蓄電容量は0.1kWh単位で切り捨て，補助額の千円未満を切り捨てます．1kWh当たり14.1万円は対象経費の上限単価で，補助単価ではありません．",
        "evidence_status": "partial"
      },
      "rules": [
        {
          "id": "aomori-02301-self-consumption-battery-2026",
          "government_level": "municipality",
          "prefecture_code": "02",
          "municipality_code": "02301",
          "program_name": "平内町住宅用自家消費型太陽光発電設備等導入支援事業費補助金",
          "housing_ages": [
            "existing",
            "new"
          ],
          "equipment_packages": [
            "solar_plus_standard_battery"
          ],
          "application_status": "accepting",
          "diagnostic_scope": {
            "status": "in_scope",
            "in_scope_housing_ages": [
              "existing",
              "new"
            ],
            "excluded_branch_ids": [],
            "basis": "非FIT・非FIPの新設PV（蓄電池は同時導入）を要する県連携制度のためFIT診断へ非算入．原式・全文根拠・市町固有の期限を保持．補助対象経費の費目，併用禁止範囲，手続・完了期限の逐条統合は添付原文抜粋に残し，独立検収まで検証完了としない．"
          },
          "expense_scopes": [
            "battery"
          ],
          "conflict_program_ids": [],
          "official_urls": [
            "https://www.town.hiranai.aomori.jp/kurashi/gomi/4/2441.html",
            "https://www.town.hiranai.aomori.jp/material/files/group/5/06151.pdf",
            "https://www.town.hiranai.aomori.jp/material/files/group/5/06152.pdf",
            "https://www.town.hiranai.aomori.jp/material/files/group/5/061512.pdf",
            "https://aomori-taiyoko.pref.aomori.lg.jp/residential/",
            "https://aomori-taiyoko.pref.aomori.lg.jp/residential/status/"
          ],
          "confirmed_at": "2026-09-27",
          "calculation_assumptions": [
            "本人所有・本人居住の戸建1戸をモデルとして採用．住宅性能の個別条件は対象設備・その他条件に記す．",
            "本人居住の個人を検討対象とし，資料で定める住民登録・税等要件は充足を仮定．他の属性は原文の条件を参照し推測で追加しない．",
            "住宅用自家消費型PV．蓄電池のみの導入は対象外．非FIT・非FIP条件，製品要件及び容量上限は自治体資料及び県共通案内の根拠全文に保存．",
            "別表の実績報告最終期限は1/31，手引等との日付整合を独立レビュー対象に保持．原文の着手届，実績報告の相対期限，併用禁止の適用範囲を監査抜粋に保持．",
            "併用不可：国費による同一対象事業への重複助成禁止を含む．自治体ごとの原文範囲は監査抜粋を参照し，併用可へ一括補完しない．\n上限：個別の金額式のとおり．他制度との共通上限は未確認．",
            "本人所有・本人居住の戸建を仮定．公式に住宅所有の限定がない場合は仮定として区別．"
          ],
          "required_confirmations": [
            "非FIT・非FIPの新設PV（蓄電池は同時導入）を要する県連携制度のためFIT診断へ非算入．原式・全文根拠・市町固有の期限を保持．補助対象経費の費目，併用禁止範囲，手続・完了期限の逐条統合は添付原文抜粋に残し，独立検収まで検証完了としない．",
            "最新の受付・予算残高，対象機種・資格・申請順序を申請時に確認する．",
            "交付申請受付：開始日未確認〜2026-12-28．工事完了・実績報告の期限とは別．"
          ],
          "source_ids": [
            "kansai-02-aomori-02301-self-consumption-battery-2026-source-1",
            "kansai-02-aomori-02301-self-consumption-battery-2026-source-2",
            "kansai-02-aomori-02301-self-consumption-battery-2026-source-3",
            "kansai-02-aomori-02301-self-consumption-battery-2026-source-4",
            "kansai-02-aomori-02301-self-consumption-battery-2026-source-5",
            "kansai-02-aomori-02301-self-consumption-battery-2026-source-6"
          ],
          "machine_rule": "kansai_municipal_non_adopted",
          "non_adoption_status": "excluded",
          "non_adoption_reason_code": "official_conditions_not_applicable",
          "fit_compatible": false
        }
      ],
      "institutionalSource": "4dcdc9eb38fb1f3ac0c75ec202e53f8f81fe22f404a6a4f9138c3705e7c77f47",
      "sections": [
        {
          "label": "蓄電池",
          "text": "工事費込みの税抜蓄電池対象経費の実支出額の3分の1と蓄電池の対象容量に1kWhあたり14万1,000円を掛けた額の3分の1のうち，低い額以内です．",
          "supplement": [
            "（上限）35万円",
            "（端数処理）0.1kWh未満切り捨て",
            "（端数処理）1,000円未満切り捨て"
          ]
        }
      ],
      "text": "工事費込みの税抜蓄電池対象経費の実支出額の3分の1と蓄電池の対象容量に1kWhあたり14万1,000円を掛けた額の3分の1のうち，低い額以内です．",
      "supplement": [
        "（上限）35万円",
        "（端数処理）0.1kWh未満切り捨て",
        "（端数処理）1,000円未満切り捨て"
      ],
      "commonSupplement": [],
      "equipment": "蓄電池のみ"
    },
    "aomori-02307-self-consumption-pv-2026": {
      "prefecture": "02",
      "municipality": "02307",
      "recordId": "scheme-bfa8897ceb9b4b8f8353e82adb2951dc",
      "targetYear": "2026",
      "branch": {
        "branch_id": "aomori-02307-self-consumption-pv-2026",
        "diagnostic_rule_ids": [
          "aomori-02307-self-consumption-pv-2026"
        ],
        "target_equipment": [
          "太陽光パネル"
        ],
        "application_start": [
          {
            "branch_id": "aomori-02307-self-consumption-pv-2026",
            "label": "交付申請",
            "date": "2026-07-01"
          }
        ],
        "application_end": [
          {
            "branch_id": "aomori-02307-self-consumption-pv-2026",
            "label": "交付申請",
            "date": "2026-12-28"
          }
        ],
        "application_status": "受付中",
        "amount": {
          "display_text": "太陽光の税抜対象経費の実支出額，出力1kW当たり5万円の額，25万円のうち最も低い額以内です．出力はモジュールとパワーコンディショナーの小さい方を整数kWに切り捨てた値です．補助額の千円未満を切り捨てます．",
          "evidence_status": "partial"
        },
        "official_conditions": [],
        "gaps": [],
        "evidence_urls": [
          "https://www.town.sotogahama.lg.jp/kurashi/sumai/2026-0613-1339-13.html",
          "https://www.town.sotogahama.lg.jp/kurashi/sumai/files/sotogahamakofuyoko_1.pdf",
          "https://www.town.sotogahama.lg.jp/kurashi/sumai/files/yokobeppyo.pdf",
          "https://www.town.sotogahama.lg.jp/kurashi/sumai/files/sotogahamashinseinotebiki.pdf",
          "https://aomori-taiyoko.pref.aomori.lg.jp/residential/",
          "https://aomori-taiyoko.pref.aomori.lg.jp/residential/status/"
        ],
        "checked_at": "2026-09-27",
        "display_basis": "preparing",
        "migration_status": "pending_review",
        "legacy_municipal_rule_ids": []
      },
      "catalogAmount": {
        "raw_text": "PV原式：対象経費の実支出額，5万円/kWに応じた額，25万円の最小額以内．税抜対象経費を用いる．出力はモジュールとPCSの小さい値をkW単位で整数切捨て（自治体案内・手引）．金額は千円未満切捨て．",
        "display_text": "太陽光の税抜対象経費の実支出額，出力1kW当たり5万円の額，25万円のうち最も低い額以内です．出力はモジュールとパワーコンディショナーの小さい方を整数kWに切り捨てた値です．補助額の千円未満を切り捨てます．",
        "evidence_status": "partial"
      },
      "rules": [
        {
          "id": "aomori-02307-self-consumption-pv-2026",
          "government_level": "municipality",
          "prefecture_code": "02",
          "municipality_code": "02307",
          "program_name": "外ヶ浜町住宅用自家消費型太陽光発電設備等導入支援事業費補助金",
          "housing_ages": [
            "existing",
            "new"
          ],
          "equipment_packages": [
            "solar_only",
            "solar_plus_standard_battery"
          ],
          "application_status": "accepting",
          "diagnostic_scope": {
            "status": "in_scope",
            "in_scope_housing_ages": [
              "existing",
              "new"
            ],
            "excluded_branch_ids": [],
            "basis": "非FIT・非FIPの新設PV（蓄電池は同時導入）を要する県連携制度のためFIT診断へ非算入．原式・全文根拠・市町固有の期限を保持．補助対象経費の費目，併用禁止範囲，手続・完了期限の逐条統合は添付原文抜粋に残し，独立検収まで検証完了としない．"
          },
          "expense_scopes": [
            "solar"
          ],
          "conflict_program_ids": [],
          "official_urls": [
            "https://www.town.sotogahama.lg.jp/kurashi/sumai/2026-0613-1339-13.html",
            "https://www.town.sotogahama.lg.jp/kurashi/sumai/files/sotogahamakofuyoko_1.pdf",
            "https://www.town.sotogahama.lg.jp/kurashi/sumai/files/yokobeppyo.pdf",
            "https://www.town.sotogahama.lg.jp/kurashi/sumai/files/sotogahamashinseinotebiki.pdf",
            "https://aomori-taiyoko.pref.aomori.lg.jp/residential/",
            "https://aomori-taiyoko.pref.aomori.lg.jp/residential/status/"
          ],
          "confirmed_at": "2026-09-27",
          "calculation_assumptions": [
            "本人所有・本人居住の戸建1戸をモデルとして採用．住宅性能の個別条件は対象設備・その他条件に記す．",
            "本人居住の個人を検討対象とし，資料で定める住民登録・税等要件は充足を仮定．他の属性は原文の条件を参照し推測で追加しない．",
            "住宅用自家消費型PV．蓄電池のみの導入は対象外．非FIT・非FIP条件，製品要件及び容量上限は自治体資料及び県共通案内の根拠全文に保存．",
            "原文の着手届，実績報告の相対期限，併用禁止の適用範囲を監査抜粋に保持．",
            "併用不可：国費による同一対象事業への重複助成禁止を含む．自治体ごとの原文範囲は監査抜粋を参照し，併用可へ一括補完しない．\n上限：個別の金額式のとおり．他制度との共通上限は未確認．",
            "本人所有・本人居住の戸建を仮定．公式に住宅所有の限定がない場合は仮定として区別．"
          ],
          "required_confirmations": [
            "非FIT・非FIPの新設PV（蓄電池は同時導入）を要する県連携制度のためFIT診断へ非算入．原式・全文根拠・市町固有の期限を保持．補助対象経費の費目，併用禁止範囲，手続・完了期限の逐条統合は添付原文抜粋に残し，独立検収まで検証完了としない．",
            "最新の受付・予算残高，対象機種・資格・申請順序を申請時に確認する．",
            "交付申請受付：2026-07-01〜2026-12-28．工事完了・実績報告の期限とは別．"
          ],
          "source_ids": [
            "kansai-02-aomori-02307-self-consumption-pv-2026-source-1",
            "kansai-02-aomori-02307-self-consumption-pv-2026-source-2",
            "kansai-02-aomori-02307-self-consumption-pv-2026-source-3",
            "kansai-02-aomori-02307-self-consumption-pv-2026-source-4",
            "kansai-02-aomori-02307-self-consumption-pv-2026-source-5",
            "kansai-02-aomori-02307-self-consumption-pv-2026-source-6"
          ],
          "machine_rule": "kansai_municipal_non_adopted",
          "non_adoption_status": "excluded",
          "non_adoption_reason_code": "official_conditions_not_applicable",
          "fit_compatible": false
        }
      ],
      "institutionalSource": "545e1db040fb83499fbc345b2d171d9f84fb3713be5753c1fdefdd059550d87f",
      "sections": [
        {
          "label": "太陽光",
          "text": "太陽光の税抜対象経費の実支出額と太陽光の対象出力に1kWあたり5万円を掛けた額のうち，低い額以内です．",
          "supplement": [
            "（算定対象）出力の基準：モジュールとパワーコンディショナーの小さい方",
            "（上限）25万円",
            "（端数処理）1kW未満切り捨て",
            "（端数処理）1,000円未満切り捨て"
          ]
        }
      ],
      "text": "太陽光の税抜対象経費の実支出額と太陽光の対象出力に1kWあたり5万円を掛けた額のうち，低い額以内です．",
      "supplement": [
        "（算定対象）出力の基準：モジュールとパワーコンディショナーの小さい方",
        "（上限）25万円",
        "（端数処理）1kW未満切り捨て",
        "（端数処理）1,000円未満切り捨て"
      ],
      "commonSupplement": [],
      "equipment": "太陽光のみ"
    },
    "aomori-02307-self-consumption-battery-2026": {
      "prefecture": "02",
      "municipality": "02307",
      "recordId": "scheme-bfa8897ceb9b4b8f8353e82adb2951dc",
      "targetYear": "2026",
      "branch": {
        "branch_id": "aomori-02307-self-consumption-battery-2026",
        "diagnostic_rule_ids": [
          "aomori-02307-self-consumption-battery-2026"
        ],
        "target_equipment": [
          "蓄電池"
        ],
        "application_start": [
          {
            "branch_id": "aomori-02307-self-consumption-battery-2026",
            "label": "交付申請",
            "date": "2026-07-01"
          }
        ],
        "application_end": [
          {
            "branch_id": "aomori-02307-self-consumption-battery-2026",
            "label": "交付申請",
            "date": "2026-12-28"
          }
        ],
        "application_status": "受付中",
        "amount": {
          "display_text": "工事費込みの税抜蓄電池対象経費の実支出額の3分の1，蓄電容量に1kWh当たり14.1万円を掛けた額の3分の1，35万円のうち最も低い額以内です．蓄電容量は0.1kWh単位で切り捨て，補助額の千円未満を切り捨てます．1kWh当たり14.1万円は対象経費の上限単価で，補助単価ではありません．",
          "evidence_status": "partial"
        },
        "official_conditions": [],
        "gaps": [],
        "evidence_urls": [
          "https://www.town.sotogahama.lg.jp/kurashi/sumai/2026-0613-1339-13.html",
          "https://www.town.sotogahama.lg.jp/kurashi/sumai/files/sotogahamakofuyoko_1.pdf",
          "https://www.town.sotogahama.lg.jp/kurashi/sumai/files/yokobeppyo.pdf",
          "https://www.town.sotogahama.lg.jp/kurashi/sumai/files/sotogahamashinseinotebiki.pdf",
          "https://aomori-taiyoko.pref.aomori.lg.jp/residential/",
          "https://aomori-taiyoko.pref.aomori.lg.jp/residential/status/"
        ],
        "checked_at": "2026-09-27",
        "display_basis": "preparing",
        "migration_status": "pending_review",
        "legacy_municipal_rule_ids": []
      },
      "catalogAmount": {
        "raw_text": "蓄電池原式：税抜対象経費実支出額の1/3，蓄電容量×141,000円/kWhの1/3，350,000円の最小額以内．工事費込み．14.1万円/kWhは補助単価でなく対象経費上限．蓄電容量は小数第2位以下切捨て（0.1kWh単位）．金額は千円未満切捨て．",
        "display_text": "工事費込みの税抜蓄電池対象経費の実支出額の3分の1，蓄電容量に1kWh当たり14.1万円を掛けた額の3分の1，35万円のうち最も低い額以内です．蓄電容量は0.1kWh単位で切り捨て，補助額の千円未満を切り捨てます．1kWh当たり14.1万円は対象経費の上限単価で，補助単価ではありません．",
        "evidence_status": "partial"
      },
      "rules": [
        {
          "id": "aomori-02307-self-consumption-battery-2026",
          "government_level": "municipality",
          "prefecture_code": "02",
          "municipality_code": "02307",
          "program_name": "外ヶ浜町住宅用自家消費型太陽光発電設備等導入支援事業費補助金",
          "housing_ages": [
            "existing",
            "new"
          ],
          "equipment_packages": [
            "solar_plus_standard_battery"
          ],
          "application_status": "accepting",
          "diagnostic_scope": {
            "status": "in_scope",
            "in_scope_housing_ages": [
              "existing",
              "new"
            ],
            "excluded_branch_ids": [],
            "basis": "非FIT・非FIPの新設PV（蓄電池は同時導入）を要する県連携制度のためFIT診断へ非算入．原式・全文根拠・市町固有の期限を保持．補助対象経費の費目，併用禁止範囲，手続・完了期限の逐条統合は添付原文抜粋に残し，独立検収まで検証完了としない．"
          },
          "expense_scopes": [
            "battery"
          ],
          "conflict_program_ids": [],
          "official_urls": [
            "https://www.town.sotogahama.lg.jp/kurashi/sumai/2026-0613-1339-13.html",
            "https://www.town.sotogahama.lg.jp/kurashi/sumai/files/sotogahamakofuyoko_1.pdf",
            "https://www.town.sotogahama.lg.jp/kurashi/sumai/files/yokobeppyo.pdf",
            "https://www.town.sotogahama.lg.jp/kurashi/sumai/files/sotogahamashinseinotebiki.pdf",
            "https://aomori-taiyoko.pref.aomori.lg.jp/residential/",
            "https://aomori-taiyoko.pref.aomori.lg.jp/residential/status/"
          ],
          "confirmed_at": "2026-09-27",
          "calculation_assumptions": [
            "本人所有・本人居住の戸建1戸をモデルとして採用．住宅性能の個別条件は対象設備・その他条件に記す．",
            "本人居住の個人を検討対象とし，資料で定める住民登録・税等要件は充足を仮定．他の属性は原文の条件を参照し推測で追加しない．",
            "住宅用自家消費型PV．蓄電池のみの導入は対象外．非FIT・非FIP条件，製品要件及び容量上限は自治体資料及び県共通案内の根拠全文に保存．",
            "原文の着手届，実績報告の相対期限，併用禁止の適用範囲を監査抜粋に保持．",
            "併用不可：国費による同一対象事業への重複助成禁止を含む．自治体ごとの原文範囲は監査抜粋を参照し，併用可へ一括補完しない．\n上限：個別の金額式のとおり．他制度との共通上限は未確認．",
            "本人所有・本人居住の戸建を仮定．公式に住宅所有の限定がない場合は仮定として区別．"
          ],
          "required_confirmations": [
            "非FIT・非FIPの新設PV（蓄電池は同時導入）を要する県連携制度のためFIT診断へ非算入．原式・全文根拠・市町固有の期限を保持．補助対象経費の費目，併用禁止範囲，手続・完了期限の逐条統合は添付原文抜粋に残し，独立検収まで検証完了としない．",
            "最新の受付・予算残高，対象機種・資格・申請順序を申請時に確認する．",
            "交付申請受付：2026-07-01〜2026-12-28．工事完了・実績報告の期限とは別．"
          ],
          "source_ids": [
            "kansai-02-aomori-02307-self-consumption-battery-2026-source-1",
            "kansai-02-aomori-02307-self-consumption-battery-2026-source-2",
            "kansai-02-aomori-02307-self-consumption-battery-2026-source-3",
            "kansai-02-aomori-02307-self-consumption-battery-2026-source-4",
            "kansai-02-aomori-02307-self-consumption-battery-2026-source-5",
            "kansai-02-aomori-02307-self-consumption-battery-2026-source-6"
          ],
          "machine_rule": "kansai_municipal_non_adopted",
          "non_adoption_status": "excluded",
          "non_adoption_reason_code": "official_conditions_not_applicable",
          "fit_compatible": false
        }
      ],
      "institutionalSource": "e989d5f1704ccd1fbdc70fe30fc88b4d338cf70f431e0203de57bddbd53bc9a7",
      "sections": [
        {
          "label": "蓄電池",
          "text": "工事費込みの税抜蓄電池対象経費の実支出額の3分の1と蓄電池の対象容量に1kWhあたり14万1,000円を掛けた額の3分の1のうち，低い額以内です．",
          "supplement": [
            "（上限）35万円",
            "（端数処理）0.1kWh未満切り捨て",
            "（端数処理）1,000円未満切り捨て"
          ]
        }
      ],
      "text": "工事費込みの税抜蓄電池対象経費の実支出額の3分の1と蓄電池の対象容量に1kWhあたり14万1,000円を掛けた額の3分の1のうち，低い額以内です．",
      "supplement": [
        "（上限）35万円",
        "（端数処理）0.1kWh未満切り捨て",
        "（端数処理）1,000円未満切り捨て"
      ],
      "commonSupplement": [],
      "equipment": "蓄電池のみ"
    },
    "aomori-02361-self-consumption-pv-2026": {
      "prefecture": "02",
      "municipality": "02361",
      "recordId": "scheme-0ef6ec25a9a74c95b258952bcacdf2ac",
      "targetYear": "2026",
      "branch": {
        "branch_id": "aomori-02361-self-consumption-pv-2026",
        "diagnostic_rule_ids": [
          "aomori-02361-self-consumption-pv-2026"
        ],
        "target_equipment": [
          "太陽光パネル"
        ],
        "application_start": [
          {
            "branch_id": "aomori-02361-self-consumption-pv-2026",
            "label": "交付申請",
            "date": ""
          }
        ],
        "application_end": [
          {
            "branch_id": "aomori-02361-self-consumption-pv-2026",
            "label": "交付申請",
            "date": "2026-12-28"
          }
        ],
        "application_status": "受付中",
        "amount": {
          "display_text": "太陽光の税抜対象経費の実支出額，出力1kW当たり5万円の額，25万円のうち最も低い額以内です．出力はモジュールとパワーコンディショナーの小さい方を整数kWに切り捨てた値です．補助額の千円未満を切り捨てます．",
          "evidence_status": "partial"
        },
        "official_conditions": [],
        "gaps": [],
        "evidence_urls": [
          "https://www.town.fujisaki.lg.jp/index.cfm/7,22655,24,339,html",
          "https://www.town.fujisaki.lg.jp/index.cfm/7,22655,c,html/22655/01_R8_solar_panel_subsidy_manual.pdf",
          "https://www.town.fujisaki.lg.jp/index.cfm/7,22655,c,html/22655/02_solar_panel_subsidy_outline.pdf",
          "https://aomori-taiyoko.pref.aomori.lg.jp/residential/",
          "https://aomori-taiyoko.pref.aomori.lg.jp/residential/status/"
        ],
        "checked_at": "2026-09-27",
        "display_basis": "preparing",
        "migration_status": "pending_review",
        "legacy_municipal_rule_ids": []
      },
      "catalogAmount": {
        "raw_text": "PV原式：対象経費の実支出額，5万円/kWに応じた額，25万円の最小額以内．税抜対象経費を用いる．出力はモジュールとPCSの小さい値をkW単位で整数切捨て（自治体案内・手引）．金額は千円未満切捨て．",
        "display_text": "太陽光の税抜対象経費の実支出額，出力1kW当たり5万円の額，25万円のうち最も低い額以内です．出力はモジュールとパワーコンディショナーの小さい方を整数kWに切り捨てた値です．補助額の千円未満を切り捨てます．",
        "evidence_status": "partial"
      },
      "rules": [
        {
          "id": "aomori-02361-self-consumption-pv-2026",
          "government_level": "municipality",
          "prefecture_code": "02",
          "municipality_code": "02361",
          "program_name": "藤崎町住宅用自家消費型太陽光発電設備等導入支援事業費補助金",
          "housing_ages": [
            "existing",
            "new"
          ],
          "equipment_packages": [
            "solar_only",
            "solar_plus_standard_battery"
          ],
          "application_status": "accepting",
          "diagnostic_scope": {
            "status": "in_scope",
            "in_scope_housing_ages": [
              "existing",
              "new"
            ],
            "excluded_branch_ids": [],
            "basis": "非FIT・非FIPの新設PV（蓄電池は同時導入）を要する県連携制度のためFIT診断へ非算入．原式・全文根拠・市町固有の期限を保持．補助対象経費の費目，併用禁止範囲，手続・完了期限の逐条統合は添付原文抜粋に残し，独立検収まで検証完了としない．"
          },
          "expense_scopes": [
            "solar"
          ],
          "conflict_program_ids": [],
          "official_urls": [
            "https://www.town.fujisaki.lg.jp/index.cfm/7,22655,24,339,html",
            "https://www.town.fujisaki.lg.jp/index.cfm/7,22655,c,html/22655/01_R8_solar_panel_subsidy_manual.pdf",
            "https://www.town.fujisaki.lg.jp/index.cfm/7,22655,c,html/22655/02_solar_panel_subsidy_outline.pdf",
            "https://aomori-taiyoko.pref.aomori.lg.jp/residential/",
            "https://aomori-taiyoko.pref.aomori.lg.jp/residential/status/"
          ],
          "confirmed_at": "2026-09-27",
          "calculation_assumptions": [
            "本人所有・本人居住の戸建1戸をモデルとして採用．住宅性能の個別条件は対象設備・その他条件に記す．",
            "本人居住の個人を検討対象とし，資料で定める住民登録・税等要件は充足を仮定．他の属性は原文の条件を参照し推測で追加しない．",
            "住宅用自家消費型PV．蓄電池のみの導入は対象外．非FIT・非FIP条件，製品要件及び容量上限は自治体資料及び県共通案内の根拠全文に保存．",
            "原文の着手届，実績報告の相対期限，併用禁止の適用範囲を監査抜粋に保持．",
            "併用不可：国費による同一対象事業への重複助成禁止を含む．自治体ごとの原文範囲は監査抜粋を参照し，併用可へ一括補完しない．\n上限：個別の金額式のとおり．他制度との共通上限は未確認．",
            "本人所有・本人居住の戸建を仮定．公式に住宅所有の限定がない場合は仮定として区別．"
          ],
          "required_confirmations": [
            "非FIT・非FIPの新設PV（蓄電池は同時導入）を要する県連携制度のためFIT診断へ非算入．原式・全文根拠・市町固有の期限を保持．補助対象経費の費目，併用禁止範囲，手続・完了期限の逐条統合は添付原文抜粋に残し，独立検収まで検証完了としない．",
            "最新の受付・予算残高，対象機種・資格・申請順序を申請時に確認する．",
            "交付申請受付：開始日未確認〜2026-12-28．工事完了・実績報告の期限とは別．"
          ],
          "source_ids": [
            "kansai-02-aomori-02361-self-consumption-pv-2026-source-1",
            "kansai-02-aomori-02361-self-consumption-pv-2026-source-2",
            "kansai-02-aomori-02361-self-consumption-pv-2026-source-3",
            "kansai-02-aomori-02361-self-consumption-pv-2026-source-4",
            "kansai-02-aomori-02361-self-consumption-pv-2026-source-5"
          ],
          "machine_rule": "kansai_municipal_non_adopted",
          "non_adoption_status": "excluded",
          "non_adoption_reason_code": "official_conditions_not_applicable",
          "fit_compatible": false
        }
      ],
      "institutionalSource": "d1883f932be04841cd56ecfa549826b2f8bbddc07dc49850157a7f91b86a8dc5",
      "sections": [
        {
          "label": "太陽光",
          "text": "太陽光の税抜対象経費の実支出額と太陽光の対象出力に1kWあたり5万円を掛けた額のうち，低い額以内です．",
          "supplement": [
            "（算定対象）出力の基準：モジュールとパワーコンディショナーの小さい方",
            "（上限）25万円",
            "（端数処理）1kW未満切り捨て",
            "（端数処理）1,000円未満切り捨て"
          ]
        }
      ],
      "text": "太陽光の税抜対象経費の実支出額と太陽光の対象出力に1kWあたり5万円を掛けた額のうち，低い額以内です．",
      "supplement": [
        "（算定対象）出力の基準：モジュールとパワーコンディショナーの小さい方",
        "（上限）25万円",
        "（端数処理）1kW未満切り捨て",
        "（端数処理）1,000円未満切り捨て"
      ],
      "commonSupplement": [],
      "equipment": "太陽光のみ"
    },
    "aomori-02361-self-consumption-battery-2026": {
      "prefecture": "02",
      "municipality": "02361",
      "recordId": "scheme-0ef6ec25a9a74c95b258952bcacdf2ac",
      "targetYear": "2026",
      "branch": {
        "branch_id": "aomori-02361-self-consumption-battery-2026",
        "diagnostic_rule_ids": [
          "aomori-02361-self-consumption-battery-2026"
        ],
        "target_equipment": [
          "蓄電池"
        ],
        "application_start": [
          {
            "branch_id": "aomori-02361-self-consumption-battery-2026",
            "label": "交付申請",
            "date": ""
          }
        ],
        "application_end": [
          {
            "branch_id": "aomori-02361-self-consumption-battery-2026",
            "label": "交付申請",
            "date": "2026-12-28"
          }
        ],
        "application_status": "受付中",
        "amount": {
          "display_text": "工事費込みの税抜蓄電池対象経費の実支出額の3分の1，蓄電容量に1kWh当たり14.1万円を掛けた額の3分の1，35万円のうち最も低い額以内です．蓄電容量は0.1kWh単位で切り捨て，補助額の千円未満を切り捨てます．1kWh当たり14.1万円は対象経費の上限単価で，補助単価ではありません．",
          "evidence_status": "partial"
        },
        "official_conditions": [],
        "gaps": [],
        "evidence_urls": [
          "https://www.town.fujisaki.lg.jp/index.cfm/7,22655,24,339,html",
          "https://www.town.fujisaki.lg.jp/index.cfm/7,22655,c,html/22655/01_R8_solar_panel_subsidy_manual.pdf",
          "https://www.town.fujisaki.lg.jp/index.cfm/7,22655,c,html/22655/02_solar_panel_subsidy_outline.pdf",
          "https://aomori-taiyoko.pref.aomori.lg.jp/residential/",
          "https://aomori-taiyoko.pref.aomori.lg.jp/residential/status/"
        ],
        "checked_at": "2026-09-27",
        "display_basis": "preparing",
        "migration_status": "pending_review",
        "legacy_municipal_rule_ids": []
      },
      "catalogAmount": {
        "raw_text": "蓄電池原式：税抜対象経費実支出額の1/3，蓄電容量×141,000円/kWhの1/3，350,000円の最小額以内．工事費込み．14.1万円/kWhは補助単価でなく対象経費上限．蓄電容量は小数第2位以下切捨て（0.1kWh単位）．金額は千円未満切捨て．",
        "display_text": "工事費込みの税抜蓄電池対象経費の実支出額の3分の1，蓄電容量に1kWh当たり14.1万円を掛けた額の3分の1，35万円のうち最も低い額以内です．蓄電容量は0.1kWh単位で切り捨て，補助額の千円未満を切り捨てます．1kWh当たり14.1万円は対象経費の上限単価で，補助単価ではありません．",
        "evidence_status": "partial"
      },
      "rules": [
        {
          "id": "aomori-02361-self-consumption-battery-2026",
          "government_level": "municipality",
          "prefecture_code": "02",
          "municipality_code": "02361",
          "program_name": "藤崎町住宅用自家消費型太陽光発電設備等導入支援事業費補助金",
          "housing_ages": [
            "existing",
            "new"
          ],
          "equipment_packages": [
            "solar_plus_standard_battery"
          ],
          "application_status": "accepting",
          "diagnostic_scope": {
            "status": "in_scope",
            "in_scope_housing_ages": [
              "existing",
              "new"
            ],
            "excluded_branch_ids": [],
            "basis": "非FIT・非FIPの新設PV（蓄電池は同時導入）を要する県連携制度のためFIT診断へ非算入．原式・全文根拠・市町固有の期限を保持．補助対象経費の費目，併用禁止範囲，手続・完了期限の逐条統合は添付原文抜粋に残し，独立検収まで検証完了としない．"
          },
          "expense_scopes": [
            "battery"
          ],
          "conflict_program_ids": [],
          "official_urls": [
            "https://www.town.fujisaki.lg.jp/index.cfm/7,22655,24,339,html",
            "https://www.town.fujisaki.lg.jp/index.cfm/7,22655,c,html/22655/01_R8_solar_panel_subsidy_manual.pdf",
            "https://www.town.fujisaki.lg.jp/index.cfm/7,22655,c,html/22655/02_solar_panel_subsidy_outline.pdf",
            "https://aomori-taiyoko.pref.aomori.lg.jp/residential/",
            "https://aomori-taiyoko.pref.aomori.lg.jp/residential/status/"
          ],
          "confirmed_at": "2026-09-27",
          "calculation_assumptions": [
            "本人所有・本人居住の戸建1戸をモデルとして採用．住宅性能の個別条件は対象設備・その他条件に記す．",
            "本人居住の個人を検討対象とし，資料で定める住民登録・税等要件は充足を仮定．他の属性は原文の条件を参照し推測で追加しない．",
            "住宅用自家消費型PV．蓄電池のみの導入は対象外．非FIT・非FIP条件，製品要件及び容量上限は自治体資料及び県共通案内の根拠全文に保存．",
            "原文の着手届，実績報告の相対期限，併用禁止の適用範囲を監査抜粋に保持．",
            "併用不可：国費による同一対象事業への重複助成禁止を含む．自治体ごとの原文範囲は監査抜粋を参照し，併用可へ一括補完しない．\n上限：個別の金額式のとおり．他制度との共通上限は未確認．",
            "本人所有・本人居住の戸建を仮定．公式に住宅所有の限定がない場合は仮定として区別．"
          ],
          "required_confirmations": [
            "非FIT・非FIPの新設PV（蓄電池は同時導入）を要する県連携制度のためFIT診断へ非算入．原式・全文根拠・市町固有の期限を保持．補助対象経費の費目，併用禁止範囲，手続・完了期限の逐条統合は添付原文抜粋に残し，独立検収まで検証完了としない．",
            "最新の受付・予算残高，対象機種・資格・申請順序を申請時に確認する．",
            "交付申請受付：開始日未確認〜2026-12-28．工事完了・実績報告の期限とは別．"
          ],
          "source_ids": [
            "kansai-02-aomori-02361-self-consumption-battery-2026-source-1",
            "kansai-02-aomori-02361-self-consumption-battery-2026-source-2",
            "kansai-02-aomori-02361-self-consumption-battery-2026-source-3",
            "kansai-02-aomori-02361-self-consumption-battery-2026-source-4",
            "kansai-02-aomori-02361-self-consumption-battery-2026-source-5"
          ],
          "machine_rule": "kansai_municipal_non_adopted",
          "non_adoption_status": "excluded",
          "non_adoption_reason_code": "official_conditions_not_applicable",
          "fit_compatible": false
        }
      ],
      "institutionalSource": "8bbc57ae0758b084b1e192051b5dd20d67988def9bc3d242b7553d69605b2b3e",
      "sections": [
        {
          "label": "蓄電池",
          "text": "工事費込みの税抜蓄電池対象経費の実支出額の3分の1と蓄電池の対象容量に1kWhあたり14万1,000円を掛けた額の3分の1のうち，低い額以内です．",
          "supplement": [
            "（上限）35万円",
            "（端数処理）0.1kWh未満切り捨て",
            "（端数処理）1,000円未満切り捨て"
          ]
        }
      ],
      "text": "工事費込みの税抜蓄電池対象経費の実支出額の3分の1と蓄電池の対象容量に1kWhあたり14万1,000円を掛けた額の3分の1のうち，低い額以内です．",
      "supplement": [
        "（上限）35万円",
        "（端数処理）0.1kWh未満切り捨て",
        "（端数処理）1,000円未満切り捨て"
      ],
      "commonSupplement": [],
      "equipment": "蓄電池のみ"
    },
    "aomori-02381-self-consumption-pv-2026": {
      "prefecture": "02",
      "municipality": "02381",
      "recordId": "scheme-da5fef7f43414ddebdbc2900db028f98",
      "targetYear": "2026",
      "branch": {
        "branch_id": "aomori-02381-self-consumption-pv-2026",
        "diagnostic_rule_ids": [
          "aomori-02381-self-consumption-pv-2026"
        ],
        "target_equipment": [
          "太陽光パネル"
        ],
        "application_start": [
          {
            "branch_id": "aomori-02381-self-consumption-pv-2026",
            "label": "交付申請",
            "date": "2026-06-26"
          }
        ],
        "application_end": [
          {
            "branch_id": "aomori-02381-self-consumption-pv-2026",
            "label": "交付申請",
            "date": "2026-12-28"
          }
        ],
        "application_status": "受付中",
        "amount": {
          "display_text": "太陽光の税抜対象経費の実支出額，出力1kW当たり5万円の額，25万円のうち最も低い額以内です．出力はモジュールとパワーコンディショナーの小さい方を整数kWに切り捨てた値です．補助額の千円未満を切り捨てます．",
          "evidence_status": "partial"
        },
        "official_conditions": [],
        "gaps": [],
        "evidence_urls": [
          "https://www.town.itayanagi.aomori.jp/life/refuse/taiyoukouhatuden.html",
          "https://www.town.itayanagi.aomori.jp/life/refuse/files/sinseinotebiki.pdf",
          "https://www.town.itayanagi.aomori.jp/life/refuse/files/hozyokinkouhuyoukou.pdf",
          "https://www.town.itayanagi.aomori.jp/life/refuse/files/youkoubeppyou.pdf",
          "https://aomori-taiyoko.pref.aomori.lg.jp/residential/",
          "https://aomori-taiyoko.pref.aomori.lg.jp/residential/status/"
        ],
        "checked_at": "2026-09-27",
        "display_basis": "preparing",
        "migration_status": "pending_review",
        "legacy_municipal_rule_ids": []
      },
      "catalogAmount": {
        "raw_text": "PV原式：対象経費の実支出額，5万円/kWに応じた額，25万円の最小額以内．税抜対象経費を用いる．出力はモジュールとPCSの小さい値をkW単位で整数切捨て（自治体案内・手引）．金額は千円未満切捨て．",
        "display_text": "太陽光の税抜対象経費の実支出額，出力1kW当たり5万円の額，25万円のうち最も低い額以内です．出力はモジュールとパワーコンディショナーの小さい方を整数kWに切り捨てた値です．補助額の千円未満を切り捨てます．",
        "evidence_status": "partial"
      },
      "rules": [
        {
          "id": "aomori-02381-self-consumption-pv-2026",
          "government_level": "municipality",
          "prefecture_code": "02",
          "municipality_code": "02381",
          "program_name": "板柳町住宅用自家消費型太陽光発電設備等導入支援事業費補助金",
          "housing_ages": [
            "existing",
            "new"
          ],
          "equipment_packages": [
            "solar_only",
            "solar_plus_standard_battery"
          ],
          "application_status": "accepting",
          "diagnostic_scope": {
            "status": "in_scope",
            "in_scope_housing_ages": [
              "existing",
              "new"
            ],
            "excluded_branch_ids": [],
            "basis": "非FIT・非FIPの新設PV（蓄電池は同時導入）を要する県連携制度のためFIT診断へ非算入．原式・全文根拠・市町固有の期限を保持．補助対象経費の費目，併用禁止範囲，手続・完了期限の逐条統合は添付原文抜粋に残し，独立検収まで検証完了としない．"
          },
          "expense_scopes": [
            "solar"
          ],
          "conflict_program_ids": [],
          "official_urls": [
            "https://www.town.itayanagi.aomori.jp/life/refuse/taiyoukouhatuden.html",
            "https://www.town.itayanagi.aomori.jp/life/refuse/files/sinseinotebiki.pdf",
            "https://www.town.itayanagi.aomori.jp/life/refuse/files/hozyokinkouhuyoukou.pdf",
            "https://www.town.itayanagi.aomori.jp/life/refuse/files/youkoubeppyou.pdf",
            "https://aomori-taiyoko.pref.aomori.lg.jp/residential/",
            "https://aomori-taiyoko.pref.aomori.lg.jp/residential/status/"
          ],
          "confirmed_at": "2026-09-27",
          "calculation_assumptions": [
            "本人所有・本人居住の戸建1戸をモデルとして採用．住宅性能の個別条件は対象設備・その他条件に記す．",
            "本人居住の個人を検討対象とし，資料で定める住民登録・税等要件は充足を仮定．他の属性は原文の条件を参照し推測で追加しない．",
            "住宅用自家消費型PV．蓄電池のみの導入は対象外．非FIT・非FIP条件，製品要件及び容量上限は自治体資料及び県共通案内の根拠全文に保存．",
            "原文の着手届，実績報告の相対期限，併用禁止の適用範囲を監査抜粋に保持．",
            "併用不可：国費による同一対象事業への重複助成禁止を含む．自治体ごとの原文範囲は監査抜粋を参照し，併用可へ一括補完しない．\n上限：個別の金額式のとおり．他制度との共通上限は未確認．",
            "本人所有・本人居住の戸建を仮定．公式に住宅所有の限定がない場合は仮定として区別．"
          ],
          "required_confirmations": [
            "非FIT・非FIPの新設PV（蓄電池は同時導入）を要する県連携制度のためFIT診断へ非算入．原式・全文根拠・市町固有の期限を保持．補助対象経費の費目，併用禁止範囲，手続・完了期限の逐条統合は添付原文抜粋に残し，独立検収まで検証完了としない．",
            "最新の受付・予算残高，対象機種・資格・申請順序を申請時に確認する．",
            "交付申請受付：2026-06-26〜2026-12-28．工事完了・実績報告の期限とは別．"
          ],
          "source_ids": [
            "kansai-02-aomori-02381-self-consumption-pv-2026-source-1",
            "kansai-02-aomori-02381-self-consumption-pv-2026-source-2",
            "kansai-02-aomori-02381-self-consumption-pv-2026-source-3",
            "kansai-02-aomori-02381-self-consumption-pv-2026-source-4",
            "kansai-02-aomori-02381-self-consumption-pv-2026-source-5",
            "kansai-02-aomori-02381-self-consumption-pv-2026-source-6"
          ],
          "machine_rule": "kansai_municipal_non_adopted",
          "non_adoption_status": "excluded",
          "non_adoption_reason_code": "official_conditions_not_applicable",
          "fit_compatible": false
        }
      ],
      "institutionalSource": "3c5ccea27d2aa42ca7efbc8e6cfe974bcd1a8105a030595b37e5ba6157d789d5",
      "sections": [
        {
          "label": "太陽光",
          "text": "太陽光の税抜対象経費の実支出額と太陽光の対象出力に1kWあたり5万円を掛けた額のうち，低い額以内です．",
          "supplement": [
            "（算定対象）出力の基準：モジュールとパワーコンディショナーの小さい方",
            "（上限）25万円",
            "（端数処理）1kW未満切り捨て",
            "（端数処理）1,000円未満切り捨て"
          ]
        }
      ],
      "text": "太陽光の税抜対象経費の実支出額と太陽光の対象出力に1kWあたり5万円を掛けた額のうち，低い額以内です．",
      "supplement": [
        "（算定対象）出力の基準：モジュールとパワーコンディショナーの小さい方",
        "（上限）25万円",
        "（端数処理）1kW未満切り捨て",
        "（端数処理）1,000円未満切り捨て"
      ],
      "commonSupplement": [],
      "equipment": "太陽光のみ"
    },
    "aomori-02381-self-consumption-battery-2026": {
      "prefecture": "02",
      "municipality": "02381",
      "recordId": "scheme-da5fef7f43414ddebdbc2900db028f98",
      "targetYear": "2026",
      "branch": {
        "branch_id": "aomori-02381-self-consumption-battery-2026",
        "diagnostic_rule_ids": [
          "aomori-02381-self-consumption-battery-2026"
        ],
        "target_equipment": [
          "蓄電池"
        ],
        "application_start": [
          {
            "branch_id": "aomori-02381-self-consumption-battery-2026",
            "label": "交付申請",
            "date": "2026-06-26"
          }
        ],
        "application_end": [
          {
            "branch_id": "aomori-02381-self-consumption-battery-2026",
            "label": "交付申請",
            "date": "2026-12-28"
          }
        ],
        "application_status": "受付中",
        "amount": {
          "display_text": "工事費込みの税抜蓄電池対象経費の実支出額の3分の1，蓄電容量に1kWh当たり14.1万円を掛けた額の3分の1，35万円のうち最も低い額以内です．蓄電容量は0.1kWh単位で切り捨て，補助額の千円未満を切り捨てます．1kWh当たり14.1万円は対象経費の上限単価で，補助単価ではありません．",
          "evidence_status": "partial"
        },
        "official_conditions": [],
        "gaps": [],
        "evidence_urls": [
          "https://www.town.itayanagi.aomori.jp/life/refuse/taiyoukouhatuden.html",
          "https://www.town.itayanagi.aomori.jp/life/refuse/files/sinseinotebiki.pdf",
          "https://www.town.itayanagi.aomori.jp/life/refuse/files/hozyokinkouhuyoukou.pdf",
          "https://www.town.itayanagi.aomori.jp/life/refuse/files/youkoubeppyou.pdf",
          "https://aomori-taiyoko.pref.aomori.lg.jp/residential/",
          "https://aomori-taiyoko.pref.aomori.lg.jp/residential/status/"
        ],
        "checked_at": "2026-09-27",
        "display_basis": "preparing",
        "migration_status": "pending_review",
        "legacy_municipal_rule_ids": []
      },
      "catalogAmount": {
        "raw_text": "蓄電池原式：税抜対象経費実支出額の1/3，蓄電容量×141,000円/kWhの1/3，350,000円の最小額以内．工事費込み．14.1万円/kWhは補助単価でなく対象経費上限．蓄電容量は小数第2位以下切捨て（0.1kWh単位）．金額は千円未満切捨て．",
        "display_text": "工事費込みの税抜蓄電池対象経費の実支出額の3分の1，蓄電容量に1kWh当たり14.1万円を掛けた額の3分の1，35万円のうち最も低い額以内です．蓄電容量は0.1kWh単位で切り捨て，補助額の千円未満を切り捨てます．1kWh当たり14.1万円は対象経費の上限単価で，補助単価ではありません．",
        "evidence_status": "partial"
      },
      "rules": [
        {
          "id": "aomori-02381-self-consumption-battery-2026",
          "government_level": "municipality",
          "prefecture_code": "02",
          "municipality_code": "02381",
          "program_name": "板柳町住宅用自家消費型太陽光発電設備等導入支援事業費補助金",
          "housing_ages": [
            "existing",
            "new"
          ],
          "equipment_packages": [
            "solar_plus_standard_battery"
          ],
          "application_status": "accepting",
          "diagnostic_scope": {
            "status": "in_scope",
            "in_scope_housing_ages": [
              "existing",
              "new"
            ],
            "excluded_branch_ids": [],
            "basis": "非FIT・非FIPの新設PV（蓄電池は同時導入）を要する県連携制度のためFIT診断へ非算入．原式・全文根拠・市町固有の期限を保持．補助対象経費の費目，併用禁止範囲，手続・完了期限の逐条統合は添付原文抜粋に残し，独立検収まで検証完了としない．"
          },
          "expense_scopes": [
            "battery"
          ],
          "conflict_program_ids": [],
          "official_urls": [
            "https://www.town.itayanagi.aomori.jp/life/refuse/taiyoukouhatuden.html",
            "https://www.town.itayanagi.aomori.jp/life/refuse/files/sinseinotebiki.pdf",
            "https://www.town.itayanagi.aomori.jp/life/refuse/files/hozyokinkouhuyoukou.pdf",
            "https://www.town.itayanagi.aomori.jp/life/refuse/files/youkoubeppyou.pdf",
            "https://aomori-taiyoko.pref.aomori.lg.jp/residential/",
            "https://aomori-taiyoko.pref.aomori.lg.jp/residential/status/"
          ],
          "confirmed_at": "2026-09-27",
          "calculation_assumptions": [
            "本人所有・本人居住の戸建1戸をモデルとして採用．住宅性能の個別条件は対象設備・その他条件に記す．",
            "本人居住の個人を検討対象とし，資料で定める住民登録・税等要件は充足を仮定．他の属性は原文の条件を参照し推測で追加しない．",
            "住宅用自家消費型PV．蓄電池のみの導入は対象外．非FIT・非FIP条件，製品要件及び容量上限は自治体資料及び県共通案内の根拠全文に保存．",
            "原文の着手届，実績報告の相対期限，併用禁止の適用範囲を監査抜粋に保持．",
            "併用不可：国費による同一対象事業への重複助成禁止を含む．自治体ごとの原文範囲は監査抜粋を参照し，併用可へ一括補完しない．\n上限：個別の金額式のとおり．他制度との共通上限は未確認．",
            "本人所有・本人居住の戸建を仮定．公式に住宅所有の限定がない場合は仮定として区別．"
          ],
          "required_confirmations": [
            "非FIT・非FIPの新設PV（蓄電池は同時導入）を要する県連携制度のためFIT診断へ非算入．原式・全文根拠・市町固有の期限を保持．補助対象経費の費目，併用禁止範囲，手続・完了期限の逐条統合は添付原文抜粋に残し，独立検収まで検証完了としない．",
            "最新の受付・予算残高，対象機種・資格・申請順序を申請時に確認する．",
            "交付申請受付：2026-06-26〜2026-12-28．工事完了・実績報告の期限とは別．"
          ],
          "source_ids": [
            "kansai-02-aomori-02381-self-consumption-battery-2026-source-1",
            "kansai-02-aomori-02381-self-consumption-battery-2026-source-2",
            "kansai-02-aomori-02381-self-consumption-battery-2026-source-3",
            "kansai-02-aomori-02381-self-consumption-battery-2026-source-4",
            "kansai-02-aomori-02381-self-consumption-battery-2026-source-5",
            "kansai-02-aomori-02381-self-consumption-battery-2026-source-6"
          ],
          "machine_rule": "kansai_municipal_non_adopted",
          "non_adoption_status": "excluded",
          "non_adoption_reason_code": "official_conditions_not_applicable",
          "fit_compatible": false
        }
      ],
      "institutionalSource": "0292930a0abae9d7b357df464ba81d437e5f6596c737ab54b7d844a6abfa38aa",
      "sections": [
        {
          "label": "蓄電池",
          "text": "工事費込みの税抜蓄電池対象経費の実支出額の3分の1と蓄電池の対象容量に1kWhあたり14万1,000円を掛けた額の3分の1のうち，低い額以内です．",
          "supplement": [
            "（上限）35万円",
            "（端数処理）0.1kWh未満切り捨て",
            "（端数処理）1,000円未満切り捨て"
          ]
        }
      ],
      "text": "工事費込みの税抜蓄電池対象経費の実支出額の3分の1と蓄電池の対象容量に1kWhあたり14万1,000円を掛けた額の3分の1のうち，低い額以内です．",
      "supplement": [
        "（上限）35万円",
        "（端数処理）0.1kWh未満切り捨て",
        "（端数処理）1,000円未満切り捨て"
      ],
      "commonSupplement": [],
      "equipment": "蓄電池のみ"
    },
    "aomori-02384-self-consumption-pv-2026": {
      "prefecture": "02",
      "municipality": "02384",
      "recordId": "scheme-fca78558e92f4c4a8746e95dac23d012",
      "targetYear": "2026",
      "branch": {
        "branch_id": "aomori-02384-self-consumption-pv-2026",
        "diagnostic_rule_ids": [
          "aomori-02384-self-consumption-pv-2026"
        ],
        "target_equipment": [
          "太陽光パネル"
        ],
        "application_start": [
          {
            "branch_id": "aomori-02384-self-consumption-pv-2026",
            "label": "交付申請",
            "date": ""
          }
        ],
        "application_end": [
          {
            "branch_id": "aomori-02384-self-consumption-pv-2026",
            "label": "交付申請",
            "date": "2026-12-28"
          }
        ],
        "application_status": "受付中",
        "amount": {
          "display_text": "太陽光の税抜対象経費の実支出額，出力1kW当たり5万円の額，25万円のうち最も低い額以内です．出力はモジュールとパワーコンディショナーの小さい方を整数kWに切り捨てた値です．補助額の千円未満を切り捨てます．",
          "evidence_status": "partial"
        },
        "official_conditions": [],
        "gaps": [],
        "evidence_urls": [
          "https://www.town.tsuruta.lg.jp/info/post-1342.html",
          "https://www.town.tsuruta.lg.jp/info/document/taiyoko_hojokinyoko1.pdf",
          "https://www.town.tsuruta.lg.jp/info/document/taiyoko_hojokinyoko_beppyo.pdf",
          "https://www.town.tsuruta.lg.jp/info/document/taiyoko_hojokin_tebiki1.pdf",
          "https://aomori-taiyoko.pref.aomori.lg.jp/residential/",
          "https://aomori-taiyoko.pref.aomori.lg.jp/residential/status/"
        ],
        "checked_at": "2026-09-27",
        "display_basis": "preparing",
        "migration_status": "pending_review",
        "legacy_municipal_rule_ids": []
      },
      "catalogAmount": {
        "raw_text": "PV原式：対象経費の実支出額，5万円/kWに応じた額，25万円の最小額以内．税抜対象経費を用いる．出力はモジュールとPCSの小さい値をkW単位で整数切捨て（自治体案内・手引）．金額は千円未満切捨て．",
        "display_text": "太陽光の税抜対象経費の実支出額，出力1kW当たり5万円の額，25万円のうち最も低い額以内です．出力はモジュールとパワーコンディショナーの小さい方を整数kWに切り捨てた値です．補助額の千円未満を切り捨てます．",
        "evidence_status": "partial"
      },
      "rules": [
        {
          "id": "aomori-02384-self-consumption-pv-2026",
          "government_level": "municipality",
          "prefecture_code": "02",
          "municipality_code": "02384",
          "program_name": "鶴田町住宅用自家消費型太陽光発電設備等導入支援事業費補助金",
          "housing_ages": [
            "existing",
            "new"
          ],
          "equipment_packages": [
            "solar_only",
            "solar_plus_standard_battery"
          ],
          "application_status": "accepting",
          "diagnostic_scope": {
            "status": "in_scope",
            "in_scope_housing_ages": [
              "existing",
              "new"
            ],
            "excluded_branch_ids": [],
            "basis": "非FIT・非FIPの新設PV（蓄電池は同時導入）を要する県連携制度のためFIT診断へ非算入．原式・全文根拠・市町固有の期限を保持．補助対象経費の費目，併用禁止範囲，手続・完了期限の逐条統合は添付原文抜粋に残し，独立検収まで検証完了としない．"
          },
          "expense_scopes": [
            "solar"
          ],
          "conflict_program_ids": [],
          "official_urls": [
            "https://www.town.tsuruta.lg.jp/info/post-1342.html",
            "https://www.town.tsuruta.lg.jp/info/document/taiyoko_hojokinyoko1.pdf",
            "https://www.town.tsuruta.lg.jp/info/document/taiyoko_hojokinyoko_beppyo.pdf",
            "https://www.town.tsuruta.lg.jp/info/document/taiyoko_hojokin_tebiki1.pdf",
            "https://aomori-taiyoko.pref.aomori.lg.jp/residential/",
            "https://aomori-taiyoko.pref.aomori.lg.jp/residential/status/"
          ],
          "confirmed_at": "2026-09-27",
          "calculation_assumptions": [
            "本人所有・本人居住の戸建1戸をモデルとして採用．住宅性能の個別条件は対象設備・その他条件に記す．",
            "本人居住の個人を検討対象とし，資料で定める住民登録・税等要件は充足を仮定．他の属性は原文の条件を参照し推測で追加しない．",
            "住宅用自家消費型PV．蓄電池のみの導入は対象外．非FIT・非FIP条件，製品要件及び容量上限は自治体資料及び県共通案内の根拠全文に保存．",
            "原文の着手届，実績報告の相対期限，併用禁止の適用範囲を監査抜粋に保持．",
            "併用不可：国費による同一対象事業への重複助成禁止を含む．自治体ごとの原文範囲は監査抜粋を参照し，併用可へ一括補完しない．\n上限：個別の金額式のとおり．他制度との共通上限は未確認．",
            "本人所有・本人居住の戸建を仮定．公式に住宅所有の限定がない場合は仮定として区別．"
          ],
          "required_confirmations": [
            "非FIT・非FIPの新設PV（蓄電池は同時導入）を要する県連携制度のためFIT診断へ非算入．原式・全文根拠・市町固有の期限を保持．補助対象経費の費目，併用禁止範囲，手続・完了期限の逐条統合は添付原文抜粋に残し，独立検収まで検証完了としない．",
            "最新の受付・予算残高，対象機種・資格・申請順序を申請時に確認する．",
            "交付申請受付：開始日未確認〜2026-12-28．工事完了・実績報告の期限とは別．"
          ],
          "source_ids": [
            "kansai-02-aomori-02384-self-consumption-pv-2026-source-1",
            "kansai-02-aomori-02384-self-consumption-pv-2026-source-2",
            "kansai-02-aomori-02384-self-consumption-pv-2026-source-3",
            "kansai-02-aomori-02384-self-consumption-pv-2026-source-4",
            "kansai-02-aomori-02384-self-consumption-pv-2026-source-5",
            "kansai-02-aomori-02384-self-consumption-pv-2026-source-6"
          ],
          "machine_rule": "kansai_municipal_non_adopted",
          "non_adoption_status": "excluded",
          "non_adoption_reason_code": "official_conditions_not_applicable",
          "fit_compatible": false
        }
      ],
      "institutionalSource": "c52c09d889f63536e9ec86931f5291117130789500afcab15f87a6c8c68a11d9",
      "sections": [
        {
          "label": "太陽光",
          "text": "太陽光の税抜対象経費の実支出額と太陽光の対象出力に1kWあたり5万円を掛けた額のうち，低い額以内です．",
          "supplement": [
            "（算定対象）出力の基準：モジュールとパワーコンディショナーの小さい方",
            "（上限）25万円",
            "（端数処理）1kW未満切り捨て",
            "（端数処理）1,000円未満切り捨て"
          ]
        }
      ],
      "text": "太陽光の税抜対象経費の実支出額と太陽光の対象出力に1kWあたり5万円を掛けた額のうち，低い額以内です．",
      "supplement": [
        "（算定対象）出力の基準：モジュールとパワーコンディショナーの小さい方",
        "（上限）25万円",
        "（端数処理）1kW未満切り捨て",
        "（端数処理）1,000円未満切り捨て"
      ],
      "commonSupplement": [],
      "equipment": "太陽光のみ"
    },
    "aomori-02384-self-consumption-battery-2026": {
      "prefecture": "02",
      "municipality": "02384",
      "recordId": "scheme-fca78558e92f4c4a8746e95dac23d012",
      "targetYear": "2026",
      "branch": {
        "branch_id": "aomori-02384-self-consumption-battery-2026",
        "diagnostic_rule_ids": [
          "aomori-02384-self-consumption-battery-2026"
        ],
        "target_equipment": [
          "蓄電池"
        ],
        "application_start": [
          {
            "branch_id": "aomori-02384-self-consumption-battery-2026",
            "label": "交付申請",
            "date": ""
          }
        ],
        "application_end": [
          {
            "branch_id": "aomori-02384-self-consumption-battery-2026",
            "label": "交付申請",
            "date": "2026-12-28"
          }
        ],
        "application_status": "受付中",
        "amount": {
          "display_text": "工事費込みの税抜蓄電池対象経費の実支出額の3分の1，蓄電容量に1kWh当たり14.1万円を掛けた額の3分の1，35万円のうち最も低い額以内です．蓄電容量は0.1kWh単位で切り捨て，補助額の千円未満を切り捨てます．1kWh当たり14.1万円は対象経費の上限単価で，補助単価ではありません．",
          "evidence_status": "partial"
        },
        "official_conditions": [],
        "gaps": [],
        "evidence_urls": [
          "https://www.town.tsuruta.lg.jp/info/post-1342.html",
          "https://www.town.tsuruta.lg.jp/info/document/taiyoko_hojokinyoko1.pdf",
          "https://www.town.tsuruta.lg.jp/info/document/taiyoko_hojokinyoko_beppyo.pdf",
          "https://www.town.tsuruta.lg.jp/info/document/taiyoko_hojokin_tebiki1.pdf",
          "https://aomori-taiyoko.pref.aomori.lg.jp/residential/",
          "https://aomori-taiyoko.pref.aomori.lg.jp/residential/status/"
        ],
        "checked_at": "2026-09-27",
        "display_basis": "preparing",
        "migration_status": "pending_review",
        "legacy_municipal_rule_ids": []
      },
      "catalogAmount": {
        "raw_text": "蓄電池原式：税抜対象経費実支出額の1/3，蓄電容量×141,000円/kWhの1/3，350,000円の最小額以内．工事費込み．14.1万円/kWhは補助単価でなく対象経費上限．蓄電容量は小数第2位以下切捨て（0.1kWh単位）．金額は千円未満切捨て．",
        "display_text": "工事費込みの税抜蓄電池対象経費の実支出額の3分の1，蓄電容量に1kWh当たり14.1万円を掛けた額の3分の1，35万円のうち最も低い額以内です．蓄電容量は0.1kWh単位で切り捨て，補助額の千円未満を切り捨てます．1kWh当たり14.1万円は対象経費の上限単価で，補助単価ではありません．",
        "evidence_status": "partial"
      },
      "rules": [
        {
          "id": "aomori-02384-self-consumption-battery-2026",
          "government_level": "municipality",
          "prefecture_code": "02",
          "municipality_code": "02384",
          "program_name": "鶴田町住宅用自家消費型太陽光発電設備等導入支援事業費補助金",
          "housing_ages": [
            "existing",
            "new"
          ],
          "equipment_packages": [
            "solar_plus_standard_battery"
          ],
          "application_status": "accepting",
          "diagnostic_scope": {
            "status": "in_scope",
            "in_scope_housing_ages": [
              "existing",
              "new"
            ],
            "excluded_branch_ids": [],
            "basis": "非FIT・非FIPの新設PV（蓄電池は同時導入）を要する県連携制度のためFIT診断へ非算入．原式・全文根拠・市町固有の期限を保持．補助対象経費の費目，併用禁止範囲，手続・完了期限の逐条統合は添付原文抜粋に残し，独立検収まで検証完了としない．"
          },
          "expense_scopes": [
            "battery"
          ],
          "conflict_program_ids": [],
          "official_urls": [
            "https://www.town.tsuruta.lg.jp/info/post-1342.html",
            "https://www.town.tsuruta.lg.jp/info/document/taiyoko_hojokinyoko1.pdf",
            "https://www.town.tsuruta.lg.jp/info/document/taiyoko_hojokinyoko_beppyo.pdf",
            "https://www.town.tsuruta.lg.jp/info/document/taiyoko_hojokin_tebiki1.pdf",
            "https://aomori-taiyoko.pref.aomori.lg.jp/residential/",
            "https://aomori-taiyoko.pref.aomori.lg.jp/residential/status/"
          ],
          "confirmed_at": "2026-09-27",
          "calculation_assumptions": [
            "本人所有・本人居住の戸建1戸をモデルとして採用．住宅性能の個別条件は対象設備・その他条件に記す．",
            "本人居住の個人を検討対象とし，資料で定める住民登録・税等要件は充足を仮定．他の属性は原文の条件を参照し推測で追加しない．",
            "住宅用自家消費型PV．蓄電池のみの導入は対象外．非FIT・非FIP条件，製品要件及び容量上限は自治体資料及び県共通案内の根拠全文に保存．",
            "原文の着手届，実績報告の相対期限，併用禁止の適用範囲を監査抜粋に保持．",
            "併用不可：国費による同一対象事業への重複助成禁止を含む．自治体ごとの原文範囲は監査抜粋を参照し，併用可へ一括補完しない．\n上限：個別の金額式のとおり．他制度との共通上限は未確認．",
            "本人所有・本人居住の戸建を仮定．公式に住宅所有の限定がない場合は仮定として区別．"
          ],
          "required_confirmations": [
            "非FIT・非FIPの新設PV（蓄電池は同時導入）を要する県連携制度のためFIT診断へ非算入．原式・全文根拠・市町固有の期限を保持．補助対象経費の費目，併用禁止範囲，手続・完了期限の逐条統合は添付原文抜粋に残し，独立検収まで検証完了としない．",
            "最新の受付・予算残高，対象機種・資格・申請順序を申請時に確認する．",
            "交付申請受付：開始日未確認〜2026-12-28．工事完了・実績報告の期限とは別．"
          ],
          "source_ids": [
            "kansai-02-aomori-02384-self-consumption-battery-2026-source-1",
            "kansai-02-aomori-02384-self-consumption-battery-2026-source-2",
            "kansai-02-aomori-02384-self-consumption-battery-2026-source-3",
            "kansai-02-aomori-02384-self-consumption-battery-2026-source-4",
            "kansai-02-aomori-02384-self-consumption-battery-2026-source-5",
            "kansai-02-aomori-02384-self-consumption-battery-2026-source-6"
          ],
          "machine_rule": "kansai_municipal_non_adopted",
          "non_adoption_status": "excluded",
          "non_adoption_reason_code": "official_conditions_not_applicable",
          "fit_compatible": false
        }
      ],
      "institutionalSource": "dc9c673915863a83e2d455e21f8aeef72e5c40a7533b45ee9bb2ae76cef9446a",
      "sections": [
        {
          "label": "蓄電池",
          "text": "工事費込みの税抜蓄電池対象経費の実支出額の3分の1と蓄電池の対象容量に1kWhあたり14万1,000円を掛けた額の3分の1のうち，低い額以内です．",
          "supplement": [
            "（上限）35万円",
            "（端数処理）0.1kWh未満切り捨て",
            "（端数処理）1,000円未満切り捨て"
          ]
        }
      ],
      "text": "工事費込みの税抜蓄電池対象経費の実支出額の3分の1と蓄電池の対象容量に1kWhあたり14万1,000円を掛けた額の3分の1のうち，低い額以内です．",
      "supplement": [
        "（上限）35万円",
        "（端数処理）0.1kWh未満切り捨て",
        "（端数処理）1,000円未満切り捨て"
      ],
      "commonSupplement": [],
      "equipment": "蓄電池のみ"
    },
    "aomori-02387-self-consumption-pv-2026": {
      "prefecture": "02",
      "municipality": "02387",
      "recordId": "scheme-94ea30b63b8a435baf9cd8e1ff95bb64",
      "targetYear": "2026",
      "branch": {
        "branch_id": "aomori-02387-self-consumption-pv-2026",
        "diagnostic_rule_ids": [
          "aomori-02387-self-consumption-pv-2026"
        ],
        "target_equipment": [
          "太陽光パネル"
        ],
        "application_start": [
          {
            "branch_id": "aomori-02387-self-consumption-pv-2026",
            "label": "交付申請",
            "date": "2026-06-22"
          }
        ],
        "application_end": [
          {
            "branch_id": "aomori-02387-self-consumption-pv-2026",
            "label": "交付申請",
            "date": "2026-12-28"
          }
        ],
        "application_status": "受付中",
        "amount": {
          "display_text": "太陽光の税抜対象経費の実支出額，出力1kW当たり5万円の額，25万円のうち最も低い額以内です．出力はモジュールとパワーコンディショナーの小さい方を整数kWに切り捨てた値です．補助額の千円未満を切り捨てます．",
          "evidence_status": "partial"
        },
        "official_conditions": [],
        "gaps": [],
        "evidence_urls": [
          "https://www.town.nakadomari.lg.jp/soshikikarasagasu/sogosenryakuka/gyomuannai/tikyuuondankataisaku/5465.html",
          "https://www.town.nakadomari.lg.jp/material/files/group/3/youkoudayo.pdf",
          "https://www.town.nakadomari.lg.jp/material/files/group/3/tebiki.pdf",
          "https://aomori-taiyoko.pref.aomori.lg.jp/residential/",
          "https://aomori-taiyoko.pref.aomori.lg.jp/residential/status/"
        ],
        "checked_at": "2026-09-27",
        "display_basis": "preparing",
        "migration_status": "pending_review",
        "legacy_municipal_rule_ids": []
      },
      "catalogAmount": {
        "raw_text": "PV原式：対象経費の実支出額，5万円/kWに応じた額，25万円の最小額以内．税抜対象経費を用いる．出力はモジュールとPCSの小さい値をkW単位で整数切捨て（自治体案内・手引）．金額は千円未満切捨て．",
        "display_text": "太陽光の税抜対象経費の実支出額，出力1kW当たり5万円の額，25万円のうち最も低い額以内です．出力はモジュールとパワーコンディショナーの小さい方を整数kWに切り捨てた値です．補助額の千円未満を切り捨てます．",
        "evidence_status": "partial"
      },
      "rules": [
        {
          "id": "aomori-02387-self-consumption-pv-2026",
          "government_level": "municipality",
          "prefecture_code": "02",
          "municipality_code": "02387",
          "program_name": "中泊町住宅用自家消費型太陽光発電設備等導入支援事業費補助金",
          "housing_ages": [
            "existing",
            "new"
          ],
          "equipment_packages": [
            "solar_only",
            "solar_plus_standard_battery"
          ],
          "application_status": "accepting",
          "diagnostic_scope": {
            "status": "in_scope",
            "in_scope_housing_ages": [
              "existing",
              "new"
            ],
            "excluded_branch_ids": [],
            "basis": "非FIT・非FIPの新設PV（蓄電池は同時導入）を要する県連携制度のためFIT診断へ非算入．原式・全文根拠・市町固有の期限を保持．補助対象経費の費目，併用禁止範囲，手続・完了期限の逐条統合は添付原文抜粋に残し，独立検収まで検証完了としない．"
          },
          "expense_scopes": [
            "solar"
          ],
          "conflict_program_ids": [],
          "official_urls": [
            "https://www.town.nakadomari.lg.jp/soshikikarasagasu/sogosenryakuka/gyomuannai/tikyuuondankataisaku/5465.html",
            "https://www.town.nakadomari.lg.jp/material/files/group/3/youkoudayo.pdf",
            "https://www.town.nakadomari.lg.jp/material/files/group/3/tebiki.pdf",
            "https://aomori-taiyoko.pref.aomori.lg.jp/residential/",
            "https://aomori-taiyoko.pref.aomori.lg.jp/residential/status/"
          ],
          "confirmed_at": "2026-09-27",
          "calculation_assumptions": [
            "本人所有・本人居住の戸建1戸をモデルとして採用．住宅性能の個別条件は対象設備・その他条件に記す．",
            "本人居住の個人を検討対象とし，資料で定める住民登録・税等要件は充足を仮定．他の属性は原文の条件を参照し推測で追加しない．",
            "住宅用自家消費型PV．蓄電池のみの導入は対象外．非FIT・非FIP条件，製品要件及び容量上限は自治体資料及び県共通案内の根拠全文に保存．",
            "町案内で省略された蓄電池35万円上限を，要綱別表及び申請様式で確認．原文の着手届，実績報告の相対期限，併用禁止の適用範囲を監査抜粋に保持．",
            "併用不可：国費による同一対象事業への重複助成禁止を含む．自治体ごとの原文範囲は監査抜粋を参照し，併用可へ一括補完しない．\n上限：個別の金額式のとおり．他制度との共通上限は未確認．",
            "本人所有・本人居住の戸建を仮定．公式に住宅所有の限定がない場合は仮定として区別．"
          ],
          "required_confirmations": [
            "非FIT・非FIPの新設PV（蓄電池は同時導入）を要する県連携制度のためFIT診断へ非算入．原式・全文根拠・市町固有の期限を保持．補助対象経費の費目，併用禁止範囲，手続・完了期限の逐条統合は添付原文抜粋に残し，独立検収まで検証完了としない．",
            "最新の受付・予算残高，対象機種・資格・申請順序を申請時に確認する．",
            "交付申請受付：2026-06-22〜2026-12-28．工事完了・実績報告の期限とは別．"
          ],
          "source_ids": [
            "kansai-02-aomori-02387-self-consumption-pv-2026-source-1",
            "kansai-02-aomori-02387-self-consumption-pv-2026-source-2",
            "kansai-02-aomori-02387-self-consumption-pv-2026-source-3",
            "kansai-02-aomori-02387-self-consumption-pv-2026-source-4",
            "kansai-02-aomori-02387-self-consumption-pv-2026-source-5"
          ],
          "machine_rule": "kansai_municipal_non_adopted",
          "non_adoption_status": "excluded",
          "non_adoption_reason_code": "official_conditions_not_applicable",
          "fit_compatible": false
        }
      ],
      "institutionalSource": "bd87bfd75c06455fd7a5573d79920abfc6f6312de2b712c581a605f5674d226d",
      "sections": [
        {
          "label": "太陽光",
          "text": "太陽光の税抜対象経費の実支出額と太陽光の対象出力に1kWあたり5万円を掛けた額のうち，低い額以内です．",
          "supplement": [
            "（算定対象）出力の基準：モジュールとパワーコンディショナーの小さい方",
            "（上限）25万円",
            "（端数処理）1kW未満切り捨て",
            "（端数処理）1,000円未満切り捨て"
          ]
        }
      ],
      "text": "太陽光の税抜対象経費の実支出額と太陽光の対象出力に1kWあたり5万円を掛けた額のうち，低い額以内です．",
      "supplement": [
        "（算定対象）出力の基準：モジュールとパワーコンディショナーの小さい方",
        "（上限）25万円",
        "（端数処理）1kW未満切り捨て",
        "（端数処理）1,000円未満切り捨て"
      ],
      "commonSupplement": [],
      "equipment": "太陽光のみ"
    },
    "aomori-02387-self-consumption-battery-2026": {
      "prefecture": "02",
      "municipality": "02387",
      "recordId": "scheme-94ea30b63b8a435baf9cd8e1ff95bb64",
      "targetYear": "2026",
      "branch": {
        "branch_id": "aomori-02387-self-consumption-battery-2026",
        "diagnostic_rule_ids": [
          "aomori-02387-self-consumption-battery-2026"
        ],
        "target_equipment": [
          "蓄電池"
        ],
        "application_start": [
          {
            "branch_id": "aomori-02387-self-consumption-battery-2026",
            "label": "交付申請",
            "date": "2026-06-22"
          }
        ],
        "application_end": [
          {
            "branch_id": "aomori-02387-self-consumption-battery-2026",
            "label": "交付申請",
            "date": "2026-12-28"
          }
        ],
        "application_status": "受付中",
        "amount": {
          "display_text": "工事費込みの税抜蓄電池対象経費の実支出額の3分の1，蓄電容量に1kWh当たり14.1万円を掛けた額の3分の1，35万円のうち最も低い額以内です．蓄電容量は0.1kWh単位で切り捨て，補助額の千円未満を切り捨てます．1kWh当たり14.1万円は対象経費の上限単価で，補助単価ではありません．",
          "evidence_status": "partial"
        },
        "official_conditions": [],
        "gaps": [],
        "evidence_urls": [
          "https://www.town.nakadomari.lg.jp/soshikikarasagasu/sogosenryakuka/gyomuannai/tikyuuondankataisaku/5465.html",
          "https://www.town.nakadomari.lg.jp/material/files/group/3/youkoudayo.pdf",
          "https://www.town.nakadomari.lg.jp/material/files/group/3/tebiki.pdf",
          "https://aomori-taiyoko.pref.aomori.lg.jp/residential/",
          "https://aomori-taiyoko.pref.aomori.lg.jp/residential/status/"
        ],
        "checked_at": "2026-09-27",
        "display_basis": "preparing",
        "migration_status": "pending_review",
        "legacy_municipal_rule_ids": []
      },
      "catalogAmount": {
        "raw_text": "蓄電池原式：税抜対象経費実支出額の1/3，蓄電容量×141,000円/kWhの1/3，350,000円の最小額以内．工事費込み．14.1万円/kWhは補助単価でなく対象経費上限．蓄電容量は小数第2位以下切捨て（0.1kWh単位）．金額は千円未満切捨て．",
        "display_text": "工事費込みの税抜蓄電池対象経費の実支出額の3分の1，蓄電容量に1kWh当たり14.1万円を掛けた額の3分の1，35万円のうち最も低い額以内です．蓄電容量は0.1kWh単位で切り捨て，補助額の千円未満を切り捨てます．1kWh当たり14.1万円は対象経費の上限単価で，補助単価ではありません．",
        "evidence_status": "partial"
      },
      "rules": [
        {
          "id": "aomori-02387-self-consumption-battery-2026",
          "government_level": "municipality",
          "prefecture_code": "02",
          "municipality_code": "02387",
          "program_name": "中泊町住宅用自家消費型太陽光発電設備等導入支援事業費補助金",
          "housing_ages": [
            "existing",
            "new"
          ],
          "equipment_packages": [
            "solar_plus_standard_battery"
          ],
          "application_status": "accepting",
          "diagnostic_scope": {
            "status": "in_scope",
            "in_scope_housing_ages": [
              "existing",
              "new"
            ],
            "excluded_branch_ids": [],
            "basis": "非FIT・非FIPの新設PV（蓄電池は同時導入）を要する県連携制度のためFIT診断へ非算入．原式・全文根拠・市町固有の期限を保持．補助対象経費の費目，併用禁止範囲，手続・完了期限の逐条統合は添付原文抜粋に残し，独立検収まで検証完了としない．"
          },
          "expense_scopes": [
            "battery"
          ],
          "conflict_program_ids": [],
          "official_urls": [
            "https://www.town.nakadomari.lg.jp/soshikikarasagasu/sogosenryakuka/gyomuannai/tikyuuondankataisaku/5465.html",
            "https://www.town.nakadomari.lg.jp/material/files/group/3/youkoudayo.pdf",
            "https://www.town.nakadomari.lg.jp/material/files/group/3/tebiki.pdf",
            "https://aomori-taiyoko.pref.aomori.lg.jp/residential/",
            "https://aomori-taiyoko.pref.aomori.lg.jp/residential/status/"
          ],
          "confirmed_at": "2026-09-27",
          "calculation_assumptions": [
            "本人所有・本人居住の戸建1戸をモデルとして採用．住宅性能の個別条件は対象設備・その他条件に記す．",
            "本人居住の個人を検討対象とし，資料で定める住民登録・税等要件は充足を仮定．他の属性は原文の条件を参照し推測で追加しない．",
            "住宅用自家消費型PV．蓄電池のみの導入は対象外．非FIT・非FIP条件，製品要件及び容量上限は自治体資料及び県共通案内の根拠全文に保存．",
            "町案内で省略された蓄電池35万円上限を，要綱別表及び申請様式で確認．原文の着手届，実績報告の相対期限，併用禁止の適用範囲を監査抜粋に保持．",
            "併用不可：国費による同一対象事業への重複助成禁止を含む．自治体ごとの原文範囲は監査抜粋を参照し，併用可へ一括補完しない．\n上限：個別の金額式のとおり．他制度との共通上限は未確認．",
            "本人所有・本人居住の戸建を仮定．公式に住宅所有の限定がない場合は仮定として区別．"
          ],
          "required_confirmations": [
            "非FIT・非FIPの新設PV（蓄電池は同時導入）を要する県連携制度のためFIT診断へ非算入．原式・全文根拠・市町固有の期限を保持．補助対象経費の費目，併用禁止範囲，手続・完了期限の逐条統合は添付原文抜粋に残し，独立検収まで検証完了としない．",
            "最新の受付・予算残高，対象機種・資格・申請順序を申請時に確認する．",
            "交付申請受付：2026-06-22〜2026-12-28．工事完了・実績報告の期限とは別．"
          ],
          "source_ids": [
            "kansai-02-aomori-02387-self-consumption-battery-2026-source-1",
            "kansai-02-aomori-02387-self-consumption-battery-2026-source-2",
            "kansai-02-aomori-02387-self-consumption-battery-2026-source-3",
            "kansai-02-aomori-02387-self-consumption-battery-2026-source-4",
            "kansai-02-aomori-02387-self-consumption-battery-2026-source-5"
          ],
          "machine_rule": "kansai_municipal_non_adopted",
          "non_adoption_status": "excluded",
          "non_adoption_reason_code": "official_conditions_not_applicable",
          "fit_compatible": false
        }
      ],
      "institutionalSource": "8f4eef11dcbbaa5f1fac5863377fab280bf393e0df4ea4b887a058674d01b747",
      "sections": [
        {
          "label": "蓄電池",
          "text": "工事費込みの税抜蓄電池対象経費の実支出額の3分の1と蓄電池の対象容量に1kWhあたり14万1,000円を掛けた額の3分の1のうち，低い額以内です．",
          "supplement": [
            "（上限）35万円",
            "（端数処理）0.1kWh未満切り捨て",
            "（端数処理）1,000円未満切り捨て"
          ]
        }
      ],
      "text": "工事費込みの税抜蓄電池対象経費の実支出額の3分の1と蓄電池の対象容量に1kWhあたり14万1,000円を掛けた額の3分の1のうち，低い額以内です．",
      "supplement": [
        "（上限）35万円",
        "（端数処理）0.1kWh未満切り捨て",
        "（端数処理）1,000円未満切り捨て"
      ],
      "commonSupplement": [],
      "equipment": "蓄電池のみ"
    },
    "aomori-02402-self-consumption-pv-2026": {
      "prefecture": "02",
      "municipality": "02402",
      "recordId": "scheme-d1f8450a6e144e858a7cac6e50f628be",
      "targetYear": "2026",
      "branch": {
        "branch_id": "aomori-02402-self-consumption-pv-2026",
        "diagnostic_rule_ids": [
          "aomori-02402-self-consumption-pv-2026"
        ],
        "target_equipment": [
          "太陽光パネル"
        ],
        "application_start": [
          {
            "branch_id": "aomori-02402-self-consumption-pv-2026",
            "label": "交付申請",
            "date": ""
          }
        ],
        "application_end": [
          {
            "branch_id": "aomori-02402-self-consumption-pv-2026",
            "label": "交付申請",
            "date": "2026-12-28"
          }
        ],
        "application_status": "受付中",
        "amount": {
          "display_text": "太陽光の税抜対象経費の実支出額，出力1kW当たり5万円の額，25万円のうち最も低い額以内です．出力はモジュールとパワーコンディショナーの小さい方を整数kWに切り捨てた値です．補助額の千円未満を切り捨てます．",
          "evidence_status": "partial"
        },
        "official_conditions": [],
        "gaps": [],
        "evidence_urls": [
          "https://www.town.shichinohe.lg.jp/kurashi/kankyou/jyosei/post-578.html",
          "https://www.town.shichinohe.lg.jp/kurashi/fb188c4b335edf85b975d87fd73de32a.pdf",
          "https://www.town.shichinohe.lg.jp/kurashi/57354f45bab3ec5b3d0da2e7d2809ce7.pdf",
          "https://www.town.shichinohe.lg.jp/kurashi/05e4968e75083c077c5ef861bdfc8cc5.pdf",
          "https://aomori-taiyoko.pref.aomori.lg.jp/residential/",
          "https://aomori-taiyoko.pref.aomori.lg.jp/residential/status/"
        ],
        "checked_at": "2026-09-27",
        "display_basis": "preparing",
        "migration_status": "pending_review",
        "legacy_municipal_rule_ids": []
      },
      "catalogAmount": {
        "raw_text": "PV原式：対象経費の実支出額，5万円/kWに応じた額，25万円の最小額以内．税抜対象経費を用いる．出力はモジュールとPCSの小さい値をkW単位で整数切捨て（自治体案内・手引）．金額は千円未満切捨て．",
        "display_text": "太陽光の税抜対象経費の実支出額，出力1kW当たり5万円の額，25万円のうち最も低い額以内です．出力はモジュールとパワーコンディショナーの小さい方を整数kWに切り捨てた値です．補助額の千円未満を切り捨てます．",
        "evidence_status": "partial"
      },
      "rules": [
        {
          "id": "aomori-02402-self-consumption-pv-2026",
          "government_level": "municipality",
          "prefecture_code": "02",
          "municipality_code": "02402",
          "program_name": "七戸町住宅用自家消費型太陽光発電設備等導入支援事業費補助金",
          "housing_ages": [
            "existing",
            "new"
          ],
          "equipment_packages": [
            "solar_only",
            "solar_plus_standard_battery"
          ],
          "application_status": "accepting",
          "diagnostic_scope": {
            "status": "in_scope",
            "in_scope_housing_ages": [
              "existing",
              "new"
            ],
            "excluded_branch_ids": [],
            "basis": "非FIT・非FIPの新設PV（蓄電池は同時導入）を要する県連携制度のためFIT診断へ非算入．原式・全文根拠・市町固有の期限を保持．補助対象経費の費目，併用禁止範囲，手続・完了期限の逐条統合は添付原文抜粋に残し，独立検収まで検証完了としない．"
          },
          "expense_scopes": [
            "solar"
          ],
          "conflict_program_ids": [],
          "official_urls": [
            "https://www.town.shichinohe.lg.jp/kurashi/kankyou/jyosei/post-578.html",
            "https://www.town.shichinohe.lg.jp/kurashi/fb188c4b335edf85b975d87fd73de32a.pdf",
            "https://www.town.shichinohe.lg.jp/kurashi/57354f45bab3ec5b3d0da2e7d2809ce7.pdf",
            "https://www.town.shichinohe.lg.jp/kurashi/05e4968e75083c077c5ef861bdfc8cc5.pdf",
            "https://aomori-taiyoko.pref.aomori.lg.jp/residential/",
            "https://aomori-taiyoko.pref.aomori.lg.jp/residential/status/"
          ],
          "confirmed_at": "2026-09-27",
          "calculation_assumptions": [
            "本人所有・本人居住の戸建1戸をモデルとして採用．住宅性能の個別条件は対象設備・その他条件に記す．",
            "本人居住の個人を検討対象とし，資料で定める住民登録・税等要件は充足を仮定．他の属性は原文の条件を参照し推測で追加しない．",
            "住宅用自家消費型PV．蓄電池のみの導入は対象外．非FIT・非FIP条件，製品要件及び容量上限は自治体資料及び県共通案内の根拠全文に保存．",
            "原文の着手届，実績報告の相対期限，併用禁止の適用範囲を監査抜粋に保持．",
            "併用不可：国費による同一対象事業への重複助成禁止を含む．自治体ごとの原文範囲は監査抜粋を参照し，併用可へ一括補完しない．\n上限：個別の金額式のとおり．他制度との共通上限は未確認．",
            "本人所有・本人居住の戸建を仮定．公式に住宅所有の限定がない場合は仮定として区別．"
          ],
          "required_confirmations": [
            "非FIT・非FIPの新設PV（蓄電池は同時導入）を要する県連携制度のためFIT診断へ非算入．原式・全文根拠・市町固有の期限を保持．補助対象経費の費目，併用禁止範囲，手続・完了期限の逐条統合は添付原文抜粋に残し，独立検収まで検証完了としない．",
            "最新の受付・予算残高，対象機種・資格・申請順序を申請時に確認する．",
            "交付申請受付：開始日未確認〜2026-12-28．工事完了・実績報告の期限とは別．"
          ],
          "source_ids": [
            "kansai-02-aomori-02402-self-consumption-pv-2026-source-1",
            "kansai-02-aomori-02402-self-consumption-pv-2026-source-2",
            "kansai-02-aomori-02402-self-consumption-pv-2026-source-3",
            "kansai-02-aomori-02402-self-consumption-pv-2026-source-4",
            "kansai-02-aomori-02402-self-consumption-pv-2026-source-5",
            "kansai-02-aomori-02402-self-consumption-pv-2026-source-6"
          ],
          "machine_rule": "kansai_municipal_non_adopted",
          "non_adoption_status": "excluded",
          "non_adoption_reason_code": "official_conditions_not_applicable",
          "fit_compatible": false
        }
      ],
      "institutionalSource": "77a1d5da11fe64eeea368e0647792acf936c156d639edc9a5ad26ea7b45387b8",
      "sections": [
        {
          "label": "太陽光",
          "text": "太陽光の税抜対象経費の実支出額と太陽光の対象出力に1kWあたり5万円を掛けた額のうち，低い額以内です．",
          "supplement": [
            "（算定対象）出力の基準：モジュールとパワーコンディショナーの小さい方",
            "（上限）25万円",
            "（端数処理）1kW未満切り捨て",
            "（端数処理）1,000円未満切り捨て"
          ]
        }
      ],
      "text": "太陽光の税抜対象経費の実支出額と太陽光の対象出力に1kWあたり5万円を掛けた額のうち，低い額以内です．",
      "supplement": [
        "（算定対象）出力の基準：モジュールとパワーコンディショナーの小さい方",
        "（上限）25万円",
        "（端数処理）1kW未満切り捨て",
        "（端数処理）1,000円未満切り捨て"
      ],
      "commonSupplement": [],
      "equipment": "太陽光のみ"
    },
    "aomori-02402-self-consumption-battery-2026": {
      "prefecture": "02",
      "municipality": "02402",
      "recordId": "scheme-d1f8450a6e144e858a7cac6e50f628be",
      "targetYear": "2026",
      "branch": {
        "branch_id": "aomori-02402-self-consumption-battery-2026",
        "diagnostic_rule_ids": [
          "aomori-02402-self-consumption-battery-2026"
        ],
        "target_equipment": [
          "蓄電池"
        ],
        "application_start": [
          {
            "branch_id": "aomori-02402-self-consumption-battery-2026",
            "label": "交付申請",
            "date": ""
          }
        ],
        "application_end": [
          {
            "branch_id": "aomori-02402-self-consumption-battery-2026",
            "label": "交付申請",
            "date": "2026-12-28"
          }
        ],
        "application_status": "受付中",
        "amount": {
          "display_text": "工事費込みの税抜蓄電池対象経費の実支出額の3分の1，蓄電容量に1kWh当たり14.1万円を掛けた額の3分の1，35万円のうち最も低い額以内です．蓄電容量は0.1kWh単位で切り捨て，補助額の千円未満を切り捨てます．1kWh当たり14.1万円は対象経費の上限単価で，補助単価ではありません．",
          "evidence_status": "partial"
        },
        "official_conditions": [],
        "gaps": [],
        "evidence_urls": [
          "https://www.town.shichinohe.lg.jp/kurashi/kankyou/jyosei/post-578.html",
          "https://www.town.shichinohe.lg.jp/kurashi/fb188c4b335edf85b975d87fd73de32a.pdf",
          "https://www.town.shichinohe.lg.jp/kurashi/57354f45bab3ec5b3d0da2e7d2809ce7.pdf",
          "https://www.town.shichinohe.lg.jp/kurashi/05e4968e75083c077c5ef861bdfc8cc5.pdf",
          "https://aomori-taiyoko.pref.aomori.lg.jp/residential/",
          "https://aomori-taiyoko.pref.aomori.lg.jp/residential/status/"
        ],
        "checked_at": "2026-09-27",
        "display_basis": "preparing",
        "migration_status": "pending_review",
        "legacy_municipal_rule_ids": []
      },
      "catalogAmount": {
        "raw_text": "蓄電池原式：税抜対象経費実支出額の1/3，蓄電容量×141,000円/kWhの1/3，350,000円の最小額以内．工事費込み．14.1万円/kWhは補助単価でなく対象経費上限．蓄電容量は小数第2位以下切捨て（0.1kWh単位）．金額は千円未満切捨て．",
        "display_text": "工事費込みの税抜蓄電池対象経費の実支出額の3分の1，蓄電容量に1kWh当たり14.1万円を掛けた額の3分の1，35万円のうち最も低い額以内です．蓄電容量は0.1kWh単位で切り捨て，補助額の千円未満を切り捨てます．1kWh当たり14.1万円は対象経費の上限単価で，補助単価ではありません．",
        "evidence_status": "partial"
      },
      "rules": [
        {
          "id": "aomori-02402-self-consumption-battery-2026",
          "government_level": "municipality",
          "prefecture_code": "02",
          "municipality_code": "02402",
          "program_name": "七戸町住宅用自家消費型太陽光発電設備等導入支援事業費補助金",
          "housing_ages": [
            "existing",
            "new"
          ],
          "equipment_packages": [
            "solar_plus_standard_battery"
          ],
          "application_status": "accepting",
          "diagnostic_scope": {
            "status": "in_scope",
            "in_scope_housing_ages": [
              "existing",
              "new"
            ],
            "excluded_branch_ids": [],
            "basis": "非FIT・非FIPの新設PV（蓄電池は同時導入）を要する県連携制度のためFIT診断へ非算入．原式・全文根拠・市町固有の期限を保持．補助対象経費の費目，併用禁止範囲，手続・完了期限の逐条統合は添付原文抜粋に残し，独立検収まで検証完了としない．"
          },
          "expense_scopes": [
            "battery"
          ],
          "conflict_program_ids": [],
          "official_urls": [
            "https://www.town.shichinohe.lg.jp/kurashi/kankyou/jyosei/post-578.html",
            "https://www.town.shichinohe.lg.jp/kurashi/fb188c4b335edf85b975d87fd73de32a.pdf",
            "https://www.town.shichinohe.lg.jp/kurashi/57354f45bab3ec5b3d0da2e7d2809ce7.pdf",
            "https://www.town.shichinohe.lg.jp/kurashi/05e4968e75083c077c5ef861bdfc8cc5.pdf",
            "https://aomori-taiyoko.pref.aomori.lg.jp/residential/",
            "https://aomori-taiyoko.pref.aomori.lg.jp/residential/status/"
          ],
          "confirmed_at": "2026-09-27",
          "calculation_assumptions": [
            "本人所有・本人居住の戸建1戸をモデルとして採用．住宅性能の個別条件は対象設備・その他条件に記す．",
            "本人居住の個人を検討対象とし，資料で定める住民登録・税等要件は充足を仮定．他の属性は原文の条件を参照し推測で追加しない．",
            "住宅用自家消費型PV．蓄電池のみの導入は対象外．非FIT・非FIP条件，製品要件及び容量上限は自治体資料及び県共通案内の根拠全文に保存．",
            "原文の着手届，実績報告の相対期限，併用禁止の適用範囲を監査抜粋に保持．",
            "併用不可：国費による同一対象事業への重複助成禁止を含む．自治体ごとの原文範囲は監査抜粋を参照し，併用可へ一括補完しない．\n上限：個別の金額式のとおり．他制度との共通上限は未確認．",
            "本人所有・本人居住の戸建を仮定．公式に住宅所有の限定がない場合は仮定として区別．"
          ],
          "required_confirmations": [
            "非FIT・非FIPの新設PV（蓄電池は同時導入）を要する県連携制度のためFIT診断へ非算入．原式・全文根拠・市町固有の期限を保持．補助対象経費の費目，併用禁止範囲，手続・完了期限の逐条統合は添付原文抜粋に残し，独立検収まで検証完了としない．",
            "最新の受付・予算残高，対象機種・資格・申請順序を申請時に確認する．",
            "交付申請受付：開始日未確認〜2026-12-28．工事完了・実績報告の期限とは別．"
          ],
          "source_ids": [
            "kansai-02-aomori-02402-self-consumption-battery-2026-source-1",
            "kansai-02-aomori-02402-self-consumption-battery-2026-source-2",
            "kansai-02-aomori-02402-self-consumption-battery-2026-source-3",
            "kansai-02-aomori-02402-self-consumption-battery-2026-source-4",
            "kansai-02-aomori-02402-self-consumption-battery-2026-source-5",
            "kansai-02-aomori-02402-self-consumption-battery-2026-source-6"
          ],
          "machine_rule": "kansai_municipal_non_adopted",
          "non_adoption_status": "excluded",
          "non_adoption_reason_code": "official_conditions_not_applicable",
          "fit_compatible": false
        }
      ],
      "institutionalSource": "980297b0020960ad1bb693c6d30ab9681e6c545891109a4e121dab93a229edfc",
      "sections": [
        {
          "label": "蓄電池",
          "text": "工事費込みの税抜蓄電池対象経費の実支出額の3分の1と蓄電池の対象容量に1kWhあたり14万1,000円を掛けた額の3分の1のうち，低い額以内です．",
          "supplement": [
            "（上限）35万円",
            "（端数処理）0.1kWh未満切り捨て",
            "（端数処理）1,000円未満切り捨て"
          ]
        }
      ],
      "text": "工事費込みの税抜蓄電池対象経費の実支出額の3分の1と蓄電池の対象容量に1kWhあたり14万1,000円を掛けた額の3分の1のうち，低い額以内です．",
      "supplement": [
        "（上限）35万円",
        "（端数処理）0.1kWh未満切り捨て",
        "（端数処理）1,000円未満切り捨て"
      ],
      "commonSupplement": [],
      "equipment": "蓄電池のみ"
    },
    "aomori-02405-self-consumption-pv-2026": {
      "prefecture": "02",
      "municipality": "02405",
      "recordId": "scheme-7e588ad5dfe0460fac91d5adc431082f",
      "targetYear": "2026",
      "branch": {
        "branch_id": "aomori-02405-self-consumption-pv-2026",
        "diagnostic_rule_ids": [
          "aomori-02405-self-consumption-pv-2026"
        ],
        "target_equipment": [
          "太陽光パネル"
        ],
        "application_start": [
          {
            "branch_id": "aomori-02405-self-consumption-pv-2026",
            "label": "交付申請",
            "date": "2026-07-15"
          }
        ],
        "application_end": [
          {
            "branch_id": "aomori-02405-self-consumption-pv-2026",
            "label": "交付申請",
            "date": "2026-12-28"
          }
        ],
        "application_status": "受付対象外",
        "amount": {
          "display_text": "太陽光の税抜対象経費の実支出額，出力1kW当たり5万円の額，25万円のうち最も低い額以内です．出力はモジュールとパワーコンディショナーの小さい方を整数kWに切り捨てた値です．補助額の千円未満を切り捨てます．",
          "evidence_status": "partial"
        },
        "official_conditions": [],
        "gaps": [],
        "evidence_urls": [
          "https://www.town.rokunohe.aomori.jp/docs/2026070900017/",
          "https://www.town.rokunohe.aomori.jp/docs/2026070900017/file_contents/1.pdf",
          "https://www.town.rokunohe.aomori.jp/docs/2026070900017/file_contents/2.pdf",
          "https://www.town.rokunohe.aomori.jp/docs/2026070900017/file_contents/3.pdf",
          "https://aomori-taiyoko.pref.aomori.lg.jp/residential/",
          "https://aomori-taiyoko.pref.aomori.lg.jp/residential/status/"
        ],
        "checked_at": "2026-09-27",
        "display_basis": "preparing",
        "migration_status": "pending_review",
        "legacy_municipal_rule_ids": []
      },
      "catalogAmount": {
        "raw_text": "PV原式：対象経費の実支出額，5万円/kWに応じた額，25万円の最小額以内．税抜対象経費を用いる．出力はモジュールとPCSの小さい値をkW単位で整数切捨て（自治体案内・手引）．金額は千円未満切捨て．",
        "display_text": "太陽光の税抜対象経費の実支出額，出力1kW当たり5万円の額，25万円のうち最も低い額以内です．出力はモジュールとパワーコンディショナーの小さい方を整数kWに切り捨てた値です．補助額の千円未満を切り捨てます．",
        "evidence_status": "partial"
      },
      "rules": [
        {
          "id": "aomori-02405-self-consumption-pv-2026",
          "government_level": "municipality",
          "prefecture_code": "02",
          "municipality_code": "02405",
          "program_name": "六戸町住宅用自家消費型太陽光発電設備等導入支援事業費補助金",
          "housing_ages": [
            "existing",
            "new"
          ],
          "equipment_packages": [
            "solar_only",
            "solar_plus_standard_battery"
          ],
          "application_status": "closed",
          "diagnostic_scope": {
            "status": "in_scope",
            "in_scope_housing_ages": [
              "existing",
              "new"
            ],
            "excluded_branch_ids": [],
            "basis": "非FIT・非FIPの新設PV（蓄電池は同時導入）を要する県連携制度のためFIT診断へ非算入．原式・全文根拠・市町固有の期限を保持．補助対象経費の費目，併用禁止範囲，手続・完了期限の逐条統合は添付原文抜粋に残し，独立検収まで検証完了としない．公式案内が受付終了を明示．予定締切12/28を受付継続の根拠にしない．"
          },
          "expense_scopes": [
            "solar"
          ],
          "conflict_program_ids": [],
          "official_urls": [
            "https://www.town.rokunohe.aomori.jp/docs/2026070900017/",
            "https://www.town.rokunohe.aomori.jp/docs/2026070900017/file_contents/1.pdf",
            "https://www.town.rokunohe.aomori.jp/docs/2026070900017/file_contents/2.pdf",
            "https://www.town.rokunohe.aomori.jp/docs/2026070900017/file_contents/3.pdf",
            "https://aomori-taiyoko.pref.aomori.lg.jp/residential/",
            "https://aomori-taiyoko.pref.aomori.lg.jp/residential/status/"
          ],
          "confirmed_at": "2026-09-27",
          "calculation_assumptions": [
            "本人所有・本人居住の戸建1戸をモデルとして採用．住宅性能の個別条件は対象設備・その他条件に記す．",
            "本人居住の個人を検討対象とし，資料で定める住民登録・税等要件は充足を仮定．他の属性は原文の条件を参照し推測で追加しない．",
            "住宅用自家消費型PV．蓄電池のみの導入は対象外．非FIT・非FIP条件，製品要件及び容量上限は自治体資料及び県共通案内の根拠全文に保存．",
            "原文の着手届，実績報告の相対期限，併用禁止の適用範囲を監査抜粋に保持．",
            "併用不可：国費による同一対象事業への重複助成禁止を含む．自治体ごとの原文範囲は監査抜粋を参照し，併用可へ一括補完しない．\n上限：個別の金額式のとおり．他制度との共通上限は未確認．",
            "本人所有・本人居住の戸建を仮定．公式に住宅所有の限定がない場合は仮定として区別．"
          ],
          "required_confirmations": [
            "非FIT・非FIPの新設PV（蓄電池は同時導入）を要する県連携制度のためFIT診断へ非算入．原式・全文根拠・市町固有の期限を保持．補助対象経費の費目，併用禁止範囲，手続・完了期限の逐条統合は添付原文抜粋に残し，独立検収まで検証完了としない．公式案内が受付終了を明示．予定締切12/28を受付継続の根拠にしない．",
            "最新の受付・予算残高，対象機種・資格・申請順序を申請時に確認する．",
            "交付申請受付：2026-07-15〜2026-12-28．工事完了・実績報告の期限とは別．"
          ],
          "source_ids": [
            "kansai-02-aomori-02405-self-consumption-pv-2026-source-1",
            "kansai-02-aomori-02405-self-consumption-pv-2026-source-2",
            "kansai-02-aomori-02405-self-consumption-pv-2026-source-3",
            "kansai-02-aomori-02405-self-consumption-pv-2026-source-4",
            "kansai-02-aomori-02405-self-consumption-pv-2026-source-5",
            "kansai-02-aomori-02405-self-consumption-pv-2026-source-6"
          ],
          "machine_rule": "kansai_municipal_non_adopted",
          "non_adoption_status": "excluded",
          "non_adoption_reason_code": "official_conditions_not_applicable",
          "fit_compatible": false
        }
      ],
      "institutionalSource": "118572ad196a11ff7a5d5f23a3c86fbc766f5b962fa04c246ed167109b30a9ae",
      "sections": [
        {
          "label": "太陽光",
          "text": "太陽光の税抜対象経費の実支出額と太陽光の対象出力に1kWあたり5万円を掛けた額のうち，低い額以内です．",
          "supplement": [
            "（算定対象）出力の基準：モジュールとパワーコンディショナーの小さい方",
            "（上限）25万円",
            "（端数処理）1kW未満切り捨て",
            "（端数処理）1,000円未満切り捨て"
          ]
        }
      ],
      "text": "太陽光の税抜対象経費の実支出額と太陽光の対象出力に1kWあたり5万円を掛けた額のうち，低い額以内です．",
      "supplement": [
        "（算定対象）出力の基準：モジュールとパワーコンディショナーの小さい方",
        "（上限）25万円",
        "（端数処理）1kW未満切り捨て",
        "（端数処理）1,000円未満切り捨て"
      ],
      "commonSupplement": [],
      "equipment": "太陽光のみ"
    },
    "aomori-02405-self-consumption-battery-2026": {
      "prefecture": "02",
      "municipality": "02405",
      "recordId": "scheme-7e588ad5dfe0460fac91d5adc431082f",
      "targetYear": "2026",
      "branch": {
        "branch_id": "aomori-02405-self-consumption-battery-2026",
        "diagnostic_rule_ids": [
          "aomori-02405-self-consumption-battery-2026"
        ],
        "target_equipment": [
          "蓄電池"
        ],
        "application_start": [
          {
            "branch_id": "aomori-02405-self-consumption-battery-2026",
            "label": "交付申請",
            "date": "2026-07-15"
          }
        ],
        "application_end": [
          {
            "branch_id": "aomori-02405-self-consumption-battery-2026",
            "label": "交付申請",
            "date": "2026-12-28"
          }
        ],
        "application_status": "受付対象外",
        "amount": {
          "display_text": "工事費込みの税抜蓄電池対象経費の実支出額の3分の1，蓄電容量に1kWh当たり14.1万円を掛けた額の3分の1，35万円のうち最も低い額以内です．蓄電容量は0.1kWh単位で切り捨て，補助額の千円未満を切り捨てます．1kWh当たり14.1万円は対象経費の上限単価で，補助単価ではありません．",
          "evidence_status": "partial"
        },
        "official_conditions": [],
        "gaps": [],
        "evidence_urls": [
          "https://www.town.rokunohe.aomori.jp/docs/2026070900017/",
          "https://www.town.rokunohe.aomori.jp/docs/2026070900017/file_contents/1.pdf",
          "https://www.town.rokunohe.aomori.jp/docs/2026070900017/file_contents/2.pdf",
          "https://www.town.rokunohe.aomori.jp/docs/2026070900017/file_contents/3.pdf",
          "https://aomori-taiyoko.pref.aomori.lg.jp/residential/",
          "https://aomori-taiyoko.pref.aomori.lg.jp/residential/status/"
        ],
        "checked_at": "2026-09-27",
        "display_basis": "preparing",
        "migration_status": "pending_review",
        "legacy_municipal_rule_ids": []
      },
      "catalogAmount": {
        "raw_text": "蓄電池原式：税抜対象経費実支出額の1/3，蓄電容量×141,000円/kWhの1/3，350,000円の最小額以内．工事費込み．14.1万円/kWhは補助単価でなく対象経費上限．蓄電容量は小数第2位以下切捨て（0.1kWh単位）．金額は千円未満切捨て．",
        "display_text": "工事費込みの税抜蓄電池対象経費の実支出額の3分の1，蓄電容量に1kWh当たり14.1万円を掛けた額の3分の1，35万円のうち最も低い額以内です．蓄電容量は0.1kWh単位で切り捨て，補助額の千円未満を切り捨てます．1kWh当たり14.1万円は対象経費の上限単価で，補助単価ではありません．",
        "evidence_status": "partial"
      },
      "rules": [
        {
          "id": "aomori-02405-self-consumption-battery-2026",
          "government_level": "municipality",
          "prefecture_code": "02",
          "municipality_code": "02405",
          "program_name": "六戸町住宅用自家消費型太陽光発電設備等導入支援事業費補助金",
          "housing_ages": [
            "existing",
            "new"
          ],
          "equipment_packages": [
            "solar_plus_standard_battery"
          ],
          "application_status": "closed",
          "diagnostic_scope": {
            "status": "in_scope",
            "in_scope_housing_ages": [
              "existing",
              "new"
            ],
            "excluded_branch_ids": [],
            "basis": "非FIT・非FIPの新設PV（蓄電池は同時導入）を要する県連携制度のためFIT診断へ非算入．原式・全文根拠・市町固有の期限を保持．補助対象経費の費目，併用禁止範囲，手続・完了期限の逐条統合は添付原文抜粋に残し，独立検収まで検証完了としない．公式案内が受付終了を明示．予定締切12/28を受付継続の根拠にしない．"
          },
          "expense_scopes": [
            "battery"
          ],
          "conflict_program_ids": [],
          "official_urls": [
            "https://www.town.rokunohe.aomori.jp/docs/2026070900017/",
            "https://www.town.rokunohe.aomori.jp/docs/2026070900017/file_contents/1.pdf",
            "https://www.town.rokunohe.aomori.jp/docs/2026070900017/file_contents/2.pdf",
            "https://www.town.rokunohe.aomori.jp/docs/2026070900017/file_contents/3.pdf",
            "https://aomori-taiyoko.pref.aomori.lg.jp/residential/",
            "https://aomori-taiyoko.pref.aomori.lg.jp/residential/status/"
          ],
          "confirmed_at": "2026-09-27",
          "calculation_assumptions": [
            "本人所有・本人居住の戸建1戸をモデルとして採用．住宅性能の個別条件は対象設備・その他条件に記す．",
            "本人居住の個人を検討対象とし，資料で定める住民登録・税等要件は充足を仮定．他の属性は原文の条件を参照し推測で追加しない．",
            "住宅用自家消費型PV．蓄電池のみの導入は対象外．非FIT・非FIP条件，製品要件及び容量上限は自治体資料及び県共通案内の根拠全文に保存．",
            "原文の着手届，実績報告の相対期限，併用禁止の適用範囲を監査抜粋に保持．",
            "併用不可：国費による同一対象事業への重複助成禁止を含む．自治体ごとの原文範囲は監査抜粋を参照し，併用可へ一括補完しない．\n上限：個別の金額式のとおり．他制度との共通上限は未確認．",
            "本人所有・本人居住の戸建を仮定．公式に住宅所有の限定がない場合は仮定として区別．"
          ],
          "required_confirmations": [
            "非FIT・非FIPの新設PV（蓄電池は同時導入）を要する県連携制度のためFIT診断へ非算入．原式・全文根拠・市町固有の期限を保持．補助対象経費の費目，併用禁止範囲，手続・完了期限の逐条統合は添付原文抜粋に残し，独立検収まで検証完了としない．公式案内が受付終了を明示．予定締切12/28を受付継続の根拠にしない．",
            "最新の受付・予算残高，対象機種・資格・申請順序を申請時に確認する．",
            "交付申請受付：2026-07-15〜2026-12-28．工事完了・実績報告の期限とは別．"
          ],
          "source_ids": [
            "kansai-02-aomori-02405-self-consumption-battery-2026-source-1",
            "kansai-02-aomori-02405-self-consumption-battery-2026-source-2",
            "kansai-02-aomori-02405-self-consumption-battery-2026-source-3",
            "kansai-02-aomori-02405-self-consumption-battery-2026-source-4",
            "kansai-02-aomori-02405-self-consumption-battery-2026-source-5",
            "kansai-02-aomori-02405-self-consumption-battery-2026-source-6"
          ],
          "machine_rule": "kansai_municipal_non_adopted",
          "non_adoption_status": "excluded",
          "non_adoption_reason_code": "official_conditions_not_applicable",
          "fit_compatible": false
        }
      ],
      "institutionalSource": "d150dcd7d9519840bbb04f107e8982bab1440912834c23f56367b90d9154fcf9",
      "sections": [
        {
          "label": "蓄電池",
          "text": "工事費込みの税抜蓄電池対象経費の実支出額の3分の1と蓄電池の対象容量に1kWhあたり14万1,000円を掛けた額の3分の1のうち，低い額以内です．",
          "supplement": [
            "（上限）35万円",
            "（端数処理）0.1kWh未満切り捨て",
            "（端数処理）1,000円未満切り捨て"
          ]
        }
      ],
      "text": "工事費込みの税抜蓄電池対象経費の実支出額の3分の1と蓄電池の対象容量に1kWhあたり14万1,000円を掛けた額の3分の1のうち，低い額以内です．",
      "supplement": [
        "（上限）35万円",
        "（端数処理）0.1kWh未満切り捨て",
        "（端数処理）1,000円未満切り捨て"
      ],
      "commonSupplement": [],
      "equipment": "蓄電池のみ"
    },
    "aomori-02408-self-consumption-pv-2026": {
      "prefecture": "02",
      "municipality": "02408",
      "recordId": "scheme-005f66a6c15d4b158d94b96b243a5a73",
      "targetYear": "2026",
      "branch": {
        "branch_id": "aomori-02408-self-consumption-pv-2026",
        "diagnostic_rule_ids": [
          "aomori-02408-self-consumption-pv-2026"
        ],
        "target_equipment": [
          "太陽光パネル"
        ],
        "application_start": [
          {
            "branch_id": "aomori-02408-self-consumption-pv-2026",
            "label": "交付申請",
            "date": "2026-06-01"
          }
        ],
        "application_end": [
          {
            "branch_id": "aomori-02408-self-consumption-pv-2026",
            "label": "交付申請",
            "date": "2026-12-28"
          }
        ],
        "application_status": "受付中",
        "amount": {
          "display_text": "太陽光の税抜対象経費の実支出額，出力1kW当たり5万円の額，25万円のうち最も低い額以内です．出力はモジュールとパワーコンディショナーの小さい方を整数kWに切り捨てた値です．補助額の千円未満を切り捨てます．",
          "evidence_status": "partial"
        },
        "official_conditions": [],
        "gaps": [],
        "evidence_urls": [
          "https://www.town.tohoku.lg.jp/kurashi/life/jyuutaku_07.html",
          "https://www.town.tohoku.lg.jp/kurashi/life/file/jyuutaku_07-01.pdf",
          "https://www.town.tohoku.lg.jp/kurashi/life/file/jyuutaku_07-14.pdf",
          "https://aomori-taiyoko.pref.aomori.lg.jp/residential/",
          "https://aomori-taiyoko.pref.aomori.lg.jp/residential/status/"
        ],
        "checked_at": "2026-09-27",
        "display_basis": "preparing",
        "migration_status": "pending_review",
        "legacy_municipal_rule_ids": []
      },
      "catalogAmount": {
        "raw_text": "PV原式：対象経費の実支出額，5万円/kWに応じた額，25万円の最小額以内．税抜対象経費を用いる．出力はモジュールとPCSの小さい値をkW単位で整数切捨て（自治体案内・手引）．金額は千円未満切捨て．",
        "display_text": "太陽光の税抜対象経費の実支出額，出力1kW当たり5万円の額，25万円のうち最も低い額以内です．出力はモジュールとパワーコンディショナーの小さい方を整数kWに切り捨てた値です．補助額の千円未満を切り捨てます．",
        "evidence_status": "partial"
      },
      "rules": [
        {
          "id": "aomori-02408-self-consumption-pv-2026",
          "government_level": "municipality",
          "prefecture_code": "02",
          "municipality_code": "02408",
          "program_name": "東北町住宅用自家消費型太陽光発電設備等導入支援事業費補助金",
          "housing_ages": [
            "existing",
            "new"
          ],
          "equipment_packages": [
            "solar_only",
            "solar_plus_standard_battery"
          ],
          "application_status": "accepting",
          "diagnostic_scope": {
            "status": "in_scope",
            "in_scope_housing_ages": [
              "existing",
              "new"
            ],
            "excluded_branch_ids": [],
            "basis": "非FIT・非FIPの新設PV（蓄電池は同時導入）を要する県連携制度のためFIT診断へ非算入．原式・全文根拠・市町固有の期限を保持．補助対象経費の費目，併用禁止範囲，手続・完了期限の逐条統合は添付原文抜粋に残し，独立検収まで検証完了としない．"
          },
          "expense_scopes": [
            "solar"
          ],
          "conflict_program_ids": [],
          "official_urls": [
            "https://www.town.tohoku.lg.jp/kurashi/life/jyuutaku_07.html",
            "https://www.town.tohoku.lg.jp/kurashi/life/file/jyuutaku_07-01.pdf",
            "https://www.town.tohoku.lg.jp/kurashi/life/file/jyuutaku_07-14.pdf",
            "https://aomori-taiyoko.pref.aomori.lg.jp/residential/",
            "https://aomori-taiyoko.pref.aomori.lg.jp/residential/status/"
          ],
          "confirmed_at": "2026-09-27",
          "calculation_assumptions": [
            "本人所有・本人居住の戸建1戸をモデルとして採用．住宅性能の個別条件は対象設備・その他条件に記す．",
            "本人居住の個人を検討対象とし，資料で定める住民登録・税等要件は充足を仮定．他の属性は原文の条件を参照し推測で追加しない．",
            "住宅用自家消費型PV．蓄電池のみの導入は対象外．非FIT・非FIP条件，製品要件及び容量上限は自治体資料及び県共通案内の根拠全文に保存．",
            "原文の着手届，実績報告の相対期限，併用禁止の適用範囲を監査抜粋に保持．",
            "併用不可：国費による同一対象事業への重複助成禁止を含む．自治体ごとの原文範囲は監査抜粋を参照し，併用可へ一括補完しない．\n上限：個別の金額式のとおり．他制度との共通上限は未確認．",
            "本人所有・本人居住の戸建を仮定．公式に住宅所有の限定がない場合は仮定として区別．"
          ],
          "required_confirmations": [
            "非FIT・非FIPの新設PV（蓄電池は同時導入）を要する県連携制度のためFIT診断へ非算入．原式・全文根拠・市町固有の期限を保持．補助対象経費の費目，併用禁止範囲，手続・完了期限の逐条統合は添付原文抜粋に残し，独立検収まで検証完了としない．",
            "最新の受付・予算残高，対象機種・資格・申請順序を申請時に確認する．",
            "交付申請受付：2026-06-01〜2026-12-28．工事完了・実績報告の期限とは別．"
          ],
          "source_ids": [
            "kansai-02-aomori-02408-self-consumption-pv-2026-source-1",
            "kansai-02-aomori-02408-self-consumption-pv-2026-source-2",
            "kansai-02-aomori-02408-self-consumption-pv-2026-source-3",
            "kansai-02-aomori-02408-self-consumption-pv-2026-source-4",
            "kansai-02-aomori-02408-self-consumption-pv-2026-source-5"
          ],
          "machine_rule": "kansai_municipal_non_adopted",
          "non_adoption_status": "excluded",
          "non_adoption_reason_code": "official_conditions_not_applicable",
          "fit_compatible": false
        }
      ],
      "institutionalSource": "d4c6258bfecb767383c62c8e7a563d772e5dd1798f842cfb2f7124dcd7342890",
      "sections": [
        {
          "label": "太陽光",
          "text": "太陽光の税抜対象経費の実支出額と太陽光の対象出力に1kWあたり5万円を掛けた額のうち，低い額以内です．",
          "supplement": [
            "（算定対象）出力の基準：モジュールとパワーコンディショナーの小さい方",
            "（上限）25万円",
            "（端数処理）1kW未満切り捨て",
            "（端数処理）1,000円未満切り捨て"
          ]
        }
      ],
      "text": "太陽光の税抜対象経費の実支出額と太陽光の対象出力に1kWあたり5万円を掛けた額のうち，低い額以内です．",
      "supplement": [
        "（算定対象）出力の基準：モジュールとパワーコンディショナーの小さい方",
        "（上限）25万円",
        "（端数処理）1kW未満切り捨て",
        "（端数処理）1,000円未満切り捨て"
      ],
      "commonSupplement": [],
      "equipment": "太陽光のみ"
    },
    "aomori-02408-self-consumption-battery-2026": {
      "prefecture": "02",
      "municipality": "02408",
      "recordId": "scheme-005f66a6c15d4b158d94b96b243a5a73",
      "targetYear": "2026",
      "branch": {
        "branch_id": "aomori-02408-self-consumption-battery-2026",
        "diagnostic_rule_ids": [
          "aomori-02408-self-consumption-battery-2026"
        ],
        "target_equipment": [
          "蓄電池"
        ],
        "application_start": [
          {
            "branch_id": "aomori-02408-self-consumption-battery-2026",
            "label": "交付申請",
            "date": "2026-06-01"
          }
        ],
        "application_end": [
          {
            "branch_id": "aomori-02408-self-consumption-battery-2026",
            "label": "交付申請",
            "date": "2026-12-28"
          }
        ],
        "application_status": "受付中",
        "amount": {
          "display_text": "工事費込みの税抜蓄電池対象経費の実支出額の3分の1，蓄電容量に1kWh当たり14.1万円を掛けた額の3分の1，35万円のうち最も低い額以内です．蓄電容量は0.1kWh単位で切り捨て，補助額の千円未満を切り捨てます．1kWh当たり14.1万円は対象経費の上限単価で，補助単価ではありません．",
          "evidence_status": "partial"
        },
        "official_conditions": [],
        "gaps": [],
        "evidence_urls": [
          "https://www.town.tohoku.lg.jp/kurashi/life/jyuutaku_07.html",
          "https://www.town.tohoku.lg.jp/kurashi/life/file/jyuutaku_07-01.pdf",
          "https://www.town.tohoku.lg.jp/kurashi/life/file/jyuutaku_07-14.pdf",
          "https://aomori-taiyoko.pref.aomori.lg.jp/residential/",
          "https://aomori-taiyoko.pref.aomori.lg.jp/residential/status/"
        ],
        "checked_at": "2026-09-27",
        "display_basis": "preparing",
        "migration_status": "pending_review",
        "legacy_municipal_rule_ids": []
      },
      "catalogAmount": {
        "raw_text": "蓄電池原式：税抜対象経費実支出額の1/3，蓄電容量×141,000円/kWhの1/3，350,000円の最小額以内．工事費込み．14.1万円/kWhは補助単価でなく対象経費上限．蓄電容量は小数第2位以下切捨て（0.1kWh単位）．金額は千円未満切捨て．",
        "display_text": "工事費込みの税抜蓄電池対象経費の実支出額の3分の1，蓄電容量に1kWh当たり14.1万円を掛けた額の3分の1，35万円のうち最も低い額以内です．蓄電容量は0.1kWh単位で切り捨て，補助額の千円未満を切り捨てます．1kWh当たり14.1万円は対象経費の上限単価で，補助単価ではありません．",
        "evidence_status": "partial"
      },
      "rules": [
        {
          "id": "aomori-02408-self-consumption-battery-2026",
          "government_level": "municipality",
          "prefecture_code": "02",
          "municipality_code": "02408",
          "program_name": "東北町住宅用自家消費型太陽光発電設備等導入支援事業費補助金",
          "housing_ages": [
            "existing",
            "new"
          ],
          "equipment_packages": [
            "solar_plus_standard_battery"
          ],
          "application_status": "accepting",
          "diagnostic_scope": {
            "status": "in_scope",
            "in_scope_housing_ages": [
              "existing",
              "new"
            ],
            "excluded_branch_ids": [],
            "basis": "非FIT・非FIPの新設PV（蓄電池は同時導入）を要する県連携制度のためFIT診断へ非算入．原式・全文根拠・市町固有の期限を保持．補助対象経費の費目，併用禁止範囲，手続・完了期限の逐条統合は添付原文抜粋に残し，独立検収まで検証完了としない．"
          },
          "expense_scopes": [
            "battery"
          ],
          "conflict_program_ids": [],
          "official_urls": [
            "https://www.town.tohoku.lg.jp/kurashi/life/jyuutaku_07.html",
            "https://www.town.tohoku.lg.jp/kurashi/life/file/jyuutaku_07-01.pdf",
            "https://www.town.tohoku.lg.jp/kurashi/life/file/jyuutaku_07-14.pdf",
            "https://aomori-taiyoko.pref.aomori.lg.jp/residential/",
            "https://aomori-taiyoko.pref.aomori.lg.jp/residential/status/"
          ],
          "confirmed_at": "2026-09-27",
          "calculation_assumptions": [
            "本人所有・本人居住の戸建1戸をモデルとして採用．住宅性能の個別条件は対象設備・その他条件に記す．",
            "本人居住の個人を検討対象とし，資料で定める住民登録・税等要件は充足を仮定．他の属性は原文の条件を参照し推測で追加しない．",
            "住宅用自家消費型PV．蓄電池のみの導入は対象外．非FIT・非FIP条件，製品要件及び容量上限は自治体資料及び県共通案内の根拠全文に保存．",
            "原文の着手届，実績報告の相対期限，併用禁止の適用範囲を監査抜粋に保持．",
            "併用不可：国費による同一対象事業への重複助成禁止を含む．自治体ごとの原文範囲は監査抜粋を参照し，併用可へ一括補完しない．\n上限：個別の金額式のとおり．他制度との共通上限は未確認．",
            "本人所有・本人居住の戸建を仮定．公式に住宅所有の限定がない場合は仮定として区別．"
          ],
          "required_confirmations": [
            "非FIT・非FIPの新設PV（蓄電池は同時導入）を要する県連携制度のためFIT診断へ非算入．原式・全文根拠・市町固有の期限を保持．補助対象経費の費目，併用禁止範囲，手続・完了期限の逐条統合は添付原文抜粋に残し，独立検収まで検証完了としない．",
            "最新の受付・予算残高，対象機種・資格・申請順序を申請時に確認する．",
            "交付申請受付：2026-06-01〜2026-12-28．工事完了・実績報告の期限とは別．"
          ],
          "source_ids": [
            "kansai-02-aomori-02408-self-consumption-battery-2026-source-1",
            "kansai-02-aomori-02408-self-consumption-battery-2026-source-2",
            "kansai-02-aomori-02408-self-consumption-battery-2026-source-3",
            "kansai-02-aomori-02408-self-consumption-battery-2026-source-4",
            "kansai-02-aomori-02408-self-consumption-battery-2026-source-5"
          ],
          "machine_rule": "kansai_municipal_non_adopted",
          "non_adoption_status": "excluded",
          "non_adoption_reason_code": "official_conditions_not_applicable",
          "fit_compatible": false
        }
      ],
      "institutionalSource": "a4d4f46fa9a6c079175fe3964e0c06605712ebaf734fce3e73ae85301d979542",
      "sections": [
        {
          "label": "蓄電池",
          "text": "工事費込みの税抜蓄電池対象経費の実支出額の3分の1と蓄電池の対象容量に1kWhあたり14万1,000円を掛けた額の3分の1のうち，低い額以内です．",
          "supplement": [
            "（上限）35万円",
            "（端数処理）0.1kWh未満切り捨て",
            "（端数処理）1,000円未満切り捨て"
          ]
        }
      ],
      "text": "工事費込みの税抜蓄電池対象経費の実支出額の3分の1と蓄電池の対象容量に1kWhあたり14万1,000円を掛けた額の3分の1のうち，低い額以内です．",
      "supplement": [
        "（上限）35万円",
        "（端数処理）0.1kWh未満切り捨て",
        "（端数処理）1,000円未満切り捨て"
      ],
      "commonSupplement": [],
      "equipment": "蓄電池のみ"
    },
    "aomori-02441-self-consumption-pv-2026": {
      "prefecture": "02",
      "municipality": "02441",
      "recordId": "scheme-d9cb2c72272049b8bf635d25800f0e79",
      "targetYear": "2026",
      "branch": {
        "branch_id": "aomori-02441-self-consumption-pv-2026",
        "diagnostic_rule_ids": [
          "aomori-02441-self-consumption-pv-2026"
        ],
        "target_equipment": [
          "太陽光パネル"
        ],
        "application_start": [
          {
            "branch_id": "aomori-02441-self-consumption-pv-2026",
            "label": "交付申請",
            "date": "2026-07-01"
          }
        ],
        "application_end": [
          {
            "branch_id": "aomori-02441-self-consumption-pv-2026",
            "label": "交付申請",
            "date": "2026-12-28"
          }
        ],
        "application_status": "受付中",
        "amount": {
          "display_text": "太陽光の税抜対象経費の実支出額，出力1kW当たり5万円の額，25万円のうち最も低い額以内です．出力はモジュールとパワーコンディショナーの小さい方を整数kWに切り捨てた値です．補助額の千円未満を切り捨てます．",
          "evidence_status": "partial"
        },
        "official_conditions": [],
        "gaps": [],
        "evidence_urls": [
          "https://www.town.sannohe.aomori.jp/soshiki/juuminfukushi/gomi_kankyou_petto/kankyou/5877.html",
          "https://www.town.sannohe.aomori.jp/material/files/group/7/r8_taiyoukou_hojyokinkouhuyoukou.pdf",
          "https://www.town.sannohe.aomori.jp/material/files/group/7/r8_taiyoukou_tebiki.pdf",
          "https://aomori-taiyoko.pref.aomori.lg.jp/residential/",
          "https://aomori-taiyoko.pref.aomori.lg.jp/residential/status/"
        ],
        "checked_at": "2026-09-27",
        "display_basis": "preparing",
        "migration_status": "pending_review",
        "legacy_municipal_rule_ids": []
      },
      "catalogAmount": {
        "raw_text": "PV原式：対象経費の実支出額，5万円/kWに応じた額，25万円の最小額以内．税抜対象経費を用いる．出力はモジュールとPCSの小さい値をkW単位で整数切捨て（自治体案内・手引）．金額は千円未満切捨て．",
        "display_text": "太陽光の税抜対象経費の実支出額，出力1kW当たり5万円の額，25万円のうち最も低い額以内です．出力はモジュールとパワーコンディショナーの小さい方を整数kWに切り捨てた値です．補助額の千円未満を切り捨てます．",
        "evidence_status": "partial"
      },
      "rules": [
        {
          "id": "aomori-02441-self-consumption-pv-2026",
          "government_level": "municipality",
          "prefecture_code": "02",
          "municipality_code": "02441",
          "program_name": "三戸町住宅用自家消費型太陽光発電設備等導入支援事業費補助金",
          "housing_ages": [
            "existing",
            "new"
          ],
          "equipment_packages": [
            "solar_only",
            "solar_plus_standard_battery"
          ],
          "application_status": "accepting",
          "diagnostic_scope": {
            "status": "in_scope",
            "in_scope_housing_ages": [
              "existing",
              "new"
            ],
            "excluded_branch_ids": [],
            "basis": "非FIT・非FIPの新設PV（蓄電池は同時導入）を要する県連携制度のためFIT診断へ非算入．原式・全文根拠・市町固有の期限を保持．補助対象経費の費目，併用禁止範囲，手続・完了期限の逐条統合は添付原文抜粋に残し，独立検収まで検証完了としない．"
          },
          "expense_scopes": [
            "solar"
          ],
          "conflict_program_ids": [],
          "official_urls": [
            "https://www.town.sannohe.aomori.jp/soshiki/juuminfukushi/gomi_kankyou_petto/kankyou/5877.html",
            "https://www.town.sannohe.aomori.jp/material/files/group/7/r8_taiyoukou_hojyokinkouhuyoukou.pdf",
            "https://www.town.sannohe.aomori.jp/material/files/group/7/r8_taiyoukou_tebiki.pdf",
            "https://aomori-taiyoko.pref.aomori.lg.jp/residential/",
            "https://aomori-taiyoko.pref.aomori.lg.jp/residential/status/"
          ],
          "confirmed_at": "2026-09-27",
          "calculation_assumptions": [
            "本人所有・本人居住の戸建1戸をモデルとして採用．住宅性能の個別条件は対象設備・その他条件に記す．",
            "本人居住の個人を検討対象とし，資料で定める住民登録・税等要件は充足を仮定．他の属性は原文の条件を参照し推測で追加しない．",
            "住宅用自家消費型PV．蓄電池のみの導入は対象外．非FIT・非FIP条件，製品要件及び容量上限は自治体資料及び県共通案内の根拠全文に保存．",
            "原文の着手届，実績報告の相対期限，併用禁止の適用範囲を監査抜粋に保持．",
            "併用不可：国費による同一対象事業への重複助成禁止を含む．自治体ごとの原文範囲は監査抜粋を参照し，併用可へ一括補完しない．\n上限：個別の金額式のとおり．他制度との共通上限は未確認．",
            "本人所有・本人居住の戸建を仮定．公式に住宅所有の限定がない場合は仮定として区別．"
          ],
          "required_confirmations": [
            "非FIT・非FIPの新設PV（蓄電池は同時導入）を要する県連携制度のためFIT診断へ非算入．原式・全文根拠・市町固有の期限を保持．補助対象経費の費目，併用禁止範囲，手続・完了期限の逐条統合は添付原文抜粋に残し，独立検収まで検証完了としない．",
            "最新の受付・予算残高，対象機種・資格・申請順序を申請時に確認する．",
            "交付申請受付：2026-07-01〜2026-12-28．工事完了・実績報告の期限とは別．"
          ],
          "source_ids": [
            "kansai-02-aomori-02441-self-consumption-pv-2026-source-1",
            "kansai-02-aomori-02441-self-consumption-pv-2026-source-2",
            "kansai-02-aomori-02441-self-consumption-pv-2026-source-3",
            "kansai-02-aomori-02441-self-consumption-pv-2026-source-4",
            "kansai-02-aomori-02441-self-consumption-pv-2026-source-5"
          ],
          "machine_rule": "kansai_municipal_non_adopted",
          "non_adoption_status": "excluded",
          "non_adoption_reason_code": "official_conditions_not_applicable",
          "fit_compatible": false
        }
      ],
      "institutionalSource": "1b9e1c6aa37bb8d2dc87b91cae2e0bb0a65d1dacc013ed20146cb3f0fe53deb0",
      "sections": [
        {
          "label": "太陽光",
          "text": "太陽光の税抜対象経費の実支出額と太陽光の対象出力に1kWあたり5万円を掛けた額のうち，低い額以内です．",
          "supplement": [
            "（算定対象）出力の基準：モジュールとパワーコンディショナーの小さい方",
            "（上限）25万円",
            "（端数処理）1kW未満切り捨て",
            "（端数処理）1,000円未満切り捨て"
          ]
        }
      ],
      "text": "太陽光の税抜対象経費の実支出額と太陽光の対象出力に1kWあたり5万円を掛けた額のうち，低い額以内です．",
      "supplement": [
        "（算定対象）出力の基準：モジュールとパワーコンディショナーの小さい方",
        "（上限）25万円",
        "（端数処理）1kW未満切り捨て",
        "（端数処理）1,000円未満切り捨て"
      ],
      "commonSupplement": [],
      "equipment": "太陽光のみ"
    },
    "aomori-02441-self-consumption-battery-2026": {
      "prefecture": "02",
      "municipality": "02441",
      "recordId": "scheme-d9cb2c72272049b8bf635d25800f0e79",
      "targetYear": "2026",
      "branch": {
        "branch_id": "aomori-02441-self-consumption-battery-2026",
        "diagnostic_rule_ids": [
          "aomori-02441-self-consumption-battery-2026"
        ],
        "target_equipment": [
          "蓄電池"
        ],
        "application_start": [
          {
            "branch_id": "aomori-02441-self-consumption-battery-2026",
            "label": "交付申請",
            "date": "2026-07-01"
          }
        ],
        "application_end": [
          {
            "branch_id": "aomori-02441-self-consumption-battery-2026",
            "label": "交付申請",
            "date": "2026-12-28"
          }
        ],
        "application_status": "受付中",
        "amount": {
          "display_text": "工事費込みの税抜蓄電池対象経費の実支出額の3分の1，蓄電容量に1kWh当たり14.1万円を掛けた額の3分の1，35万円のうち最も低い額以内です．蓄電容量は0.1kWh単位で切り捨て，補助額の千円未満を切り捨てます．1kWh当たり14.1万円は対象経費の上限単価で，補助単価ではありません．",
          "evidence_status": "partial"
        },
        "official_conditions": [],
        "gaps": [],
        "evidence_urls": [
          "https://www.town.sannohe.aomori.jp/soshiki/juuminfukushi/gomi_kankyou_petto/kankyou/5877.html",
          "https://www.town.sannohe.aomori.jp/material/files/group/7/r8_taiyoukou_hojyokinkouhuyoukou.pdf",
          "https://www.town.sannohe.aomori.jp/material/files/group/7/r8_taiyoukou_tebiki.pdf",
          "https://aomori-taiyoko.pref.aomori.lg.jp/residential/",
          "https://aomori-taiyoko.pref.aomori.lg.jp/residential/status/"
        ],
        "checked_at": "2026-09-27",
        "display_basis": "preparing",
        "migration_status": "pending_review",
        "legacy_municipal_rule_ids": []
      },
      "catalogAmount": {
        "raw_text": "蓄電池原式：税抜対象経費実支出額の1/3，蓄電容量×141,000円/kWhの1/3，350,000円の最小額以内．工事費込み．14.1万円/kWhは補助単価でなく対象経費上限．蓄電容量は小数第2位以下切捨て（0.1kWh単位）．金額は千円未満切捨て．",
        "display_text": "工事費込みの税抜蓄電池対象経費の実支出額の3分の1，蓄電容量に1kWh当たり14.1万円を掛けた額の3分の1，35万円のうち最も低い額以内です．蓄電容量は0.1kWh単位で切り捨て，補助額の千円未満を切り捨てます．1kWh当たり14.1万円は対象経費の上限単価で，補助単価ではありません．",
        "evidence_status": "partial"
      },
      "rules": [
        {
          "id": "aomori-02441-self-consumption-battery-2026",
          "government_level": "municipality",
          "prefecture_code": "02",
          "municipality_code": "02441",
          "program_name": "三戸町住宅用自家消費型太陽光発電設備等導入支援事業費補助金",
          "housing_ages": [
            "existing",
            "new"
          ],
          "equipment_packages": [
            "solar_plus_standard_battery"
          ],
          "application_status": "accepting",
          "diagnostic_scope": {
            "status": "in_scope",
            "in_scope_housing_ages": [
              "existing",
              "new"
            ],
            "excluded_branch_ids": [],
            "basis": "非FIT・非FIPの新設PV（蓄電池は同時導入）を要する県連携制度のためFIT診断へ非算入．原式・全文根拠・市町固有の期限を保持．補助対象経費の費目，併用禁止範囲，手続・完了期限の逐条統合は添付原文抜粋に残し，独立検収まで検証完了としない．"
          },
          "expense_scopes": [
            "battery"
          ],
          "conflict_program_ids": [],
          "official_urls": [
            "https://www.town.sannohe.aomori.jp/soshiki/juuminfukushi/gomi_kankyou_petto/kankyou/5877.html",
            "https://www.town.sannohe.aomori.jp/material/files/group/7/r8_taiyoukou_hojyokinkouhuyoukou.pdf",
            "https://www.town.sannohe.aomori.jp/material/files/group/7/r8_taiyoukou_tebiki.pdf",
            "https://aomori-taiyoko.pref.aomori.lg.jp/residential/",
            "https://aomori-taiyoko.pref.aomori.lg.jp/residential/status/"
          ],
          "confirmed_at": "2026-09-27",
          "calculation_assumptions": [
            "本人所有・本人居住の戸建1戸をモデルとして採用．住宅性能の個別条件は対象設備・その他条件に記す．",
            "本人居住の個人を検討対象とし，資料で定める住民登録・税等要件は充足を仮定．他の属性は原文の条件を参照し推測で追加しない．",
            "住宅用自家消費型PV．蓄電池のみの導入は対象外．非FIT・非FIP条件，製品要件及び容量上限は自治体資料及び県共通案内の根拠全文に保存．",
            "原文の着手届，実績報告の相対期限，併用禁止の適用範囲を監査抜粋に保持．",
            "併用不可：国費による同一対象事業への重複助成禁止を含む．自治体ごとの原文範囲は監査抜粋を参照し，併用可へ一括補完しない．\n上限：個別の金額式のとおり．他制度との共通上限は未確認．",
            "本人所有・本人居住の戸建を仮定．公式に住宅所有の限定がない場合は仮定として区別．"
          ],
          "required_confirmations": [
            "非FIT・非FIPの新設PV（蓄電池は同時導入）を要する県連携制度のためFIT診断へ非算入．原式・全文根拠・市町固有の期限を保持．補助対象経費の費目，併用禁止範囲，手続・完了期限の逐条統合は添付原文抜粋に残し，独立検収まで検証完了としない．",
            "最新の受付・予算残高，対象機種・資格・申請順序を申請時に確認する．",
            "交付申請受付：2026-07-01〜2026-12-28．工事完了・実績報告の期限とは別．"
          ],
          "source_ids": [
            "kansai-02-aomori-02441-self-consumption-battery-2026-source-1",
            "kansai-02-aomori-02441-self-consumption-battery-2026-source-2",
            "kansai-02-aomori-02441-self-consumption-battery-2026-source-3",
            "kansai-02-aomori-02441-self-consumption-battery-2026-source-4",
            "kansai-02-aomori-02441-self-consumption-battery-2026-source-5"
          ],
          "machine_rule": "kansai_municipal_non_adopted",
          "non_adoption_status": "excluded",
          "non_adoption_reason_code": "official_conditions_not_applicable",
          "fit_compatible": false
        }
      ],
      "institutionalSource": "b91eaddee3b5da744b2115f03af775cc07d6a7a9dd703bca6e1ded15107258fb",
      "sections": [
        {
          "label": "蓄電池",
          "text": "工事費込みの税抜蓄電池対象経費の実支出額の3分の1と蓄電池の対象容量に1kWhあたり14万1,000円を掛けた額の3分の1のうち，低い額以内です．",
          "supplement": [
            "（上限）35万円",
            "（端数処理）0.1kWh未満切り捨て",
            "（端数処理）1,000円未満切り捨て"
          ]
        }
      ],
      "text": "工事費込みの税抜蓄電池対象経費の実支出額の3分の1と蓄電池の対象容量に1kWhあたり14万1,000円を掛けた額の3分の1のうち，低い額以内です．",
      "supplement": [
        "（上限）35万円",
        "（端数処理）0.1kWh未満切り捨て",
        "（端数処理）1,000円未満切り捨て"
      ],
      "commonSupplement": [],
      "equipment": "蓄電池のみ"
    },
    "aomori-02442-self-consumption-pv-2026": {
      "prefecture": "02",
      "municipality": "02442",
      "recordId": "scheme-d0cef9275d2141b78a5df71e28e776bc",
      "targetYear": "2026",
      "branch": {
        "branch_id": "aomori-02442-self-consumption-pv-2026",
        "diagnostic_rule_ids": [
          "aomori-02442-self-consumption-pv-2026"
        ],
        "target_equipment": [
          "太陽光パネル"
        ],
        "application_start": [
          {
            "branch_id": "aomori-02442-self-consumption-pv-2026",
            "label": "交付申請",
            "date": ""
          }
        ],
        "application_end": [
          {
            "branch_id": "aomori-02442-self-consumption-pv-2026",
            "label": "交付申請",
            "date": "2026-12-28"
          }
        ],
        "application_status": "受付中",
        "amount": {
          "display_text": "太陽光の税抜対象経費の実支出額，出力1kW当たり5万円の額，25万円のうち最も低い額以内です．出力はモジュールとパワーコンディショナーの小さい方を整数kWに切り捨てた値です．補助額の千円未満を切り捨てます．",
          "evidence_status": "partial"
        },
        "official_conditions": [],
        "gaps": [],
        "evidence_urls": [
          "https://www.town.gonohe.aomori.jp/kurashi/osiease/taiyoukouhojokin.html",
          "https://www.town.gonohe.aomori.jp/kurashi/osiease/R8taiyoukou_youkou.pdf",
          "https://www.town.gonohe.aomori.jp/kurashi/osiease/R8taiyoukou_tebiki.pdf",
          "https://aomori-taiyoko.pref.aomori.lg.jp/residential/",
          "https://aomori-taiyoko.pref.aomori.lg.jp/residential/status/"
        ],
        "checked_at": "2026-09-27",
        "display_basis": "preparing",
        "migration_status": "pending_review",
        "legacy_municipal_rule_ids": []
      },
      "catalogAmount": {
        "raw_text": "PV原式：対象経費の実支出額，5万円/kWに応じた額，25万円の最小額以内．税抜対象経費を用いる．出力はモジュールとPCSの小さい値をkW単位で整数切捨て（自治体案内・手引）．金額は千円未満切捨て．",
        "display_text": "太陽光の税抜対象経費の実支出額，出力1kW当たり5万円の額，25万円のうち最も低い額以内です．出力はモジュールとパワーコンディショナーの小さい方を整数kWに切り捨てた値です．補助額の千円未満を切り捨てます．",
        "evidence_status": "partial"
      },
      "rules": [
        {
          "id": "aomori-02442-self-consumption-pv-2026",
          "government_level": "municipality",
          "prefecture_code": "02",
          "municipality_code": "02442",
          "program_name": "五戸町住宅用自家消費型太陽光発電設備等導入支援事業費補助金",
          "housing_ages": [
            "existing",
            "new"
          ],
          "equipment_packages": [
            "solar_only",
            "solar_plus_standard_battery"
          ],
          "application_status": "accepting",
          "diagnostic_scope": {
            "status": "in_scope",
            "in_scope_housing_ages": [
              "existing",
              "new"
            ],
            "excluded_branch_ids": [],
            "basis": "非FIT・非FIPの新設PV（蓄電池は同時導入）を要する県連携制度のためFIT診断へ非算入．原式・全文根拠・市町固有の期限を保持．補助対象経費の費目，併用禁止範囲，手続・完了期限の逐条統合は添付原文抜粋に残し，独立検収まで検証完了としない．"
          },
          "expense_scopes": [
            "solar"
          ],
          "conflict_program_ids": [],
          "official_urls": [
            "https://www.town.gonohe.aomori.jp/kurashi/osiease/taiyoukouhojokin.html",
            "https://www.town.gonohe.aomori.jp/kurashi/osiease/R8taiyoukou_youkou.pdf",
            "https://www.town.gonohe.aomori.jp/kurashi/osiease/R8taiyoukou_tebiki.pdf",
            "https://aomori-taiyoko.pref.aomori.lg.jp/residential/",
            "https://aomori-taiyoko.pref.aomori.lg.jp/residential/status/"
          ],
          "confirmed_at": "2026-09-27",
          "calculation_assumptions": [
            "本人所有・本人居住の戸建1戸をモデルとして採用．住宅性能の個別条件は対象設備・その他条件に記す．",
            "本人居住の個人を検討対象とし，資料で定める住民登録・税等要件は充足を仮定．他の属性は原文の条件を参照し推測で追加しない．",
            "住宅用自家消費型PV．蓄電池のみの導入は対象外．非FIT・非FIP条件，製品要件及び容量上限は自治体資料及び県共通案内の根拠全文に保存．",
            "原文の着手届，実績報告の相対期限，併用禁止の適用範囲を監査抜粋に保持．",
            "併用不可：国費による同一対象事業への重複助成禁止を含む．自治体ごとの原文範囲は監査抜粋を参照し，併用可へ一括補完しない．\n上限：個別の金額式のとおり．他制度との共通上限は未確認．",
            "本人所有・本人居住の戸建を仮定．公式に住宅所有の限定がない場合は仮定として区別．"
          ],
          "required_confirmations": [
            "非FIT・非FIPの新設PV（蓄電池は同時導入）を要する県連携制度のためFIT診断へ非算入．原式・全文根拠・市町固有の期限を保持．補助対象経費の費目，併用禁止範囲，手続・完了期限の逐条統合は添付原文抜粋に残し，独立検収まで検証完了としない．",
            "最新の受付・予算残高，対象機種・資格・申請順序を申請時に確認する．",
            "交付申請受付：開始日未確認〜2026-12-28．工事完了・実績報告の期限とは別．"
          ],
          "source_ids": [
            "kansai-02-aomori-02442-self-consumption-pv-2026-source-1",
            "kansai-02-aomori-02442-self-consumption-pv-2026-source-2",
            "kansai-02-aomori-02442-self-consumption-pv-2026-source-3",
            "kansai-02-aomori-02442-self-consumption-pv-2026-source-4",
            "kansai-02-aomori-02442-self-consumption-pv-2026-source-5"
          ],
          "machine_rule": "kansai_municipal_non_adopted",
          "non_adoption_status": "excluded",
          "non_adoption_reason_code": "official_conditions_not_applicable",
          "fit_compatible": false
        }
      ],
      "institutionalSource": "85b92b3c401ab717adee5a49b96eac55ee62fa426d9ee967e854b30a3faf9941",
      "sections": [
        {
          "label": "太陽光",
          "text": "太陽光の税抜対象経費の実支出額と太陽光の対象出力に1kWあたり5万円を掛けた額のうち，低い額以内です．",
          "supplement": [
            "（算定対象）出力の基準：モジュールとパワーコンディショナーの小さい方",
            "（上限）25万円",
            "（端数処理）1kW未満切り捨て",
            "（端数処理）1,000円未満切り捨て"
          ]
        }
      ],
      "text": "太陽光の税抜対象経費の実支出額と太陽光の対象出力に1kWあたり5万円を掛けた額のうち，低い額以内です．",
      "supplement": [
        "（算定対象）出力の基準：モジュールとパワーコンディショナーの小さい方",
        "（上限）25万円",
        "（端数処理）1kW未満切り捨て",
        "（端数処理）1,000円未満切り捨て"
      ],
      "commonSupplement": [],
      "equipment": "太陽光のみ"
    },
    "aomori-02442-self-consumption-battery-2026": {
      "prefecture": "02",
      "municipality": "02442",
      "recordId": "scheme-d0cef9275d2141b78a5df71e28e776bc",
      "targetYear": "2026",
      "branch": {
        "branch_id": "aomori-02442-self-consumption-battery-2026",
        "diagnostic_rule_ids": [
          "aomori-02442-self-consumption-battery-2026"
        ],
        "target_equipment": [
          "蓄電池"
        ],
        "application_start": [
          {
            "branch_id": "aomori-02442-self-consumption-battery-2026",
            "label": "交付申請",
            "date": ""
          }
        ],
        "application_end": [
          {
            "branch_id": "aomori-02442-self-consumption-battery-2026",
            "label": "交付申請",
            "date": "2026-12-28"
          }
        ],
        "application_status": "受付中",
        "amount": {
          "display_text": "工事費込みの税抜蓄電池対象経費の実支出額の3分の1，蓄電容量に1kWh当たり14.1万円を掛けた額の3分の1，35万円のうち最も低い額以内です．蓄電容量は0.1kWh単位で切り捨て，補助額の千円未満を切り捨てます．1kWh当たり14.1万円は対象経費の上限単価で，補助単価ではありません．",
          "evidence_status": "partial"
        },
        "official_conditions": [],
        "gaps": [],
        "evidence_urls": [
          "https://www.town.gonohe.aomori.jp/kurashi/osiease/taiyoukouhojokin.html",
          "https://www.town.gonohe.aomori.jp/kurashi/osiease/R8taiyoukou_youkou.pdf",
          "https://www.town.gonohe.aomori.jp/kurashi/osiease/R8taiyoukou_tebiki.pdf",
          "https://aomori-taiyoko.pref.aomori.lg.jp/residential/",
          "https://aomori-taiyoko.pref.aomori.lg.jp/residential/status/"
        ],
        "checked_at": "2026-09-27",
        "display_basis": "preparing",
        "migration_status": "pending_review",
        "legacy_municipal_rule_ids": []
      },
      "catalogAmount": {
        "raw_text": "蓄電池原式：税抜対象経費実支出額の1/3，蓄電容量×141,000円/kWhの1/3，350,000円の最小額以内．工事費込み．14.1万円/kWhは補助単価でなく対象経費上限．蓄電容量は小数第2位以下切捨て（0.1kWh単位）．金額は千円未満切捨て．",
        "display_text": "工事費込みの税抜蓄電池対象経費の実支出額の3分の1，蓄電容量に1kWh当たり14.1万円を掛けた額の3分の1，35万円のうち最も低い額以内です．蓄電容量は0.1kWh単位で切り捨て，補助額の千円未満を切り捨てます．1kWh当たり14.1万円は対象経費の上限単価で，補助単価ではありません．",
        "evidence_status": "partial"
      },
      "rules": [
        {
          "id": "aomori-02442-self-consumption-battery-2026",
          "government_level": "municipality",
          "prefecture_code": "02",
          "municipality_code": "02442",
          "program_name": "五戸町住宅用自家消費型太陽光発電設備等導入支援事業費補助金",
          "housing_ages": [
            "existing",
            "new"
          ],
          "equipment_packages": [
            "solar_plus_standard_battery"
          ],
          "application_status": "accepting",
          "diagnostic_scope": {
            "status": "in_scope",
            "in_scope_housing_ages": [
              "existing",
              "new"
            ],
            "excluded_branch_ids": [],
            "basis": "非FIT・非FIPの新設PV（蓄電池は同時導入）を要する県連携制度のためFIT診断へ非算入．原式・全文根拠・市町固有の期限を保持．補助対象経費の費目，併用禁止範囲，手続・完了期限の逐条統合は添付原文抜粋に残し，独立検収まで検証完了としない．"
          },
          "expense_scopes": [
            "battery"
          ],
          "conflict_program_ids": [],
          "official_urls": [
            "https://www.town.gonohe.aomori.jp/kurashi/osiease/taiyoukouhojokin.html",
            "https://www.town.gonohe.aomori.jp/kurashi/osiease/R8taiyoukou_youkou.pdf",
            "https://www.town.gonohe.aomori.jp/kurashi/osiease/R8taiyoukou_tebiki.pdf",
            "https://aomori-taiyoko.pref.aomori.lg.jp/residential/",
            "https://aomori-taiyoko.pref.aomori.lg.jp/residential/status/"
          ],
          "confirmed_at": "2026-09-27",
          "calculation_assumptions": [
            "本人所有・本人居住の戸建1戸をモデルとして採用．住宅性能の個別条件は対象設備・その他条件に記す．",
            "本人居住の個人を検討対象とし，資料で定める住民登録・税等要件は充足を仮定．他の属性は原文の条件を参照し推測で追加しない．",
            "住宅用自家消費型PV．蓄電池のみの導入は対象外．非FIT・非FIP条件，製品要件及び容量上限は自治体資料及び県共通案内の根拠全文に保存．",
            "原文の着手届，実績報告の相対期限，併用禁止の適用範囲を監査抜粋に保持．",
            "併用不可：国費による同一対象事業への重複助成禁止を含む．自治体ごとの原文範囲は監査抜粋を参照し，併用可へ一括補完しない．\n上限：個別の金額式のとおり．他制度との共通上限は未確認．",
            "本人所有・本人居住の戸建を仮定．公式に住宅所有の限定がない場合は仮定として区別．"
          ],
          "required_confirmations": [
            "非FIT・非FIPの新設PV（蓄電池は同時導入）を要する県連携制度のためFIT診断へ非算入．原式・全文根拠・市町固有の期限を保持．補助対象経費の費目，併用禁止範囲，手続・完了期限の逐条統合は添付原文抜粋に残し，独立検収まで検証完了としない．",
            "最新の受付・予算残高，対象機種・資格・申請順序を申請時に確認する．",
            "交付申請受付：開始日未確認〜2026-12-28．工事完了・実績報告の期限とは別．"
          ],
          "source_ids": [
            "kansai-02-aomori-02442-self-consumption-battery-2026-source-1",
            "kansai-02-aomori-02442-self-consumption-battery-2026-source-2",
            "kansai-02-aomori-02442-self-consumption-battery-2026-source-3",
            "kansai-02-aomori-02442-self-consumption-battery-2026-source-4",
            "kansai-02-aomori-02442-self-consumption-battery-2026-source-5"
          ],
          "machine_rule": "kansai_municipal_non_adopted",
          "non_adoption_status": "excluded",
          "non_adoption_reason_code": "official_conditions_not_applicable",
          "fit_compatible": false
        }
      ],
      "institutionalSource": "8d7d5aa5081e15743d138b2e0c3aabecf17912ffffdfdbda6bbc0ea15b8a90bf",
      "sections": [
        {
          "label": "蓄電池",
          "text": "工事費込みの税抜蓄電池対象経費の実支出額の3分の1と蓄電池の対象容量に1kWhあたり14万1,000円を掛けた額の3分の1のうち，低い額以内です．",
          "supplement": [
            "（上限）35万円",
            "（端数処理）0.1kWh未満切り捨て",
            "（端数処理）1,000円未満切り捨て"
          ]
        }
      ],
      "text": "工事費込みの税抜蓄電池対象経費の実支出額の3分の1と蓄電池の対象容量に1kWhあたり14万1,000円を掛けた額の3分の1のうち，低い額以内です．",
      "supplement": [
        "（上限）35万円",
        "（端数処理）0.1kWh未満切り捨て",
        "（端数処理）1,000円未満切り捨て"
      ],
      "commonSupplement": [],
      "equipment": "蓄電池のみ"
    },
    "aomori-02445-self-consumption-pv-2026": {
      "prefecture": "02",
      "municipality": "02445",
      "recordId": "scheme-f53466b941db4f49bb7c635e2d841afa",
      "targetYear": "2026",
      "branch": {
        "branch_id": "aomori-02445-self-consumption-pv-2026",
        "diagnostic_rule_ids": [
          "aomori-02445-self-consumption-pv-2026"
        ],
        "target_equipment": [
          "太陽光パネル"
        ],
        "application_start": [
          {
            "branch_id": "aomori-02445-self-consumption-pv-2026",
            "label": "交付申請",
            "date": ""
          }
        ],
        "application_end": [
          {
            "branch_id": "aomori-02445-self-consumption-pv-2026",
            "label": "交付申請",
            "date": "2026-12-28"
          }
        ],
        "application_status": "受付中",
        "amount": {
          "display_text": "太陽光の税抜対象経費の実支出額，出力1kW当たり5万円の額，25万円のうち最も低い額以内です．出力はモジュールとパワーコンディショナーの小さい方を整数kWに切り捨てた値です．補助額の千円未満を切り捨てます．",
          "evidence_status": "partial"
        },
        "official_conditions": [],
        "gaps": [],
        "evidence_urls": [
          "https://www.town.aomori-nanbu.lg.jp//page/11605.html",
          "https://www.town.aomori-nanbu.lg.jp/uploaded/attachment/7991.pdf",
          "https://www.town.aomori-nanbu.lg.jp/uploaded/attachment/7992.pdf",
          "https://www.town.aomori-nanbu.lg.jp/uploaded/attachment/8005.pdf",
          "https://aomori-taiyoko.pref.aomori.lg.jp/residential/",
          "https://aomori-taiyoko.pref.aomori.lg.jp/residential/status/"
        ],
        "checked_at": "2026-09-27",
        "display_basis": "preparing",
        "migration_status": "pending_review",
        "legacy_municipal_rule_ids": []
      },
      "catalogAmount": {
        "raw_text": "PV原式：対象経費の実支出額，5万円/kWに応じた額，25万円の最小額以内．税抜対象経費を用いる．出力はモジュールとPCSの小さい値をkW単位で整数切捨て（自治体案内・手引）．金額は千円未満切捨て．",
        "display_text": "太陽光の税抜対象経費の実支出額，出力1kW当たり5万円の額，25万円のうち最も低い額以内です．出力はモジュールとパワーコンディショナーの小さい方を整数kWに切り捨てた値です．補助額の千円未満を切り捨てます．",
        "evidence_status": "partial"
      },
      "rules": [
        {
          "id": "aomori-02445-self-consumption-pv-2026",
          "government_level": "municipality",
          "prefecture_code": "02",
          "municipality_code": "02445",
          "program_name": "南部町住宅用自家消費型太陽光発電設備等導入支援事業費補助金",
          "housing_ages": [
            "existing",
            "new"
          ],
          "equipment_packages": [
            "solar_only",
            "solar_plus_standard_battery"
          ],
          "application_status": "accepting",
          "diagnostic_scope": {
            "status": "in_scope",
            "in_scope_housing_ages": [
              "existing",
              "new"
            ],
            "excluded_branch_ids": [],
            "basis": "非FIT・非FIPの新設PV（蓄電池は同時導入）を要する県連携制度のためFIT診断へ非算入．原式・全文根拠・市町固有の期限を保持．補助対象経費の費目，併用禁止範囲，手続・完了期限の逐条統合は添付原文抜粋に残し，独立検収まで検証完了としない．"
          },
          "expense_scopes": [
            "solar"
          ],
          "conflict_program_ids": [],
          "official_urls": [
            "https://www.town.aomori-nanbu.lg.jp//page/11605.html",
            "https://www.town.aomori-nanbu.lg.jp/uploaded/attachment/7991.pdf",
            "https://www.town.aomori-nanbu.lg.jp/uploaded/attachment/7992.pdf",
            "https://www.town.aomori-nanbu.lg.jp/uploaded/attachment/8005.pdf",
            "https://aomori-taiyoko.pref.aomori.lg.jp/residential/",
            "https://aomori-taiyoko.pref.aomori.lg.jp/residential/status/"
          ],
          "confirmed_at": "2026-09-27",
          "calculation_assumptions": [
            "本人所有・本人居住の戸建1戸をモデルとして採用．住宅性能の個別条件は対象設備・その他条件に記す．",
            "本人居住の個人を検討対象とし，資料で定める住民登録・税等要件は充足を仮定．他の属性は原文の条件を参照し推測で追加しない．",
            "住宅用自家消費型PV．蓄電池のみの導入は対象外．非FIT・非FIP条件，製品要件及び容量上限は自治体資料及び県共通案内の根拠全文に保存．",
            "別表の交付申請期限は「補助事業完了から30日又は2026-12-28」，事前申請・着手案内との関係は未確認．記述を消さず独立レビュー対象に保持．原文の着手届，実績報告の相対期限，併用禁止の適用範囲を監査抜粋に保持．",
            "併用不可：国費による同一対象事業への重複助成禁止を含む．自治体ごとの原文範囲は監査抜粋を参照し，併用可へ一括補完しない．\n上限：個別の金額式のとおり．他制度との共通上限は未確認．",
            "本人所有・本人居住の戸建を仮定．公式に住宅所有の限定がない場合は仮定として区別．"
          ],
          "required_confirmations": [
            "非FIT・非FIPの新設PV（蓄電池は同時導入）を要する県連携制度のためFIT診断へ非算入．原式・全文根拠・市町固有の期限を保持．補助対象経費の費目，併用禁止範囲，手続・完了期限の逐条統合は添付原文抜粋に残し，独立検収まで検証完了としない．",
            "最新の受付・予算残高，対象機種・資格・申請順序を申請時に確認する．",
            "交付申請受付：開始日未確認〜2026-12-28．工事完了・実績報告の期限とは別．"
          ],
          "source_ids": [
            "kansai-02-aomori-02445-self-consumption-pv-2026-source-1",
            "kansai-02-aomori-02445-self-consumption-pv-2026-source-2",
            "kansai-02-aomori-02445-self-consumption-pv-2026-source-3",
            "kansai-02-aomori-02445-self-consumption-pv-2026-source-4",
            "kansai-02-aomori-02445-self-consumption-pv-2026-source-5",
            "kansai-02-aomori-02445-self-consumption-pv-2026-source-6"
          ],
          "machine_rule": "kansai_municipal_non_adopted",
          "non_adoption_status": "excluded",
          "non_adoption_reason_code": "official_conditions_not_applicable",
          "fit_compatible": false
        }
      ],
      "institutionalSource": "cea4a98dd28664f9009d43bdec7d66feda795be90ec08255d476e30ed6bdb1a6",
      "sections": [
        {
          "label": "太陽光",
          "text": "太陽光の税抜対象経費の実支出額と太陽光の対象出力に1kWあたり5万円を掛けた額のうち，低い額以内です．",
          "supplement": [
            "（算定対象）出力の基準：モジュールとパワーコンディショナーの小さい方",
            "（上限）25万円",
            "（端数処理）1kW未満切り捨て",
            "（端数処理）1,000円未満切り捨て"
          ]
        }
      ],
      "text": "太陽光の税抜対象経費の実支出額と太陽光の対象出力に1kWあたり5万円を掛けた額のうち，低い額以内です．",
      "supplement": [
        "（算定対象）出力の基準：モジュールとパワーコンディショナーの小さい方",
        "（上限）25万円",
        "（端数処理）1kW未満切り捨て",
        "（端数処理）1,000円未満切り捨て"
      ],
      "commonSupplement": [],
      "equipment": "太陽光のみ"
    },
    "aomori-02445-self-consumption-battery-2026": {
      "prefecture": "02",
      "municipality": "02445",
      "recordId": "scheme-f53466b941db4f49bb7c635e2d841afa",
      "targetYear": "2026",
      "branch": {
        "branch_id": "aomori-02445-self-consumption-battery-2026",
        "diagnostic_rule_ids": [
          "aomori-02445-self-consumption-battery-2026"
        ],
        "target_equipment": [
          "蓄電池"
        ],
        "application_start": [
          {
            "branch_id": "aomori-02445-self-consumption-battery-2026",
            "label": "交付申請",
            "date": ""
          }
        ],
        "application_end": [
          {
            "branch_id": "aomori-02445-self-consumption-battery-2026",
            "label": "交付申請",
            "date": "2026-12-28"
          }
        ],
        "application_status": "受付中",
        "amount": {
          "display_text": "工事費込みの税抜蓄電池対象経費の実支出額の3分の1，蓄電容量に1kWh当たり14.1万円を掛けた額の3分の1，35万円のうち最も低い額以内です．蓄電容量は0.1kWh単位で切り捨て，補助額の千円未満を切り捨てます．1kWh当たり14.1万円は対象経費の上限単価で，補助単価ではありません．",
          "evidence_status": "partial"
        },
        "official_conditions": [],
        "gaps": [],
        "evidence_urls": [
          "https://www.town.aomori-nanbu.lg.jp//page/11605.html",
          "https://www.town.aomori-nanbu.lg.jp/uploaded/attachment/7991.pdf",
          "https://www.town.aomori-nanbu.lg.jp/uploaded/attachment/7992.pdf",
          "https://www.town.aomori-nanbu.lg.jp/uploaded/attachment/8005.pdf",
          "https://aomori-taiyoko.pref.aomori.lg.jp/residential/",
          "https://aomori-taiyoko.pref.aomori.lg.jp/residential/status/"
        ],
        "checked_at": "2026-09-27",
        "display_basis": "preparing",
        "migration_status": "pending_review",
        "legacy_municipal_rule_ids": []
      },
      "catalogAmount": {
        "raw_text": "蓄電池原式：税抜対象経費実支出額の1/3，蓄電容量×141,000円/kWhの1/3，350,000円の最小額以内．工事費込み．14.1万円/kWhは補助単価でなく対象経費上限．蓄電容量は小数第2位以下切捨て（0.1kWh単位）．金額は千円未満切捨て．",
        "display_text": "工事費込みの税抜蓄電池対象経費の実支出額の3分の1，蓄電容量に1kWh当たり14.1万円を掛けた額の3分の1，35万円のうち最も低い額以内です．蓄電容量は0.1kWh単位で切り捨て，補助額の千円未満を切り捨てます．1kWh当たり14.1万円は対象経費の上限単価で，補助単価ではありません．",
        "evidence_status": "partial"
      },
      "rules": [
        {
          "id": "aomori-02445-self-consumption-battery-2026",
          "government_level": "municipality",
          "prefecture_code": "02",
          "municipality_code": "02445",
          "program_name": "南部町住宅用自家消費型太陽光発電設備等導入支援事業費補助金",
          "housing_ages": [
            "existing",
            "new"
          ],
          "equipment_packages": [
            "solar_plus_standard_battery"
          ],
          "application_status": "accepting",
          "diagnostic_scope": {
            "status": "in_scope",
            "in_scope_housing_ages": [
              "existing",
              "new"
            ],
            "excluded_branch_ids": [],
            "basis": "非FIT・非FIPの新設PV（蓄電池は同時導入）を要する県連携制度のためFIT診断へ非算入．原式・全文根拠・市町固有の期限を保持．補助対象経費の費目，併用禁止範囲，手続・完了期限の逐条統合は添付原文抜粋に残し，独立検収まで検証完了としない．"
          },
          "expense_scopes": [
            "battery"
          ],
          "conflict_program_ids": [],
          "official_urls": [
            "https://www.town.aomori-nanbu.lg.jp//page/11605.html",
            "https://www.town.aomori-nanbu.lg.jp/uploaded/attachment/7991.pdf",
            "https://www.town.aomori-nanbu.lg.jp/uploaded/attachment/7992.pdf",
            "https://www.town.aomori-nanbu.lg.jp/uploaded/attachment/8005.pdf",
            "https://aomori-taiyoko.pref.aomori.lg.jp/residential/",
            "https://aomori-taiyoko.pref.aomori.lg.jp/residential/status/"
          ],
          "confirmed_at": "2026-09-27",
          "calculation_assumptions": [
            "本人所有・本人居住の戸建1戸をモデルとして採用．住宅性能の個別条件は対象設備・その他条件に記す．",
            "本人居住の個人を検討対象とし，資料で定める住民登録・税等要件は充足を仮定．他の属性は原文の条件を参照し推測で追加しない．",
            "住宅用自家消費型PV．蓄電池のみの導入は対象外．非FIT・非FIP条件，製品要件及び容量上限は自治体資料及び県共通案内の根拠全文に保存．",
            "別表の交付申請期限は「補助事業完了から30日又は2026-12-28」，事前申請・着手案内との関係は未確認．記述を消さず独立レビュー対象に保持．原文の着手届，実績報告の相対期限，併用禁止の適用範囲を監査抜粋に保持．",
            "併用不可：国費による同一対象事業への重複助成禁止を含む．自治体ごとの原文範囲は監査抜粋を参照し，併用可へ一括補完しない．\n上限：個別の金額式のとおり．他制度との共通上限は未確認．",
            "本人所有・本人居住の戸建を仮定．公式に住宅所有の限定がない場合は仮定として区別．"
          ],
          "required_confirmations": [
            "非FIT・非FIPの新設PV（蓄電池は同時導入）を要する県連携制度のためFIT診断へ非算入．原式・全文根拠・市町固有の期限を保持．補助対象経費の費目，併用禁止範囲，手続・完了期限の逐条統合は添付原文抜粋に残し，独立検収まで検証完了としない．",
            "最新の受付・予算残高，対象機種・資格・申請順序を申請時に確認する．",
            "交付申請受付：開始日未確認〜2026-12-28．工事完了・実績報告の期限とは別．"
          ],
          "source_ids": [
            "kansai-02-aomori-02445-self-consumption-battery-2026-source-1",
            "kansai-02-aomori-02445-self-consumption-battery-2026-source-2",
            "kansai-02-aomori-02445-self-consumption-battery-2026-source-3",
            "kansai-02-aomori-02445-self-consumption-battery-2026-source-4",
            "kansai-02-aomori-02445-self-consumption-battery-2026-source-5",
            "kansai-02-aomori-02445-self-consumption-battery-2026-source-6"
          ],
          "machine_rule": "kansai_municipal_non_adopted",
          "non_adoption_status": "excluded",
          "non_adoption_reason_code": "official_conditions_not_applicable",
          "fit_compatible": false
        }
      ],
      "institutionalSource": "e5a84c939df2777093d9c13baacbea1076cc46a96e16133779d62e53696584d5",
      "sections": [
        {
          "label": "蓄電池",
          "text": "工事費込みの税抜蓄電池対象経費の実支出額の3分の1と蓄電池の対象容量に1kWhあたり14万1,000円を掛けた額の3分の1のうち，低い額以内です．",
          "supplement": [
            "（上限）35万円",
            "（端数処理）0.1kWh未満切り捨て",
            "（端数処理）1,000円未満切り捨て"
          ]
        }
      ],
      "text": "工事費込みの税抜蓄電池対象経費の実支出額の3分の1と蓄電池の対象容量に1kWhあたり14万1,000円を掛けた額の3分の1のうち，低い額以内です．",
      "supplement": [
        "（上限）35万円",
        "（端数処理）0.1kWh未満切り捨て",
        "（端数処理）1,000円未満切り捨て"
      ],
      "commonSupplement": [],
      "equipment": "蓄電池のみ"
    },
    "aomori-02446-self-consumption-pv-2026": {
      "prefecture": "02",
      "municipality": "02446",
      "recordId": "scheme-efb890f84b73407bb8f83f1e51aede84",
      "targetYear": "2026",
      "branch": {
        "branch_id": "aomori-02446-self-consumption-pv-2026",
        "diagnostic_rule_ids": [
          "aomori-02446-self-consumption-pv-2026"
        ],
        "target_equipment": [
          "太陽光パネル"
        ],
        "application_start": [
          {
            "branch_id": "aomori-02446-self-consumption-pv-2026",
            "label": "交付申請",
            "date": "2026-06-10"
          }
        ],
        "application_end": [
          {
            "branch_id": "aomori-02446-self-consumption-pv-2026",
            "label": "交付申請",
            "date": "2026-12-28"
          }
        ],
        "application_status": "受付中",
        "amount": {
          "display_text": "太陽光の税抜対象経費の実支出額，出力1kW当たり5万円の額，25万円のうち最も低い額以内です．出力はモジュールとパワーコンディショナーの小さい方を整数kWに切り捨てた値です．補助額の千円未満を切り捨てます．",
          "evidence_status": "partial"
        },
        "official_conditions": [],
        "gaps": [],
        "evidence_urls": [
          "http://www.town.hashikami.lg.jp/index.cfm/7,25573,27,html",
          "http://www.town.hashikami.lg.jp/index.cfm/7,25573,c,html/25573/20260609-125201.pdf",
          "http://www.town.hashikami.lg.jp/index.cfm/7,25573,c,html/25573/20260609-125322.pdf",
          "http://www.town.hashikami.lg.jp/index.cfm/7,25573,c,html/25573/20260610-124123.pdf",
          "https://aomori-taiyoko.pref.aomori.lg.jp/residential/",
          "https://aomori-taiyoko.pref.aomori.lg.jp/residential/status/"
        ],
        "checked_at": "2026-09-27",
        "display_basis": "preparing",
        "migration_status": "pending_review",
        "legacy_municipal_rule_ids": []
      },
      "catalogAmount": {
        "raw_text": "PV原式：対象経費の実支出額，5万円/kWに応じた額，25万円の最小額以内．税抜対象経費を用いる．出力はモジュールとPCSの小さい値をkW単位で整数切捨て（自治体案内・手引）．金額は千円未満切捨て．",
        "display_text": "太陽光の税抜対象経費の実支出額，出力1kW当たり5万円の額，25万円のうち最も低い額以内です．出力はモジュールとパワーコンディショナーの小さい方を整数kWに切り捨てた値です．補助額の千円未満を切り捨てます．",
        "evidence_status": "partial"
      },
      "rules": [
        {
          "id": "aomori-02446-self-consumption-pv-2026",
          "government_level": "municipality",
          "prefecture_code": "02",
          "municipality_code": "02446",
          "program_name": "階上町住宅用自家消費型太陽光発電設備等導入支援事業費補助金",
          "housing_ages": [
            "existing",
            "new"
          ],
          "equipment_packages": [
            "solar_only",
            "solar_plus_standard_battery"
          ],
          "application_status": "accepting",
          "diagnostic_scope": {
            "status": "in_scope",
            "in_scope_housing_ages": [
              "existing",
              "new"
            ],
            "excluded_branch_ids": [],
            "basis": "非FIT・非FIPの新設PV（蓄電池は同時導入）を要する県連携制度のためFIT診断へ非算入．原式・全文根拠・市町固有の期限を保持．補助対象経費の費目，併用禁止範囲，手続・完了期限の逐条統合は添付原文抜粋に残し，独立検収まで検証完了としない．"
          },
          "expense_scopes": [
            "solar"
          ],
          "conflict_program_ids": [],
          "official_urls": [
            "http://www.town.hashikami.lg.jp/index.cfm/7,25573,27,html",
            "http://www.town.hashikami.lg.jp/index.cfm/7,25573,c,html/25573/20260609-125201.pdf",
            "http://www.town.hashikami.lg.jp/index.cfm/7,25573,c,html/25573/20260609-125322.pdf",
            "http://www.town.hashikami.lg.jp/index.cfm/7,25573,c,html/25573/20260610-124123.pdf",
            "https://aomori-taiyoko.pref.aomori.lg.jp/residential/",
            "https://aomori-taiyoko.pref.aomori.lg.jp/residential/status/"
          ],
          "confirmed_at": "2026-09-27",
          "calculation_assumptions": [
            "本人所有・本人居住の戸建1戸をモデルとして採用．住宅性能の個別条件は対象設備・その他条件に記す．",
            "本人居住の個人を検討対象とし，資料で定める住民登録・税等要件は充足を仮定．他の属性は原文の条件を参照し推測で追加しない．",
            "住宅用自家消費型PV．蓄電池のみの導入は対象外．非FIT・非FIP条件，製品要件及び容量上限は自治体資料及び県共通案内の根拠全文に保存．",
            "原文の着手届，実績報告の相対期限，併用禁止の適用範囲を監査抜粋に保持．",
            "併用不可：国費による同一対象事業への重複助成禁止を含む．自治体ごとの原文範囲は監査抜粋を参照し，併用可へ一括補完しない．\n上限：個別の金額式のとおり．他制度との共通上限は未確認．",
            "本人所有・本人居住の戸建を仮定．公式に住宅所有の限定がない場合は仮定として区別．"
          ],
          "required_confirmations": [
            "非FIT・非FIPの新設PV（蓄電池は同時導入）を要する県連携制度のためFIT診断へ非算入．原式・全文根拠・市町固有の期限を保持．補助対象経費の費目，併用禁止範囲，手続・完了期限の逐条統合は添付原文抜粋に残し，独立検収まで検証完了としない．",
            "最新の受付・予算残高，対象機種・資格・申請順序を申請時に確認する．",
            "交付申請受付：2026-06-10〜2026-12-28．工事完了・実績報告の期限とは別．"
          ],
          "source_ids": [
            "kansai-02-aomori-02446-self-consumption-pv-2026-source-1",
            "kansai-02-aomori-02446-self-consumption-pv-2026-source-2",
            "kansai-02-aomori-02446-self-consumption-pv-2026-source-3",
            "kansai-02-aomori-02446-self-consumption-pv-2026-source-4",
            "kansai-02-aomori-02446-self-consumption-pv-2026-source-5",
            "kansai-02-aomori-02446-self-consumption-pv-2026-source-6"
          ],
          "machine_rule": "kansai_municipal_non_adopted",
          "non_adoption_status": "excluded",
          "non_adoption_reason_code": "official_conditions_not_applicable",
          "fit_compatible": false
        }
      ],
      "institutionalSource": "fbb48fbe975f647551a526067f3f4ed7323a1b5171e675693f081d20b96d1d7f",
      "sections": [
        {
          "label": "太陽光",
          "text": "太陽光の税抜対象経費の実支出額と太陽光の対象出力に1kWあたり5万円を掛けた額のうち，低い額以内です．",
          "supplement": [
            "（算定対象）出力の基準：モジュールとパワーコンディショナーの小さい方",
            "（上限）25万円",
            "（端数処理）1kW未満切り捨て",
            "（端数処理）1,000円未満切り捨て"
          ]
        }
      ],
      "text": "太陽光の税抜対象経費の実支出額と太陽光の対象出力に1kWあたり5万円を掛けた額のうち，低い額以内です．",
      "supplement": [
        "（算定対象）出力の基準：モジュールとパワーコンディショナーの小さい方",
        "（上限）25万円",
        "（端数処理）1kW未満切り捨て",
        "（端数処理）1,000円未満切り捨て"
      ],
      "commonSupplement": [],
      "equipment": "太陽光のみ"
    },
    "aomori-02446-self-consumption-battery-2026": {
      "prefecture": "02",
      "municipality": "02446",
      "recordId": "scheme-efb890f84b73407bb8f83f1e51aede84",
      "targetYear": "2026",
      "branch": {
        "branch_id": "aomori-02446-self-consumption-battery-2026",
        "diagnostic_rule_ids": [
          "aomori-02446-self-consumption-battery-2026"
        ],
        "target_equipment": [
          "蓄電池"
        ],
        "application_start": [
          {
            "branch_id": "aomori-02446-self-consumption-battery-2026",
            "label": "交付申請",
            "date": "2026-06-10"
          }
        ],
        "application_end": [
          {
            "branch_id": "aomori-02446-self-consumption-battery-2026",
            "label": "交付申請",
            "date": "2026-12-28"
          }
        ],
        "application_status": "受付中",
        "amount": {
          "display_text": "工事費込みの税抜蓄電池対象経費の実支出額の3分の1，蓄電容量に1kWh当たり14.1万円を掛けた額の3分の1，35万円のうち最も低い額以内です．蓄電容量は0.1kWh単位で切り捨て，補助額の千円未満を切り捨てます．1kWh当たり14.1万円は対象経費の上限単価で，補助単価ではありません．",
          "evidence_status": "partial"
        },
        "official_conditions": [],
        "gaps": [],
        "evidence_urls": [
          "http://www.town.hashikami.lg.jp/index.cfm/7,25573,27,html",
          "http://www.town.hashikami.lg.jp/index.cfm/7,25573,c,html/25573/20260609-125201.pdf",
          "http://www.town.hashikami.lg.jp/index.cfm/7,25573,c,html/25573/20260609-125322.pdf",
          "http://www.town.hashikami.lg.jp/index.cfm/7,25573,c,html/25573/20260610-124123.pdf",
          "https://aomori-taiyoko.pref.aomori.lg.jp/residential/",
          "https://aomori-taiyoko.pref.aomori.lg.jp/residential/status/"
        ],
        "checked_at": "2026-09-27",
        "display_basis": "preparing",
        "migration_status": "pending_review",
        "legacy_municipal_rule_ids": []
      },
      "catalogAmount": {
        "raw_text": "蓄電池原式：税抜対象経費実支出額の1/3，蓄電容量×141,000円/kWhの1/3，350,000円の最小額以内．工事費込み．14.1万円/kWhは補助単価でなく対象経費上限．蓄電容量は小数第2位以下切捨て（0.1kWh単位）．金額は千円未満切捨て．",
        "display_text": "工事費込みの税抜蓄電池対象経費の実支出額の3分の1，蓄電容量に1kWh当たり14.1万円を掛けた額の3分の1，35万円のうち最も低い額以内です．蓄電容量は0.1kWh単位で切り捨て，補助額の千円未満を切り捨てます．1kWh当たり14.1万円は対象経費の上限単価で，補助単価ではありません．",
        "evidence_status": "partial"
      },
      "rules": [
        {
          "id": "aomori-02446-self-consumption-battery-2026",
          "government_level": "municipality",
          "prefecture_code": "02",
          "municipality_code": "02446",
          "program_name": "階上町住宅用自家消費型太陽光発電設備等導入支援事業費補助金",
          "housing_ages": [
            "existing",
            "new"
          ],
          "equipment_packages": [
            "solar_plus_standard_battery"
          ],
          "application_status": "accepting",
          "diagnostic_scope": {
            "status": "in_scope",
            "in_scope_housing_ages": [
              "existing",
              "new"
            ],
            "excluded_branch_ids": [],
            "basis": "非FIT・非FIPの新設PV（蓄電池は同時導入）を要する県連携制度のためFIT診断へ非算入．原式・全文根拠・市町固有の期限を保持．補助対象経費の費目，併用禁止範囲，手続・完了期限の逐条統合は添付原文抜粋に残し，独立検収まで検証完了としない．"
          },
          "expense_scopes": [
            "battery"
          ],
          "conflict_program_ids": [],
          "official_urls": [
            "http://www.town.hashikami.lg.jp/index.cfm/7,25573,27,html",
            "http://www.town.hashikami.lg.jp/index.cfm/7,25573,c,html/25573/20260609-125201.pdf",
            "http://www.town.hashikami.lg.jp/index.cfm/7,25573,c,html/25573/20260609-125322.pdf",
            "http://www.town.hashikami.lg.jp/index.cfm/7,25573,c,html/25573/20260610-124123.pdf",
            "https://aomori-taiyoko.pref.aomori.lg.jp/residential/",
            "https://aomori-taiyoko.pref.aomori.lg.jp/residential/status/"
          ],
          "confirmed_at": "2026-09-27",
          "calculation_assumptions": [
            "本人所有・本人居住の戸建1戸をモデルとして採用．住宅性能の個別条件は対象設備・その他条件に記す．",
            "本人居住の個人を検討対象とし，資料で定める住民登録・税等要件は充足を仮定．他の属性は原文の条件を参照し推測で追加しない．",
            "住宅用自家消費型PV．蓄電池のみの導入は対象外．非FIT・非FIP条件，製品要件及び容量上限は自治体資料及び県共通案内の根拠全文に保存．",
            "原文の着手届，実績報告の相対期限，併用禁止の適用範囲を監査抜粋に保持．",
            "併用不可：国費による同一対象事業への重複助成禁止を含む．自治体ごとの原文範囲は監査抜粋を参照し，併用可へ一括補完しない．\n上限：個別の金額式のとおり．他制度との共通上限は未確認．",
            "本人所有・本人居住の戸建を仮定．公式に住宅所有の限定がない場合は仮定として区別．"
          ],
          "required_confirmations": [
            "非FIT・非FIPの新設PV（蓄電池は同時導入）を要する県連携制度のためFIT診断へ非算入．原式・全文根拠・市町固有の期限を保持．補助対象経費の費目，併用禁止範囲，手続・完了期限の逐条統合は添付原文抜粋に残し，独立検収まで検証完了としない．",
            "最新の受付・予算残高，対象機種・資格・申請順序を申請時に確認する．",
            "交付申請受付：2026-06-10〜2026-12-28．工事完了・実績報告の期限とは別．"
          ],
          "source_ids": [
            "kansai-02-aomori-02446-self-consumption-battery-2026-source-1",
            "kansai-02-aomori-02446-self-consumption-battery-2026-source-2",
            "kansai-02-aomori-02446-self-consumption-battery-2026-source-3",
            "kansai-02-aomori-02446-self-consumption-battery-2026-source-4",
            "kansai-02-aomori-02446-self-consumption-battery-2026-source-5",
            "kansai-02-aomori-02446-self-consumption-battery-2026-source-6"
          ],
          "machine_rule": "kansai_municipal_non_adopted",
          "non_adoption_status": "excluded",
          "non_adoption_reason_code": "official_conditions_not_applicable",
          "fit_compatible": false
        }
      ],
      "institutionalSource": "9f32ea4015f055f3e05b974f95862eb71dfa0386fc2fceeffb1cbbba891a48d6",
      "sections": [
        {
          "label": "蓄電池",
          "text": "工事費込みの税抜蓄電池対象経費の実支出額の3分の1と蓄電池の対象容量に1kWhあたり14万1,000円を掛けた額の3分の1のうち，低い額以内です．",
          "supplement": [
            "（上限）35万円",
            "（端数処理）0.1kWh未満切り捨て",
            "（端数処理）1,000円未満切り捨て"
          ]
        }
      ],
      "text": "工事費込みの税抜蓄電池対象経費の実支出額の3分の1と蓄電池の対象容量に1kWhあたり14万1,000円を掛けた額の3分の1のうち，低い額以内です．",
      "supplement": [
        "（上限）35万円",
        "（端数処理）0.1kWh未満切り捨て",
        "（端数処理）1,000円未満切り捨て"
      ],
      "commonSupplement": [],
      "equipment": "蓄電池のみ"
    },
    "sai-renewable-residential-2026": {
      "prefecture": "02",
      "municipality": "02426",
      "recordId": "scheme-d9b53cbdd2ea4fac97ba1a7315d847c2",
      "targetYear": "2026",
      "branch": {
        "branch_id": "sai-renewable-residential-2026",
        "diagnostic_rule_ids": [
          "sai-renewable-residential-2026"
        ],
        "target_equipment": [
          "太陽光パネル",
          "蓄電池"
        ],
        "application_start": [
          {
            "branch_id": "sai-renewable-residential-2026",
            "label": "交付申請",
            "date": ""
          }
        ],
        "application_end": [
          {
            "branch_id": "sai-renewable-residential-2026",
            "label": "交付申請",
            "date": ""
          }
        ],
        "application_status": "受付中",
        "amount": {
          "display_text": "各設備の要綱別表第4条の対象経費に対し，太陽光は3分の2，蓄電池とV2Hは4分の3です．設備ごとに補助額の千円未満を切り捨て，各算出額の合計上限は300万円です．V2Hも同じ合計上限に含まれます．",
          "evidence_status": "partial"
        },
        "official_conditions": [],
        "gaps": [],
        "evidence_urls": [
          "https://www.vill.sai.lg.jp/status-initiatives/decarbonization/",
          "https://www.vill.sai.lg.jp/reiki_int/reiki_honbun/c057RG00000946.html"
        ],
        "checked_at": "2026-09-27",
        "display_basis": "preparing",
        "migration_status": "pending_review",
        "legacy_municipal_rule_ids": []
      },
      "catalogAmount": {
        "raw_text": "PV＝1,000×floor((2/3)×Cp/1,000)，蓄電池＝1,000×floor((3/4)×Cb/1,000)，V2H＝1,000×floor((3/4)×Cv/1,000)円．Cp，Cb，Cvは各設備の要綱別表第4条所定対象経費．各算出額の合計上限3,000,000円．V2Hは診断設備外だが共有上限・原式を保持する．",
        "display_text": "各設備の要綱別表第4条の対象経費に対し，太陽光は3分の2，蓄電池とV2Hは4分の3です．設備ごとに補助額の千円未満を切り捨て，各算出額の合計上限は300万円です．V2Hも同じ合計上限に含まれます．",
        "evidence_status": "partial"
      },
      "rules": [
        {
          "id": "sai-renewable-residential-2026",
          "government_level": "municipality",
          "prefecture_code": "02",
          "municipality_code": "02426",
          "program_name": "佐井村太陽光発電等再エネ設備導入補助金（一般住宅対象）",
          "housing_ages": [
            "existing",
            "new"
          ],
          "equipment_packages": [
            "solar_only",
            "solar_plus_standard_battery"
          ],
          "application_status": "accepting",
          "diagnostic_scope": {
            "status": "in_scope",
            "in_scope_housing_ages": [
              "existing",
              "new"
            ],
            "excluded_branch_ids": [],
            "basis": "PV新設時の非FIT・非FIP条件により現行FIT＋新規設備診断には非算入．既設再エネへの蓄電池追加経路にまで非FITを一般化しない．年度受付期限・残予算及び税区分は未確認．"
          },
          "expense_scopes": [
            "solar",
            "battery"
          ],
          "conflict_program_ids": [],
          "official_urls": [
            "https://www.vill.sai.lg.jp/status-initiatives/decarbonization/",
            "https://www.vill.sai.lg.jp/reiki_int/reiki_honbun/c057RG00000946.html"
          ],
          "confirmed_at": "2026-09-27",
          "calculation_assumptions": [
            "本人所有・本人居住の戸建1戸をモデルとして採用．住宅性能の個別条件は対象設備・その他条件に記す．",
            "本人居住の個人を検討対象とし，資料で定める住民登録・税等要件は充足を仮定．他の属性は原文の条件を参照し推測で追加しない．",
            "PVは最大出力合計kWの小数点以下切捨てで2kW以上50kW未満，新品等．蓄電池は再エネ設備に接続，平時充放電，家庭用20kWh未満の場合の安全基準・10年以上保証等．",
            "一般住宅は常時居住する専用住宅．併用住宅・賃貸大家等は事業者対象で別枠（一般住宅の上限を転用しない）．PV新設は非FIT・非FIP，PPA・リース不可．新設・増設・入替・設置済住宅購入を含む公式範囲から診断は新設に限定．",
            "併用不可：確認資料に明記なし．相手制度側の制限を別途適用．\n上限：個別の金額式のとおり．他制度との共通上限は未確認．",
            "本人所有・本人居住の戸建を仮定．公式に住宅所有の限定がない場合は仮定として区別．"
          ],
          "required_confirmations": [
            "PV新設時の非FIT・非FIP条件により現行FIT＋新規設備診断には非算入．既設再エネへの蓄電池追加経路にまで非FITを一般化しない．年度受付期限・残予算及び税区分は未確認．",
            "最新の受付・予算残高，対象機種・資格・申請順序を申請時に確認する．",
            "交付申請受付：開始日未確認〜固定締切日未確認．工事完了・実績報告の期限とは別．"
          ],
          "source_ids": [
            "kansai-02-sai-renewable-residential-2026-source-1",
            "kansai-02-sai-renewable-residential-2026-source-2"
          ],
          "machine_rule": "kansai_municipal_non_adopted",
          "non_adoption_status": "excluded",
          "non_adoption_reason_code": "official_conditions_not_applicable"
        }
      ],
      "institutionalSource": "35fcfe495a03917eb6ed66861ea116ea362b50b32bc15dd4f7ec6eb274a08356",
      "sections": [
        {
          "label": "太陽光",
          "text": "太陽光の要綱別表第4条の対象経費の3分の2です．",
          "supplement": [
            "（端数処理）1,000円未満切り捨て"
          ]
        },
        {
          "label": "蓄電池",
          "text": "蓄電池の要綱別表第4条の対象経費の4分の3です．",
          "supplement": [
            "（端数処理）1,000円未満切り捨て"
          ]
        }
      ],
      "text": "太陽光：太陽光の要綱別表第4条の対象経費の3分の2です．\n蓄電池：蓄電池の要綱別表第4条の対象経費の4分の3です．",
      "supplement": [
        "（共通上限）太陽光・蓄電池・V2Hの合計で300万円"
      ],
      "commonSupplement": [
        "（共通上限）太陽光・蓄電池・V2Hの合計で300万円"
      ],
      "equipment": "太陽光・蓄電池"
    },
    "hokkaido-additional-fukagawa-reform-solar": {
      "prefecture": "01",
      "municipality": "01228",
      "recordId": "scheme-60e0973e6beb4a0092e1775aea721970",
      "targetYear": "2026年度",
      "branch": {
        "branch_id": "hokkaido-additional-fukagawa-reform-solar",
        "diagnostic_rule_ids": [
          "hokkaido-candidate-fukagawa-reform"
        ],
        "target_equipment": [
          "太陽光パネル"
        ],
        "application_start": [
          {
            "branch_id": "saved-period-1",
            "label": "保存期間1",
            "date": "2026-04-09"
          }
        ],
        "application_end": [
          {
            "branch_id": "saved-period-1",
            "label": "保存期間1",
            "date": "2026-09-30"
          }
        ],
        "application_status": "受付中",
        "amount": {
          "display_text": "税抜対象工事費の5分の1，上限20万円です．対象工事費30万円以上が必要です．",
          "evidence_status": "partial"
        },
        "official_conditions": [
          "既存住宅，店舗等併用の住宅部分．共同住宅・長屋・寄宿舎・下宿は対象外．",
          "所有者又は賃借人で市内居住又は移住予定．賃借人は所有者承諾必要．世帯全員の市税・水道・下水道料金非滞納．",
          "住宅の屋根・壁面・同一敷地内の太陽光発電設置．店舗部分対象外．",
          "市内業者（許可又は同等）施工．申請・交付決定後着工，2026-12-28完了，2027-01-29完了届．同一住宅原則年度1回．廃材処理費等除外．",
          "省エネ改修助成との併用不可．市の耐震・中古住宅取得助成と年度内併用可．他の国・道・市補助は原則対象外．"
        ],
        "gaps": [
          "端数処理，太陽光機器の詳細，費用配分及び他補助禁止の個別例外は未確認です．所有者と賃借人の申請経路を区別しています．"
        ],
        "evidence_urls": [
          "https://www.city.fukagawa.lg.jp/cms/section/kenchiku/ik75k4000000ecv6.html",
          "https://www.city.fukagawa.lg.jp/cms/section/kenchiku/ik75k4000000ecv6-att/ik75k4000000ed2k.pdf",
          "https://www.city.fukagawa.lg.jp/cms/section/kenchiku/ik75k4000000ecv6-att/uo2pli000000xcl1.pdf",
          "https://www.city.fukagawa.lg.jp/cms/section/kenchiku/ik75k4000000ecv6-att/ik75k4000000ed4y.pdf",
          "https://www.city.fukagawa.lg.jp/cms/section/kenchiku/ik75k4000000ecv6-att/ik75k4000000ed3l.pdf"
        ],
        "checked_at": "2026-09-29",
        "display_basis": "retained_reviewed_display",
        "migration_status": "pending_review",
        "model_assumptions": [],
        "legacy_municipal_rule_ids": []
      },
      "catalogAmount": {
        "raw_text": "対象工事費（税抜）1/5，上限20万円．対象工事費30万円以上．",
        "display_text": "税抜対象工事費の5分の1，上限20万円です．対象工事費30万円以上が必要です．",
        "evidence_status": "partial"
      },
      "rules": [
        {
          "id": "hokkaido-candidate-fukagawa-reform",
          "government_level": "municipality",
          "prefecture_code": "01",
          "municipality_code": "01228",
          "program_name": "深川市物価高騰対策住宅リフォーム助成（太陽光発電）",
          "housing_ages": [
            "existing"
          ],
          "equipment_packages": [
            "solar_only",
            "solar_plus_standard_battery"
          ],
          "application_status": "accepting",
          "diagnostic_scope": {
            "status": "in_scope",
            "in_scope_housing_ages": [
              "existing"
            ],
            "excluded_branch_ids": [],
            "basis": "税抜PV工事費のみで最低30万円を判定．廃材処理費等をモデルへ加えない．国・道・市他補助の原則禁止に従い同時採用しない．"
          },
          "machine_rule": "kansai_municipal_formula",
          "fit_compatible": true,
          "expense_scopes": [
            "solar"
          ],
          "conflict_program_ids": [
            "national-dr-battery-r7-supplement-2026",
            "national-zeh-new-detached-2026-battery",
            "national-mirai-eco-renovation-2026-battery"
          ],
          "official_urls": [
            "https://www.city.fukagawa.lg.jp/cms/section/kenchiku/ik75k4000000ecv6.html",
            "https://www.city.fukagawa.lg.jp/cms/section/kenchiku/ik75k4000000ecv6-att/ik75k4000000ed2k.pdf",
            "https://www.city.fukagawa.lg.jp/cms/section/kenchiku/ik75k4000000ecv6-att/uo2pli000000xcl1.pdf",
            "https://www.city.fukagawa.lg.jp/cms/section/kenchiku/ik75k4000000ecv6-att/ik75k4000000ed4y.pdf",
            "https://www.city.fukagawa.lg.jp/cms/section/kenchiku/ik75k4000000ecv6-att/ik75k4000000ed3l.pdf"
          ],
          "confirmed_at": "2026-09-30",
          "calculation_assumptions": [
            "確認済みの施工者・製品・本人属性・税非滞納・申請時期等の入力外条件を満たすモデル仮定．交付確約ではない．",
            "現行案内に終了・停止の明示がない範囲で受付継続を仮定．公式の年度・受付欄は変更しない．",
            "併用禁止未確認は計算上併用可能と仮定する．確認済み禁止・同一経費上限・明示控除は維持する．",
            "対象費の税区分未記載は税込モデル費に対応．公式の最終金額端数未確認は1円単位の概算とし，途中丸めを省略しない．",
            "税抜PV工事費のみで最低30万円を判定．廃材処理費等をモデルへ加えない．国・道・市他補助の原則禁止に従い同時採用しない．"
          ],
          "required_confirmations": [
            "税抜対象費，市内施工，対象住宅及び国・道・市の他補助との併用禁止・例外を確認してください．"
          ],
          "formula_components": [
            {
              "scope": "solar",
              "equipment_packages": [
                "solar_only",
                "solar_plus_standard_battery"
              ],
              "formula_type": "cost_fraction",
              "cost_scope": "solar",
              "cost_tax": "exclusive",
              "cap_yen": 200000,
              "rounding_unit_yen": 1,
              "deduct_other_subsidies": false,
              "fraction_numerator": 1,
              "fraction_denominator": 5,
              "eligible_cost_min_yen": 300000
            }
          ],
          "source_ids": [
            "hokkaido-additional-material-285022c557e615367489"
          ]
        }
      ],
      "institutionalSource": "db66bdd791f9b0d92f93a72459abe6bf29f3eb71eeb6769ca213c5b68a147e46",
      "sections": [
        {
          "label": "太陽光",
          "text": "税抜対象工事費の5分の1です．",
          "supplement": [
            "（上限）20万円"
          ]
        }
      ],
      "text": "税抜対象工事費の5分の1です．",
      "supplement": [
        "（上限）20万円"
      ],
      "commonSupplement": [],
      "equipment": "太陽光のみ"
    },
    "hokkaido-additional-haboro-reform-solar": {
      "prefecture": "01",
      "municipality": "01484",
      "recordId": "scheme-c4426f68166146d1ac13b866de9a7d2e",
      "targetYear": "2026年度",
      "branch": {
        "branch_id": "hokkaido-additional-haboro-reform-solar",
        "diagnostic_rule_ids": [
          "hokkaido-candidate-haboro-reform"
        ],
        "target_equipment": [
          "太陽光パネル"
        ],
        "application_start": [
          {
            "branch_id": "saved-period-1",
            "label": "保存期間1",
            "date": "2026-04-01"
          }
        ],
        "application_end": [
          {
            "branch_id": "saved-period-1",
            "label": "保存期間1",
            "date": "2026-10-30"
          }
        ],
        "application_status": "受付中",
        "amount": {
          "display_text": "税抜対象工事費100万円以上で，定額20万円．",
          "evidence_status": "partial"
        },
        "official_conditions": [
          "本人又は3親等以内親族所有かつ本人現住住宅．併用住宅居住部分のみ．賃貸・社宅・集合住宅除外．",
          "住民登録，町税・税外使用料滞納なし，本人同居親族が非暴力団員．",
          "現行本文リンクの対象工事一覧に太陽光発電施設設置を明記．",
          "登録町内施工業者．交付決定日以後に契約，決定14日以内に契約写し提出．着手前申請．2027/3/10完了，完了30日又は3/20早い日まで報告．R6～R8同一世帯1回．",
          "町の他の補助制度との併用不可（空き家改修・介護住宅改修・合併処理浄化槽等）．"
        ],
        "gaps": [
          "太陽光だけの工事で申請する場合は，その工事費で最低工事額を満たす必要があります．設計，敷地，外構，家具家電及び消費税は対象外です．容量細則，蓄電池の直接対象性及び国・道補助との併用は未確認です．予定40件ですが，期間内の適格申請は原則全件を対象とする方針です．"
        ],
        "evidence_urls": [
          "https://town.haboro.lg.jp/kurashi/kankyo/tochi-jyutaku/2024-0209-1627-25.html",
          "https://town.haboro.lg.jp/kurashi/kankyo/tochi-jyutaku/files/hojyotaisyoukouji.pdf"
        ],
        "checked_at": "2026-09-29",
        "display_basis": "retained_reviewed_display",
        "migration_status": "pending_review",
        "model_assumptions": [],
        "legacy_municipal_rule_ids": []
      },
      "catalogAmount": {
        "raw_text": "税抜対象工事100万円以上，定額20万円．",
        "display_text": "税抜対象工事費100万円以上で，定額20万円．",
        "evidence_status": "partial"
      },
      "rules": [
        {
          "id": "hokkaido-candidate-haboro-reform",
          "government_level": "municipality",
          "prefecture_code": "01",
          "municipality_code": "01484",
          "program_name": "住宅改修促進補助事業（太陽光）",
          "housing_ages": [
            "existing"
          ],
          "equipment_packages": [
            "solar_only",
            "solar_plus_standard_battery"
          ],
          "application_status": "accepting",
          "diagnostic_scope": {
            "status": "in_scope",
            "in_scope_housing_ages": [
              "existing"
            ],
            "excluded_branch_ids": [],
            "basis": "PV工事だけで税抜100万円を満たす場合．町内登録業者・事前申請等を仮定．町の他制度との併用は禁止し，今回他の羽幌候補は算入しない．"
          },
          "machine_rule": "kansai_municipal_formula",
          "fit_compatible": true,
          "expense_scopes": [
            "solar"
          ],
          "conflict_program_ids": [],
          "official_urls": [
            "https://town.haboro.lg.jp/kurashi/kankyo/tochi-jyutaku/2024-0209-1627-25.html",
            "https://town.haboro.lg.jp/kurashi/kankyo/tochi-jyutaku/files/hojyotaisyoukouji.pdf"
          ],
          "confirmed_at": "2026-09-30",
          "calculation_assumptions": [
            "確認済みの施工者・製品・本人属性・税非滞納・申請時期等の入力外条件を満たすモデル仮定．交付確約ではない．",
            "現行案内に終了・停止の明示がない範囲で受付継続を仮定．公式の年度・受付欄は変更しない．",
            "併用禁止未確認は計算上併用可能と仮定する．確認済み禁止・同一経費上限・明示控除は維持する．",
            "対象費の税区分未記載は税込モデル費に対応．公式の最終金額端数未確認は1円単位の概算とし，途中丸めを省略しない．",
            "PV工事だけで税抜100万円を満たす場合．町内登録業者・事前申請等を仮定．町の他制度との併用は禁止し，今回他の羽幌候補は算入しない．"
          ],
          "required_confirmations": [
            "税抜対象費100万円以上，登録町内業者，契約前の交付決定及び町の他制度との併用禁止を確認してください．"
          ],
          "formula_components": [
            {
              "scope": "solar",
              "equipment_packages": [
                "solar_only",
                "solar_plus_standard_battery"
              ],
              "formula_type": "fixed",
              "cost_scope": "solar",
              "cost_tax": "exclusive",
              "cap_yen": 200000,
              "rounding_unit_yen": 1000,
              "deduct_other_subsidies": false,
              "fixed_amount_yen": 200000,
              "eligible_cost_min_yen": 1000000
            }
          ],
          "source_ids": [
            "hokkaido-additional-material-ebea1df57c3b79d547e2"
          ]
        }
      ],
      "institutionalSource": "2333a64dae7280dc5bf07082783340895eb4564b9bda9e03ca6cb7c5e028523d",
      "sections": [
        {
          "label": "太陽光",
          "text": "20万円です．",
          "supplement": []
        }
      ],
      "text": "20万円です．",
      "supplement": [],
      "commonSupplement": [],
      "equipment": "太陽光のみ"
    },
    "hokkaido-additional-oumu-solar": {
      "prefecture": "01",
      "municipality": "01563",
      "recordId": "scheme-80ed3c981ea4480fb9c4fecad57fb402",
      "targetYear": "2026年度",
      "branch": {
        "branch_id": "hokkaido-additional-oumu-solar",
        "diagnostic_rule_ids": [
          "hokkaido-candidate-oumu-combined"
        ],
        "target_equipment": [
          "太陽光パネル"
        ],
        "application_start": [],
        "application_end": [],
        "application_status": "受付中",
        "amount": {
          "display_text": "税込対象経費の2分の1，上限30万円です．補助額の千円未満を切り捨てます．同一家屋又は土地につき1回，太陽光と蓄電池を含む共通の上限です．設備ごとに30万円を加算しません．",
          "evidence_status": "partial"
        },
        "official_conditions": [
          "町内所有自己居住・取得転入予定可．単身赴任等は同一世帯配偶者・子等居住可．世帯税非滞納．",
          "新品．太陽光は合計10kW未満で蓄電池接続・自家消費．蓄電池は太陽光常時接続，17.76kWh未満リチウムイオン（バインド電池含む）．太陽光モジュールは資源エネルギー庁「事業計画策定ガイドライン（太陽光発電）」に定めるJIS適合又は同等の性能及び品質を確認できること．太陽光は余剰型配線で，電力会社の電力系統に連系できること．",
          "着手前申請，完成後3年以上居住，2年月別電力量報告．集合住宅・寄宿舎・民泊除外．併用住宅は住宅部分．報告原文は完了日起算30日以内又は3月1日まで．既設機器の撤去に係る経費（撤去した機器等の処理費を含む）は補助対象外．",
          "国ZEH支援事業の交付・予定なし．快適住まいづくり促進条例とは対象経費が異なる場合併用可．"
        ],
        "gaps": [
          "新築・既存の区分，年間の申請期限及び記載した制度以外との併用は未確認です．機器の相互接続条件を，必ず同時に新設する条件とは読み替えていません．FIT禁止や除外費用の金額を推測で追加していません．"
        ],
        "evidence_urls": [
          "https://www.town.oumu.hokkaido.jp/kurashi_tetsuzuki/jutaku_teiju/4189.html",
          "https://www.town.oumu.hokkaido.jp/material/files/group/5/zerokouhuyoukou.docx",
          "https://www.town.oumu.hokkaido.jp/material/files/group/2/R8kurashinosiennjoho.pdf"
        ],
        "checked_at": "2026-09-29",
        "display_basis": "retained_reviewed_display",
        "migration_status": "pending_review",
        "model_assumptions": [],
        "legacy_municipal_rule_ids": []
      },
      "catalogAmount": {
        "raw_text": "税込対象経費の1/2，上限300000円，1000円未満切捨て．PV・蓄電池を含む同一家屋又は土地1回の共通上限であり別々に30万円を加算しない．",
        "display_text": "税込対象経費の2分の1，上限30万円です．補助額の千円未満を切り捨てます．同一家屋又は土地につき1回，太陽光と蓄電池を含む共通の上限です．設備ごとに30万円を加算しません．",
        "evidence_status": "partial"
      },
      "rules": [
        {
          "id": "hokkaido-candidate-oumu-combined",
          "government_level": "municipality",
          "prefecture_code": "01",
          "municipality_code": "01563",
          "program_name": "雄武町住まいのゼロカーボン化推進事業補助金",
          "housing_ages": [
            "existing",
            "new"
          ],
          "equipment_packages": [
            "solar_plus_standard_battery"
          ],
          "application_status": "accepting",
          "diagnostic_scope": {
            "status": "in_scope",
            "in_scope_housing_ages": [
              "existing",
              "new"
            ],
            "excluded_branch_ids": [],
            "basis": "確認した要綱に住宅年齢指定なしのため新築・既存を仮定．相互接続する新規PV+Bの経路を用い，共通30万円を1回適用．撤去処理費は加えず，国ZEHとの併用禁止を維持．"
          },
          "machine_rule": "kansai_municipal_formula",
          "fit_compatible": true,
          "expense_scopes": [
            "solar",
            "battery"
          ],
          "conflict_program_ids": [
            "national-zeh-new-detached-2026-battery"
          ],
          "official_urls": [
            "https://www.town.oumu.hokkaido.jp/kurashi_tetsuzuki/jutaku_teiju/4189.html",
            "https://www.town.oumu.hokkaido.jp/material/files/group/5/zerokouhuyoukou.docx",
            "https://www.town.oumu.hokkaido.jp/material/files/group/2/R8kurashinosiennjoho.pdf"
          ],
          "confirmed_at": "2026-09-30",
          "calculation_assumptions": [
            "確認済みの施工者・製品・本人属性・税非滞納・申請時期等の入力外条件を満たすモデル仮定．交付確約ではない．",
            "現行案内に終了・停止の明示がない範囲で受付継続を仮定．公式の年度・受付欄は変更しない．",
            "併用禁止未確認は計算上併用可能と仮定する．確認済み禁止・同一経費上限・明示控除は維持する．",
            "対象費の税区分未記載は税込モデル費に対応．公式の最終金額端数未確認は1円単位の概算とし，途中丸めを省略しない．",
            "確認した要綱に住宅年齢指定なしのため新築・既存を仮定．相互接続する新規PV+Bの経路を用い，共通30万円を1回適用．撤去処理費は加えず，国ZEHとの併用禁止を維持．",
            "同一工事の対象経費を合算して補助率と共通上限を適用し，最後に一度だけ千円未満を切り捨てる．費目配分は診断上の配分で，公式の設備別交付額ではない．"
          ],
          "required_confirmations": [
            "太陽光・蓄電池の適格性，相互接続，同一家屋等の共通上限，撤去費除外及び国ZEHとの併用禁止を確認してください．"
          ],
          "formula_components": [
            {
              "scope": "solar",
              "equipment_packages": [
                "solar_plus_standard_battery"
              ],
              "formula_type": "cost_fraction",
              "cost_scope": "solar",
              "cost_tax": "inclusive",
              "cap_yen": null,
              "rounding_unit_yen": 1000,
              "deduct_other_subsidies": false,
              "fraction_numerator": 1,
              "fraction_denominator": 2,
              "solar_output_max_kw_exclusive": 10,
              "defer_rounding_to_formula_total": true
            },
            {
              "scope": "battery",
              "equipment_packages": [
                "solar_plus_standard_battery"
              ],
              "formula_type": "cost_fraction",
              "cost_scope": "battery",
              "cost_tax": "inclusive",
              "cap_yen": null,
              "rounding_unit_yen": 1000,
              "deduct_other_subsidies": false,
              "fraction_numerator": 1,
              "fraction_denominator": 2,
              "solar_output_max_kw_exclusive": 10,
              "battery_capacity_max_kwh_exclusive": 17.76,
              "defer_rounding_to_formula_total": true
            }
          ],
          "formula_total": {
            "cost_scope": "combined",
            "cost_tax": "approved_assumption_inclusive",
            "fraction_numerator": null,
            "fraction_denominator": null,
            "cap_yen": 300000,
            "rounding_unit_yen": 1000
          },
          "source_ids": [
            "hokkaido-additional-material-6dd8891a0a7a58722095",
            "shiranuka-oumu-condition-b9538ba26e8c7ffc0394",
            "shiranuka-oumu-condition-90925893ec0056624ec8"
          ]
        }
      ],
      "institutionalSource": "1978c58d67d5dd6f69488f7fb01672cb2662e4ce4f0b3af8abedf3ddcb502bbb",
      "sections": [
        {
          "label": "太陽光",
          "text": "税込対象経費の2分の1です．",
          "supplement": [
            "（上限）30万円"
          ]
        }
      ],
      "text": "税込対象経費の2分の1です．",
      "supplement": [
        "（上限）30万円"
      ],
      "commonSupplement": [
        "（共通上限）太陽光・蓄電池の合計で30万円",
        "（端数処理）1,000円未満切り捨て"
      ],
      "equipment": "太陽光",
      "savedSourceDetails": true
    },
    "hokkaido-additional-oumu-battery": {
      "prefecture": "01",
      "municipality": "01563",
      "recordId": "scheme-80ed3c981ea4480fb9c4fecad57fb402",
      "targetYear": "2026年度",
      "branch": {
        "branch_id": "hokkaido-additional-oumu-battery",
        "diagnostic_rule_ids": [
          "hokkaido-candidate-oumu-combined"
        ],
        "target_equipment": [
          "蓄電池"
        ],
        "application_start": [],
        "application_end": [],
        "application_status": "受付中",
        "amount": {
          "display_text": "税込対象経費の2分の1，上限30万円です．補助額の千円未満を切り捨てます．同一家屋又は土地につき1回，太陽光と蓄電池を含む共通の上限です．設備ごとに30万円を加算しません．",
          "evidence_status": "partial"
        },
        "official_conditions": [
          "町内所有自己居住・取得転入予定可．単身赴任等は同一世帯配偶者・子等居住可．世帯税非滞納．",
          "新品．太陽光は合計10kW未満で蓄電池接続・自家消費．蓄電池は太陽光常時接続，17.76kWh未満リチウムイオン（バインド電池含む）．蓄電池は電力会社の電力系統に連系できること．",
          "着手前申請，完成後3年以上居住，2年月別電力量報告．集合住宅・寄宿舎・民泊除外．併用住宅は住宅部分．報告原文は完了日起算30日以内又は3月1日まで．既設機器の撤去に係る経費（撤去した機器等の処理費を含む）は補助対象外．",
          "国ZEH支援事業の交付・予定なし．快適住まいづくり促進条例とは対象経費が異なる場合併用可．"
        ],
        "gaps": [
          "新築・既存の区分，年間の申請期限及び記載した制度以外との併用は未確認です．機器の相互接続条件を，必ず同時に新設する条件とは読み替えていません．FIT禁止や除外費用の金額を推測で追加していません．"
        ],
        "evidence_urls": [
          "https://www.town.oumu.hokkaido.jp/kurashi_tetsuzuki/jutaku_teiju/4189.html",
          "https://www.town.oumu.hokkaido.jp/material/files/group/5/zerokouhuyoukou.docx",
          "https://www.town.oumu.hokkaido.jp/material/files/group/2/R8kurashinosiennjoho.pdf"
        ],
        "checked_at": "2026-09-29",
        "display_basis": "retained_reviewed_display",
        "migration_status": "pending_review",
        "model_assumptions": [],
        "legacy_municipal_rule_ids": []
      },
      "catalogAmount": {
        "raw_text": "税込対象経費の1/2，上限300000円，1000円未満切捨て．PV・蓄電池を含む同一家屋又は土地1回の共通上限であり別々に30万円を加算しない．",
        "display_text": "税込対象経費の2分の1，上限30万円です．補助額の千円未満を切り捨てます．同一家屋又は土地につき1回，太陽光と蓄電池を含む共通の上限です．設備ごとに30万円を加算しません．",
        "evidence_status": "partial"
      },
      "rules": [
        {
          "id": "hokkaido-candidate-oumu-combined",
          "government_level": "municipality",
          "prefecture_code": "01",
          "municipality_code": "01563",
          "program_name": "雄武町住まいのゼロカーボン化推進事業補助金",
          "housing_ages": [
            "existing",
            "new"
          ],
          "equipment_packages": [
            "solar_plus_standard_battery"
          ],
          "application_status": "accepting",
          "diagnostic_scope": {
            "status": "in_scope",
            "in_scope_housing_ages": [
              "existing",
              "new"
            ],
            "excluded_branch_ids": [],
            "basis": "確認した要綱に住宅年齢指定なしのため新築・既存を仮定．相互接続する新規PV+Bの経路を用い，共通30万円を1回適用．撤去処理費は加えず，国ZEHとの併用禁止を維持．"
          },
          "machine_rule": "kansai_municipal_formula",
          "fit_compatible": true,
          "expense_scopes": [
            "solar",
            "battery"
          ],
          "conflict_program_ids": [
            "national-zeh-new-detached-2026-battery"
          ],
          "official_urls": [
            "https://www.town.oumu.hokkaido.jp/kurashi_tetsuzuki/jutaku_teiju/4189.html",
            "https://www.town.oumu.hokkaido.jp/material/files/group/5/zerokouhuyoukou.docx",
            "https://www.town.oumu.hokkaido.jp/material/files/group/2/R8kurashinosiennjoho.pdf"
          ],
          "confirmed_at": "2026-09-30",
          "calculation_assumptions": [
            "確認済みの施工者・製品・本人属性・税非滞納・申請時期等の入力外条件を満たすモデル仮定．交付確約ではない．",
            "現行案内に終了・停止の明示がない範囲で受付継続を仮定．公式の年度・受付欄は変更しない．",
            "併用禁止未確認は計算上併用可能と仮定する．確認済み禁止・同一経費上限・明示控除は維持する．",
            "対象費の税区分未記載は税込モデル費に対応．公式の最終金額端数未確認は1円単位の概算とし，途中丸めを省略しない．",
            "確認した要綱に住宅年齢指定なしのため新築・既存を仮定．相互接続する新規PV+Bの経路を用い，共通30万円を1回適用．撤去処理費は加えず，国ZEHとの併用禁止を維持．",
            "同一工事の対象経費を合算して補助率と共通上限を適用し，最後に一度だけ千円未満を切り捨てる．費目配分は診断上の配分で，公式の設備別交付額ではない．"
          ],
          "required_confirmations": [
            "太陽光・蓄電池の適格性，相互接続，同一家屋等の共通上限，撤去費除外及び国ZEHとの併用禁止を確認してください．"
          ],
          "formula_components": [
            {
              "scope": "solar",
              "equipment_packages": [
                "solar_plus_standard_battery"
              ],
              "formula_type": "cost_fraction",
              "cost_scope": "solar",
              "cost_tax": "inclusive",
              "cap_yen": null,
              "rounding_unit_yen": 1000,
              "deduct_other_subsidies": false,
              "fraction_numerator": 1,
              "fraction_denominator": 2,
              "solar_output_max_kw_exclusive": 10,
              "defer_rounding_to_formula_total": true
            },
            {
              "scope": "battery",
              "equipment_packages": [
                "solar_plus_standard_battery"
              ],
              "formula_type": "cost_fraction",
              "cost_scope": "battery",
              "cost_tax": "inclusive",
              "cap_yen": null,
              "rounding_unit_yen": 1000,
              "deduct_other_subsidies": false,
              "fraction_numerator": 1,
              "fraction_denominator": 2,
              "solar_output_max_kw_exclusive": 10,
              "battery_capacity_max_kwh_exclusive": 17.76,
              "defer_rounding_to_formula_total": true
            }
          ],
          "formula_total": {
            "cost_scope": "combined",
            "cost_tax": "approved_assumption_inclusive",
            "fraction_numerator": null,
            "fraction_denominator": null,
            "cap_yen": 300000,
            "rounding_unit_yen": 1000
          },
          "source_ids": [
            "hokkaido-additional-material-6dd8891a0a7a58722095",
            "shiranuka-oumu-condition-b9538ba26e8c7ffc0394",
            "shiranuka-oumu-condition-90925893ec0056624ec8"
          ]
        }
      ],
      "institutionalSource": "191c6ab9adec6c994c60dff20c80b5925244b9a65f78a23e9e20f087b419256d",
      "sections": [
        {
          "label": "蓄電池",
          "text": "税込対象経費の2分の1です．",
          "supplement": [
            "（上限）30万円"
          ]
        }
      ],
      "text": "税込対象経費の2分の1です．",
      "supplement": [
        "（上限）30万円"
      ],
      "commonSupplement": [
        "（共通上限）太陽光・蓄電池の合計で30万円",
        "（端数処理）1,000円未満切り捨て"
      ],
      "equipment": "蓄電池",
      "savedSourceDetails": true
    },
    "hokkaido-obihiro-solar": {
      "prefecture": "01",
      "municipality": "01207",
      "recordId": "scheme-964a5eefcd9045ecb064174955c65c1f",
      "targetYear": "2026年度",
      "branch": {
        "branch_id": "hokkaido-obihiro-solar",
        "diagnostic_rule_ids": [
          "hokkaido-next-obihiro-solar-low",
          "hokkaido-next-obihiro-solar-high"
        ],
        "target_equipment": [
          "太陽光パネル"
        ],
        "application_start": [
          {
            "branch_id": "current",
            "label": "現行募集",
            "date": "2026-04-01"
          }
        ],
        "application_end": [
          {
            "branch_id": "current",
            "label": "現行募集",
            "date": "2027-01-29"
          }
        ],
        "application_status": "受付中",
        "amount": {
          "display_text": "モジュール合計とPCS出力の小さい値を0.01kW単位で切り捨てます．4kW以下は税込購入設置費の10分の1・上限5万円，4kW超は5万円＋4kW超過分1kW当たり1万円・上限10万9千円です．金額は千円未満切捨てです．",
          "evidence_status": "partial"
        },
        "official_conditions": [
          "市内に居住する又は実績報告までに居住予定の方が，自ら居住する住宅へ設置する場合が対象です．新築を含み，非所有者は所有者の承諾が必要です．",
          "市税の滞納がなく，暴力団等に該当せず，同一世帯で同じ設備への市補助を受けていないことが条件です．",
          "交付決定前に着工できません．保存された令和8年度募集は2026年4月1日〜2027年1月29日で，先着順・予算上限があります．実績報告は2027年3月31日までです．",
          "モジュール合計とPCS出力の小さい値が10kW未満で，低圧・逆潮流接続と電力受給契約を伴う新品の設備が対象です．「おひさまソーラーネット帯広」への入会が必要です．"
        ],
        "gaps": [
          "他制度との併用条件と現在の予算残は未確認です．"
        ],
        "evidence_urls": [
          "https://www.city.obihiro.hokkaido.jp/kurashi/kankyo/energy/kashitsuke/1003733.html",
          "https://www.city.obihiro.hokkaido.jp/_res/projects/default_project/_page_/001/003/733/hojyoyoukou.pdf",
          "https://www.city.obihiro.hokkaido.jp/_res/projects/default_project/_page_/001/003/733/r8_hojyoguide.pdf"
        ],
        "checked_at": "2026-09-28",
        "display_basis": "retained_reviewed_display",
        "migration_status": "pending_review",
        "model_assumptions": [
          "本人所有・本人居住の新規設置を評価し，入力外の申請者・施工者・製品条件を満たすと仮定します．",
          "禁止が未確認の他制度は計算上併用可能と仮定し，確認済みの禁止・対象経費・上限を維持します．",
          "入力太陽光出力を制度の算定出力に対応させます．V2Hのみの受付終了を太陽光の終了とは扱いません．"
        ],
        "legacy_municipal_rule_ids": []
      },
      "catalogAmount": {
        "raw_text": "PV：min(モジュール合計，PCS出力)を0.01kW切捨てした発電出力が4kW以下なら税込購入設置費×1/10，上限50000円．4kW超なら(発電出力−4)×10000円+50000円，上限109000円．千円未満切捨て．",
        "display_text": "モジュール合計とPCS出力の小さい値を0.01kW単位で切り捨てます．4kW以下は税込購入設置費の10分の1・上限5万円，4kW超は5万円＋4kW超過分1kW当たり1万円・上限10万9千円です．金額は千円未満切捨てです．",
        "evidence_status": "partial"
      },
      "rules": [
        {
          "id": "hokkaido-next-obihiro-solar-low",
          "government_level": "municipality",
          "prefecture_code": "01",
          "municipality_code": "01207",
          "program_name": "令和8年度帯広市新エネルギー導入促進補助金",
          "housing_ages": [
            "existing",
            "new"
          ],
          "equipment_packages": [
            "solar_only",
            "solar_plus_standard_battery"
          ],
          "application_status": "accepting",
          "diagnostic_scope": {
            "status": "in_scope",
            "in_scope_housing_ages": [
              "existing",
              "new"
            ],
            "excluded_branch_ids": [],
            "basis": "算定出力は0.01kW未満切捨て．処理後4kW以下の枝は生入力4.01kW未満へ対応し，税込費用1/10・5万円上限．"
          },
          "machine_rule": "kansai_municipal_formula",
          "fit_compatible": true,
          "expense_scopes": [
            "solar"
          ],
          "conflict_program_ids": [
            "hokkaido-next-obihiro-solar-high"
          ],
          "official_urls": [
            "https://www.city.obihiro.hokkaido.jp/kurashi/kankyo/energy/kashitsuke/1003733.html",
            "https://www.city.obihiro.hokkaido.jp/_res/projects/default_project/_page_/001/003/733/hojyoyoukou.pdf",
            "https://www.city.obihiro.hokkaido.jp/_res/projects/default_project/_page_/001/003/733/r8_hojyoguide.pdf"
          ],
          "confirmed_at": "2026-09-30",
          "calculation_assumptions": [
            "本人所有・本人居住の設備新設を評価し，確認済みの施工者・本人属性・製品性能・申請時期等の入力外条件を満たすと仮定する．",
            "併用禁止未確認は計算上併用可能と仮定するが，確認済みの禁止・控除・同一経費及び共通上限は維持する．",
            "税区分未記載は税込モデル費へ対応．最終端数処理未確認は1円単位の概算とし，公式の途中丸めは保持する．",
            "期間限定のない現行案内に終了・停止の明示がない場合は受付継続を仮定する．公式対象年度と受付欄は変更しない．",
            "算定出力は0.01kW未満切捨て．処理後4kW以下の枝は生入力4.01kW未満へ対応し，税込費用1/10・5万円上限．"
          ],
          "required_confirmations": [
            "申請前に公式案内で対象者，住宅，設備，対象費，併用及び申請・報告時点を確認してください．"
          ],
          "formula_components": [
            {
              "scope": "solar",
              "equipment_packages": [
                "solar_only",
                "solar_plus_standard_battery"
              ],
              "formula_type": "cost_fraction",
              "cost_scope": "solar",
              "cost_tax": "inclusive",
              "cap_yen": 50000,
              "rounding_unit_yen": 1000,
              "deduct_other_subsidies": false,
              "fraction_numerator": 1,
              "fraction_denominator": 10,
              "solar_output_max_kw_exclusive": 4.01
            }
          ],
          "source_ids": [
            "hokkaido-saved-material-809c7b15db990a8f2c85",
            "hokkaido-saved-record-77f24ac4ec0fa974d76c"
          ]
        },
        {
          "id": "hokkaido-next-obihiro-solar-high",
          "government_level": "municipality",
          "prefecture_code": "01",
          "municipality_code": "01207",
          "program_name": "令和8年度帯広市新エネルギー導入促進補助金",
          "housing_ages": [
            "existing",
            "new"
          ],
          "equipment_packages": [
            "solar_only",
            "solar_plus_standard_battery"
          ],
          "application_status": "accepting",
          "diagnostic_scope": {
            "status": "in_scope",
            "in_scope_housing_ages": [
              "existing",
              "new"
            ],
            "excluded_branch_ids": [],
            "basis": "0.01kW未満切捨て後の出力が4kW超の場合，5万円＋超過kW×1万円，最大10万9千円を適用．4kW以下の枝とは排他的．"
          },
          "machine_rule": "kansai_municipal_formula",
          "fit_compatible": true,
          "expense_scopes": [
            "solar"
          ],
          "conflict_program_ids": [
            "hokkaido-next-obihiro-solar-low"
          ],
          "official_urls": [
            "https://www.city.obihiro.hokkaido.jp/kurashi/kankyo/energy/kashitsuke/1003733.html",
            "https://www.city.obihiro.hokkaido.jp/_res/projects/default_project/_page_/001/003/733/hojyoyoukou.pdf",
            "https://www.city.obihiro.hokkaido.jp/_res/projects/default_project/_page_/001/003/733/r8_hojyoguide.pdf"
          ],
          "confirmed_at": "2026-09-30",
          "calculation_assumptions": [
            "本人所有・本人居住の設備新設を評価し，確認済みの施工者・本人属性・製品性能・申請時期等の入力外条件を満たすと仮定する．",
            "併用禁止未確認は計算上併用可能と仮定するが，確認済みの禁止・控除・同一経費及び共通上限は維持する．",
            "税区分未記載は税込モデル費へ対応．最終端数処理未確認は1円単位の概算とし，公式の途中丸めは保持する．",
            "期間限定のない現行案内に終了・停止の明示がない場合は受付継続を仮定する．公式対象年度と受付欄は変更しない．",
            "0.01kW未満切捨て後の出力が4kW超の場合，5万円＋超過kW×1万円，最大10万9千円を適用．4kW以下の枝とは排他的．"
          ],
          "required_confirmations": [
            "申請前に公式案内で対象者，住宅，設備，対象費，併用及び申請・報告時点を確認してください．"
          ],
          "formula_components": [
            {
              "scope": "solar",
              "equipment_packages": [
                "solar_only",
                "solar_plus_standard_battery"
              ],
              "formula_type": "capacity_rate_plus_fixed_cost_fraction",
              "cost_scope": "solar",
              "cost_tax": "inclusive",
              "cap_yen": 109000,
              "rounding_unit_yen": 1000,
              "deduct_other_subsidies": false,
              "fixed_amount_yen": 10000,
              "capacity_source": "solar_kw",
              "capacity_preprocessing": "floor_0_01",
              "capacity_cap": null,
              "unit_amount_yen": 10000,
              "fraction_numerator": 1,
              "fraction_denominator": 1,
              "solar_output_min_kw": 4.01,
              "solar_output_max_kw_exclusive": 10
            }
          ],
          "source_ids": [
            "hokkaido-saved-material-809c7b15db990a8f2c85",
            "hokkaido-saved-record-77f24ac4ec0fa974d76c"
          ]
        }
      ],
      "institutionalSource": "a47ee9e72c9465819918285046caeee832de139f47a8437d8a0e6873d9447c75",
      "sections": [
        {
          "label": "太陽光（出力4kW以下）",
          "text": "税込購入設置費の10分の1です．",
          "supplement": [
            "（上限）5万円"
          ]
        },
        {
          "label": "太陽光（出力4kW超）",
          "text": "5万円と，太陽光の4kWを超える出力に1kWあたり1万円を掛けた額の合計です．",
          "supplement": [
            "（上限）10万9,000円"
          ]
        }
      ],
      "text": "太陽光（出力4kW以下）：税込購入設置費の10分の1です．\n太陽光（出力4kW超）：5万円と，太陽光の4kWを超える出力に1kWあたり1万円を掛けた額の合計です．",
      "supplement": [
        "（算定対象）出力の基準：モジュール合計とPCS出力の小さい値",
        "（端数処理）出力（算定前）：0.01kW未満切り捨て",
        "（端数処理）最終補助額：1,000円未満切り捨て"
      ],
      "commonSupplement": [
        "（算定対象）出力の基準：モジュール合計とPCS出力の小さい値",
        "（端数処理）出力（算定前）：0.01kW未満切り捨て",
        "（端数処理）最終補助額：1,000円未満切り捨て"
      ],
      "equipment": "太陽光のみ"
    },
    "hokkaido-obihiro-battery": {
      "prefecture": "01",
      "municipality": "01207",
      "recordId": "scheme-964a5eefcd9045ecb064174955c65c1f",
      "targetYear": "2026年度",
      "branch": {
        "branch_id": "hokkaido-obihiro-battery",
        "diagnostic_rule_ids": [
          "hokkaido-next-obihiro-battery"
        ],
        "target_equipment": [
          "蓄電池"
        ],
        "application_start": [
          {
            "branch_id": "current",
            "label": "現行募集",
            "date": "2026-04-01"
          }
        ],
        "application_end": [
          {
            "branch_id": "current",
            "label": "現行募集",
            "date": "2027-01-29"
          }
        ],
        "application_status": "受付中",
        "amount": {
          "display_text": "税込の蓄電池購入設置費の10分の1，千円未満切捨て，上限10万円です．",
          "evidence_status": "partial"
        },
        "official_conditions": [
          "市内に居住する又は実績報告までに居住予定の方が，自ら居住する住宅へ設置する場合が対象です．新築を含み，非所有者は所有者の承諾が必要です．",
          "市税の滞納がなく，暴力団等に該当せず，同一世帯で同じ設備への市補助を受けていないことが条件です．",
          "交付決定前に着工できません．保存された令和8年度募集は2026年4月1日〜2027年1月29日で，先着順・予算上限があります．実績報告は2027年3月31日までです．",
          "太陽光と常時接続して充放電できる，容量1kWh以上の新品の蓄電池が対象です．"
        ],
        "gaps": [
          "他制度との併用条件，現在の予算残，最低容量の定格・実効等の定義は未確認です．"
        ],
        "evidence_urls": [
          "https://www.city.obihiro.hokkaido.jp/kurashi/kankyo/energy/kashitsuke/1003733.html",
          "https://www.city.obihiro.hokkaido.jp/_res/projects/default_project/_page_/001/003/733/hojyoyoukou.pdf",
          "https://www.city.obihiro.hokkaido.jp/_res/projects/default_project/_page_/001/003/733/r8_hojyoguide.pdf"
        ],
        "checked_at": "2026-09-28",
        "display_basis": "retained_reviewed_display",
        "migration_status": "pending_review",
        "model_assumptions": [
          "本人所有・本人居住の新規設置を評価し，入力外の申請者・施工者・製品条件を満たすと仮定します．",
          "禁止が未確認の他制度は計算上併用可能と仮定し，確認済みの禁止・対象経費・上限を維持します．",
          "最低容量などの製品条件を満たすと仮定し，容量区分を補助額の比例算定へ代入しません．V2Hのみの受付終了を蓄電池の終了とは扱いません．"
        ],
        "legacy_municipal_rule_ids": []
      },
      "catalogAmount": {
        "raw_text": "B：税込購入設置費×1/10，上限100000円，千円未満切捨て．",
        "display_text": "税込の蓄電池購入設置費の10分の1，千円未満切捨て，上限10万円です．",
        "evidence_status": "partial"
      },
      "rules": [
        {
          "id": "hokkaido-next-obihiro-battery",
          "government_level": "municipality",
          "prefecture_code": "01",
          "municipality_code": "01207",
          "program_name": "令和8年度帯広市新エネルギー導入促進補助金",
          "housing_ages": [
            "existing",
            "new"
          ],
          "equipment_packages": [
            "solar_plus_standard_battery"
          ],
          "application_status": "accepting",
          "diagnostic_scope": {
            "status": "in_scope",
            "in_scope_housing_ages": [
              "existing",
              "new"
            ],
            "excluded_branch_ids": [],
            "basis": "税込購入設置費1/10・10万円上限．新品・太陽光常時接続と容量1kWh以上を適格製品条件として満たす仮定．"
          },
          "machine_rule": "kansai_municipal_formula",
          "fit_compatible": true,
          "expense_scopes": [
            "battery"
          ],
          "conflict_program_ids": [],
          "official_urls": [
            "https://www.city.obihiro.hokkaido.jp/kurashi/kankyo/energy/kashitsuke/1003733.html",
            "https://www.city.obihiro.hokkaido.jp/_res/projects/default_project/_page_/001/003/733/hojyoyoukou.pdf",
            "https://www.city.obihiro.hokkaido.jp/_res/projects/default_project/_page_/001/003/733/r8_hojyoguide.pdf"
          ],
          "confirmed_at": "2026-09-30",
          "calculation_assumptions": [
            "本人所有・本人居住の設備新設を評価し，確認済みの施工者・本人属性・製品性能・申請時期等の入力外条件を満たすと仮定する．",
            "併用禁止未確認は計算上併用可能と仮定するが，確認済みの禁止・控除・同一経費及び共通上限は維持する．",
            "税区分未記載は税込モデル費へ対応．最終端数処理未確認は1円単位の概算とし，公式の途中丸めは保持する．",
            "期間限定のない現行案内に終了・停止の明示がない場合は受付継続を仮定する．公式対象年度と受付欄は変更しない．",
            "税込購入設置費1/10・10万円上限．新品・太陽光常時接続と容量1kWh以上を適格製品条件として満たす仮定．"
          ],
          "required_confirmations": [
            "申請前に公式案内で対象者，住宅，設備，対象費，併用及び申請・報告時点を確認してください．"
          ],
          "formula_components": [
            {
              "scope": "battery",
              "equipment_packages": [
                "solar_plus_standard_battery"
              ],
              "formula_type": "cost_fraction",
              "cost_scope": "battery",
              "cost_tax": "inclusive",
              "cap_yen": 100000,
              "rounding_unit_yen": 1000,
              "deduct_other_subsidies": false,
              "fraction_numerator": 1,
              "fraction_denominator": 10,
              "battery_capacity_min_kwh": 1
            }
          ],
          "source_ids": [
            "hokkaido-saved-material-809c7b15db990a8f2c85",
            "hokkaido-saved-record-1cebf13f7e9b3b2a02bd"
          ]
        }
      ],
      "institutionalSource": "8820486be2bfb16cfdd9325cdf563db5965267ac727f6b5a368a046f784cf763",
      "sections": [
        {
          "label": "蓄電池",
          "text": "税込の蓄電池購入設置費の10分の1です．",
          "supplement": [
            "（上限）10万円",
            "（端数処理）1,000円未満切り捨て"
          ]
        }
      ],
      "text": "税込の蓄電池購入設置費の10分の1です．",
      "supplement": [
        "（上限）10万円",
        "（端数処理）1,000円未満切り捨て"
      ],
      "commonSupplement": [],
      "equipment": "蓄電池のみ"
    },
    "hokkaido-kitami-package": {
      "prefecture": "01",
      "municipality": "01208",
      "recordId": "scheme-5b23210de2ae4ac996525a82571ae514",
      "targetYear": "2026年度",
      "branch": {
        "branch_id": "hokkaido-kitami-package",
        "diagnostic_rule_ids": [
          "hokkaido-next-kitami-package"
        ],
        "target_equipment": [
          "蓄電池＋太陽光パネル"
        ],
        "application_start": [
          {
            "branch_id": "r8",
            "label": "交付申請",
            "date": ""
          }
        ],
        "application_end": [
          {
            "branch_id": "r8",
            "label": "交付申請",
            "date": "2027-02-26"
          }
        ],
        "application_status": "受付中",
        "amount": {
          "display_text": "太陽光と蓄電池の同時設置に定額21万円です．蓄電池単独の10万円を重ねて加算しません．",
          "evidence_status": "partial"
        },
        "official_conditions": [
          "所有する又は実績報告時までに所有予定の居住住宅が対象です．単身赴任の場合は同一生計の家族が居住する住宅も対象です．市税の滞納がなく，反社会的勢力に該当しないことが必要です．",
          "同一世帯で同種設備への過去の市補助を受けていないこと，未使用設備を市内事業者が施工することが条件です．",
          "太陽光は出力合計2kW以上10kW未満・低圧逆潮流接続，蓄電池は容量1kWh以上・規格適合・太陽光への常時接続が必要です．",
          "2026年4月1日以降に着工又は新築購入の引渡しを受け，原則として2027年2月末までに完工します．交付申請期限は2027年2月26日です．実績報告は完了後30日以内又は3月末の早い日までです．"
        ],
        "gaps": [
          "他制度との併用条件，現在の予算残，蓄電容量の定格・実効等の区分は未確認です．"
        ],
        "evidence_urls": [
          "https://www.city.kitami.lg.jp/administration/life/detail.php?content=14102",
          "https://public2.legalcrud.com/kitami_city/reiki/act/110004664.html"
        ],
        "checked_at": "2026-09-28",
        "display_basis": "retained_reviewed_display",
        "migration_status": "pending_review",
        "model_assumptions": [
          "本人所有・本人居住の新規設置を評価し，入力外の申請者・施工者・製品条件を満たすと仮定します．",
          "禁止が未確認の他制度は計算上併用可能と仮定し，確認済みの禁止・対象経費・上限を維持します．",
          "太陽光と蓄電池を同時に新設し，最低容量などの製品条件を満たすと仮定します．定額21万円の設備別費目への内部配分は，公式の設備別給付額ではありません．"
        ],
        "legacy_municipal_rule_ids": []
      },
      "catalogAmount": {
        "raw_text": "太陽光・蓄電池同時設置は定額210000円．",
        "display_text": "太陽光と蓄電池の同時設置に定額21万円です．蓄電池単独の10万円を重ねて加算しません．",
        "evidence_status": "partial"
      },
      "rules": [
        {
          "id": "hokkaido-next-kitami-package",
          "government_level": "municipality",
          "prefecture_code": "01",
          "municipality_code": "01208",
          "program_name": "令和8年度北見市ゼロカーボン推進事業補助金",
          "housing_ages": [
            "existing",
            "new"
          ],
          "equipment_packages": [
            "solar_plus_standard_battery"
          ],
          "application_status": "accepting",
          "diagnostic_scope": {
            "status": "in_scope",
            "in_scope_housing_ages": [
              "existing",
              "new"
            ],
            "excluded_branch_ids": [],
            "basis": "太陽光2kW以上10kW未満と蓄電池の同時設置定額21万円．蓄電池単独10万円を重ねて加算しない．合算費用への内部費目帰属は公式設備別金額ではない．"
          },
          "machine_rule": "kansai_municipal_formula",
          "fit_compatible": true,
          "expense_scopes": [
            "solar"
          ],
          "conflict_program_ids": [],
          "official_urls": [
            "https://www.city.kitami.lg.jp/administration/life/detail.php?content=14102",
            "https://public2.legalcrud.com/kitami_city/reiki/act/110004664.html"
          ],
          "confirmed_at": "2026-09-30",
          "calculation_assumptions": [
            "本人所有・本人居住の設備新設を評価し，確認済みの施工者・本人属性・製品性能・申請時期等の入力外条件を満たすと仮定する．",
            "併用禁止未確認は計算上併用可能と仮定するが，確認済みの禁止・控除・同一経費及び共通上限は維持する．",
            "税区分未記載は税込モデル費へ対応．最終端数処理未確認は1円単位の概算とし，公式の途中丸めは保持する．",
            "期間限定のない現行案内に終了・停止の明示がない場合は受付継続を仮定する．公式対象年度と受付欄は変更しない．",
            "太陽光2kW以上10kW未満と蓄電池の同時設置定額21万円．蓄電池単独10万円を重ねて加算しない．合算費用への内部費目帰属は公式設備別金額ではない．"
          ],
          "required_confirmations": [
            "申請前に公式案内で対象者，住宅，設備，対象費，併用及び申請・報告時点を確認してください．"
          ],
          "formula_components": [
            {
              "scope": "solar",
              "equipment_packages": [
                "solar_plus_standard_battery"
              ],
              "formula_type": "fixed",
              "cost_scope": "combined",
              "cost_tax": "approved_assumption_inclusive",
              "cap_yen": 210000,
              "rounding_unit_yen": 1000,
              "deduct_other_subsidies": false,
              "fixed_amount_yen": 210000,
              "solar_output_min_kw": 2,
              "solar_output_max_kw_exclusive": 10,
              "battery_capacity_min_kwh": 1
            }
          ],
          "source_ids": [
            "hokkaido-saved-material-6ac0cbbfc64ade9ba01d",
            "hokkaido-saved-record-03dbf8ac3e47d49d61c2",
            "saved-scope-fix-02e58d7e2893455f189f"
          ]
        }
      ],
      "institutionalSource": "575d48cdcecd6a6a3b3265b638211c66811802b9c1faf96129f0367fc9c30e56",
      "sections": [
        {
          "label": "太陽光・蓄電池",
          "text": "21万円です．",
          "supplement": [
            "（適用条件）導入方法：太陽光・蓄電池の同時設置"
          ]
        }
      ],
      "text": "21万円です．",
      "supplement": [
        "（適用条件）導入方法：太陽光・蓄電池の同時設置"
      ],
      "commonSupplement": [],
      "equipment": "太陽光・蓄電池",
      "savedSourceDetails": true
    },
    "hokkaido-kuriyama-solar": {
      "prefecture": "01",
      "municipality": "01429",
      "recordId": "scheme-94f0d49e702d4aba94a89f13be58b87d",
      "targetYear": "2026年度",
      "branch": {
        "branch_id": "hokkaido-kuriyama-solar",
        "diagnostic_rule_ids": [
          "hokkaido-next-kuriyama-solar"
        ],
        "target_equipment": [
          "太陽光パネル"
        ],
        "application_start": [
          {
            "branch_id": "kuriyama_solar",
            "label": "令和8年度申請",
            "date": "2026-04-01"
          }
        ],
        "application_end": [
          {
            "branch_id": "kuriyama_solar",
            "label": "令和8年度申請",
            "date": "2027-01-29"
          }
        ],
        "application_status": "受付中",
        "amount": {
          "display_text": "太陽光の税抜購入・施工対象費の3分の1，千円未満切捨て，上限20万円です．診断で評価するのは太陽光単独導入です．",
          "evidence_status": "partial"
        },
        "official_conditions": [
          "町内に居住する又は期限内に転入予定で，本人・同一世帯全員に税の滞納がなく，同じ機器への過去の町助成を受けていないことが条件です．非所有住宅では所有者の承諾が必要です．",
          "新品で，モジュール又はPCSのいずれかの出力が2kW以上50kW未満，増設は既設分も含みます．第三者認証と全部又は一部の自家消費が必要です．",
          "保存された令和8年度募集の申請は2026年4月1日〜2027年1月29日です．交付決定後に着工し，2027年3月31日までに実績報告します．"
        ],
        "gaps": [
          "現在の予算残と他制度との併用条件は未確認です．新築で太陽光と蓄電池を同時導入する場合は，合算30万円という概要と個別上限20万円＋15万円が一致していないため確認が必要です．"
        ],
        "evidence_urls": [
          "https://www.town.kuriyama.hokkaido.jp/site/-/35394.html",
          "https://www.town.kuriyama.hokkaido.jp/uploaded/attachment/13742.pdf",
          "https://www.pref.hokkaido.lg.jp/kn/ksd/159060.html"
        ],
        "checked_at": "2026-09-28",
        "display_basis": "retained_reviewed_display",
        "migration_status": "pending_review",
        "model_assumptions": [
          "本人所有・本人居住の新規設置を評価し，入力外の申請者・施工者・製品条件を満たすと仮定します．",
          "禁止が未確認の他制度は計算上併用可能と仮定し，確認済みの禁止・対象経費・上限を維持します．",
          "太陽光単独導入だけを評価し，蓄電池及び同時導入の給付は今回の計算へ加えません．入力出力と製品条件が制度の要件を満たすと仮定します．"
        ],
        "branch_label": "太陽光発電設備",
        "legacy_municipal_rule_ids": []
      },
      "catalogAmount": {
        "raw_text": "税抜対象購入施工費/3，千円未満切捨て，上限20万円．",
        "display_text": "太陽光の税抜購入・施工対象費の3分の1，千円未満切捨て，上限20万円です．診断で評価するのは太陽光単独導入です．",
        "evidence_status": "partial"
      },
      "rules": [
        {
          "id": "hokkaido-next-kuriyama-solar",
          "government_level": "municipality",
          "prefecture_code": "01",
          "municipality_code": "01429",
          "program_name": "令和8年度小規模太陽光発電設備等設置費補助金",
          "housing_ages": [
            "existing",
            "new"
          ],
          "equipment_packages": [
            "solar_only"
          ],
          "application_status": "accepting",
          "diagnostic_scope": {
            "status": "in_scope",
            "in_scope_housing_ages": [
              "existing",
              "new"
            ],
            "excluded_branch_ids": [],
            "basis": "確認済みの太陽光単独経路だけを評価．新築同時導入の30万円対20＋15万円の不一致は別保留．設備製品は出力条件を満たすと仮定する．"
          },
          "machine_rule": "kansai_municipal_formula",
          "fit_compatible": true,
          "expense_scopes": [
            "solar"
          ],
          "conflict_program_ids": [],
          "official_urls": [
            "https://www.town.kuriyama.hokkaido.jp/site/-/35394.html",
            "https://www.town.kuriyama.hokkaido.jp/uploaded/attachment/13742.pdf",
            "https://www.pref.hokkaido.lg.jp/kn/ksd/159060.html"
          ],
          "confirmed_at": "2026-09-30",
          "calculation_assumptions": [
            "本人所有・本人居住の設備新設を評価し，確認済みの施工者・本人属性・製品性能・申請時期等の入力外条件を満たすと仮定する．",
            "併用禁止未確認は計算上併用可能と仮定するが，確認済みの禁止・控除・同一経費及び共通上限は維持する．",
            "税区分未記載は税込モデル費へ対応．最終端数処理未確認は1円単位の概算とし，公式の途中丸めは保持する．",
            "期間限定のない現行案内に終了・停止の明示がない場合は受付継続を仮定する．公式対象年度と受付欄は変更しない．",
            "確認済みの太陽光単独経路だけを評価．新築同時導入の30万円対20＋15万円の不一致は別保留．設備製品は出力条件を満たすと仮定する．"
          ],
          "required_confirmations": [
            "申請前に公式案内で対象者，住宅，設備，対象費，併用及び申請・報告時点を確認してください．"
          ],
          "formula_components": [
            {
              "scope": "solar",
              "equipment_packages": [
                "solar_only"
              ],
              "formula_type": "cost_fraction",
              "cost_scope": "solar",
              "cost_tax": "exclusive",
              "cap_yen": 200000,
              "rounding_unit_yen": 1000,
              "deduct_other_subsidies": false,
              "fraction_numerator": 1,
              "fraction_denominator": 3,
              "solar_output_min_kw": 2,
              "solar_output_max_kw_exclusive": 50
            }
          ],
          "source_ids": [
            "hokkaido-saved-material-00567f19bb290a14a995",
            "hokkaido-saved-record-ab9003e3ba9ed8955575",
            "hokkaido-label-6479078107ae0938ba1c"
          ]
        }
      ],
      "institutionalSource": "61ce4ea7ca6b73760c25e06aacad7d312f7dc6e05bf24dc5171b7af4d6b69e80",
      "sections": [
        {
          "label": "太陽光",
          "text": "太陽光の税抜購入・施工対象費の3分の1です．",
          "supplement": [
            "（上限）20万円",
            "（端数処理）1,000円未満切り捨て"
          ]
        }
      ],
      "text": "太陽光の税抜購入・施工対象費の3分の1です．",
      "supplement": [
        "（上限）20万円",
        "（端数処理）1,000円未満切り捨て"
      ],
      "commonSupplement": [],
      "equipment": "太陽光のみ"
    },
    "hokkaido-otofuke-solar": {
      "prefecture": "01",
      "municipality": "01631",
      "recordId": "scheme-0b530ab8debc4f42b120b98a16a27c60",
      "targetYear": "2026年度",
      "branch": {
        "branch_id": "hokkaido-otofuke-solar",
        "diagnostic_rule_ids": [
          "hokkaido-next-otofuke-solar"
        ],
        "target_equipment": [
          "太陽光パネル"
        ],
        "application_start": [
          {
            "branch_id": "otofuke_solar",
            "label": "令和8年度申請",
            "date": "2026-04-01"
          }
        ],
        "application_end": [
          {
            "branch_id": "otofuke_solar",
            "label": "令和8年度申請",
            "date": "2027-02-26"
          }
        ],
        "application_status": "受付中",
        "amount": {
          "display_text": "太陽光の値引後・税抜の購入施工対象費の3分の1，千円未満切捨て，上限10万円です．太陽光10万円・蓄電池5万円の上限は設備別に適用します．",
          "evidence_status": "partial"
        },
        "official_conditions": [
          "町内に居住する又は年度内に居住予定で，設置住宅へ入居し，申請者・同一世帯に町税の未納がないことが条件です．新築・建設予定も含み，非所有・共有住宅では所有者等の承諾が必要です．",
          "新品が対象で，同種機器への過去の町補助を受けていないことが必要です．異なる機器はそれぞれ申請できます．",
          "保存された令和8年度募集の受付は2026年4月1日〜2027年2月26日です．交付決定通知前に着工できません．",
          "現行募集本文がリンクする令和6年4月1日作成のQ&Aは，着工前の前払い済み申請を認めています．前払い可能という説明は，交付決定前の着工を認めるものではありません．翌年度に転入する本人は当該年度の対象外ですが，同居家族の年度内転入者による申請は可能とされています．",
          "太陽光はモジュール又はPCSのいずれか2kW以上50kW未満（増設は既設分も含む）で，第三者認証を受け，全部又は一部を自家消費する設備が対象です．"
        ],
        "gaps": [
          "令和8年度募集本文の実績報告期限は2026年3月31日と記載され，募集開始前となっています．要綱は申請年度の3月31日（令和8年度なら2027年3月31日）としており，不一致があるため町へ確認が必要です．",
          "現在の予算残と併用先制度側の要件は未確認です．"
        ],
        "evidence_urls": [
          "https://www.town.otofuke.hokkaido.jp/kurashi/kankyo/ondankataisaku/choumin_minnade_zerocarbon.html",
          "https://www.town.otofuke.hokkaido.jp/files/00007000/00007010/r8_kikitou_ichiran.pdf",
          "https://www.town.otofuke.hokkaido.jp/files/00007000/00007010/r6_koufuyoukou.pdf",
          "https://www.town.otofuke.hokkaido.jp/files/00007000/00007010/r6_04_01_qa.pdf"
        ],
        "checked_at": "2026-09-28",
        "display_basis": "retained_reviewed_display",
        "migration_status": "pending_review",
        "model_assumptions": [
          "本人所有・本人居住の新規設置を評価し，入力外の申請者・施工者・製品条件を満たすと仮定します．",
          "禁止が未確認の他制度は計算上併用可能と仮定し，確認済みの禁止・対象経費・上限を維持します．",
          "正しい申請・施工・入居・報告期間を満たせると仮定します．期限の不一致は申請前に町へ確認してください．",
          "設備別の税抜モデル費用を値引後対象費へ対応させ，設備の出力・容量等の製品条件を満たすと仮定します．"
        ],
        "legacy_municipal_rule_ids": []
      },
      "catalogAmount": {
        "raw_text": "値引後税抜購入・施工対象経費の1/3，上限10万円，千円未満切捨て．",
        "display_text": "太陽光の値引後・税抜の購入施工対象費の3分の1，千円未満切捨て，上限10万円です．太陽光10万円・蓄電池5万円の上限は設備別に適用します．",
        "evidence_status": "partial"
      },
      "rules": [
        {
          "id": "hokkaido-next-otofuke-solar",
          "government_level": "municipality",
          "prefecture_code": "01",
          "municipality_code": "01631",
          "program_name": "令和8年度町民みんなで推進するゼロカーボン事業補助金",
          "housing_ages": [
            "existing",
            "new"
          ],
          "equipment_packages": [
            "solar_only",
            "solar_plus_standard_battery"
          ],
          "application_status": "accepting",
          "diagnostic_scope": {
            "status": "in_scope",
            "in_scope_housing_ages": [
              "existing",
              "new"
            ],
            "excluded_branch_ids": [],
            "basis": "値引後税抜購入施工費1/3を設備別上限へ適用．令和8年度募集本文の完了日と要綱年度末の不整合を保持し，正しい所定期間内で施工・入居できることを申請前に確認する．"
          },
          "machine_rule": "kansai_municipal_formula",
          "fit_compatible": true,
          "expense_scopes": [
            "solar"
          ],
          "conflict_program_ids": [],
          "official_urls": [
            "https://www.town.otofuke.hokkaido.jp/kurashi/kankyo/ondankataisaku/choumin_minnade_zerocarbon.html",
            "https://www.town.otofuke.hokkaido.jp/files/00007000/00007010/r8_kikitou_ichiran.pdf",
            "https://www.town.otofuke.hokkaido.jp/files/00007000/00007010/r6_koufuyoukou.pdf",
            "https://www.town.otofuke.hokkaido.jp/files/00007000/00007010/r6_04_01_qa.pdf"
          ],
          "confirmed_at": "2026-09-30",
          "calculation_assumptions": [
            "本人所有・本人居住の設備新設を評価し，確認済みの施工者・本人属性・製品性能・申請時期等の入力外条件を満たすと仮定する．",
            "併用禁止未確認は計算上併用可能と仮定するが，確認済みの禁止・控除・同一経費及び共通上限は維持する．",
            "税区分未記載は税込モデル費へ対応．最終端数処理未確認は1円単位の概算とし，公式の途中丸めは保持する．",
            "期間限定のない現行案内に終了・停止の明示がない場合は受付継続を仮定する．公式対象年度と受付欄は変更しない．",
            "値引後税抜購入施工費1/3を設備別上限へ適用．令和8年度募集本文の完了日と要綱年度末の不整合を保持し，正しい所定期間内で施工・入居できることを申請前に確認する．"
          ],
          "required_confirmations": [
            "申請前に公式案内で対象者，住宅，設備，対象費，併用及び申請・報告時点を確認してください．"
          ],
          "formula_components": [
            {
              "scope": "solar",
              "equipment_packages": [
                "solar_only",
                "solar_plus_standard_battery"
              ],
              "formula_type": "cost_fraction",
              "cost_scope": "solar",
              "cost_tax": "exclusive",
              "cap_yen": 100000,
              "rounding_unit_yen": 1000,
              "deduct_other_subsidies": false,
              "fraction_numerator": 1,
              "fraction_denominator": 3,
              "solar_output_min_kw": 2,
              "solar_output_max_kw_exclusive": 50
            }
          ],
          "source_ids": [
            "hokkaido-saved-material-01f0e50700c077b44c07",
            "hokkaido-saved-record-61eed72111286d25e09f"
          ]
        }
      ],
      "institutionalSource": "64c3cd6e57fbe599f3ae8924771ed9b6fe86028b59c8380ed076bb85ded2eb45",
      "sections": [
        {
          "label": "太陽光",
          "text": "太陽光の値引後・税抜の購入施工対象費の3分の1です．",
          "supplement": [
            "（上限）10万円",
            "（端数処理）1,000円未満切り捨て"
          ]
        }
      ],
      "text": "太陽光の値引後・税抜の購入施工対象費の3分の1です．",
      "supplement": [
        "（上限）10万円",
        "（端数処理）1,000円未満切り捨て"
      ],
      "commonSupplement": [],
      "equipment": "太陽光",
      "savedSourceDetails": true
    },
    "hokkaido-otofuke-battery": {
      "prefecture": "01",
      "municipality": "01631",
      "recordId": "scheme-0b530ab8debc4f42b120b98a16a27c60",
      "targetYear": "2026年度",
      "branch": {
        "branch_id": "hokkaido-otofuke-battery",
        "diagnostic_rule_ids": [
          "hokkaido-next-otofuke-battery"
        ],
        "target_equipment": [
          "蓄電池"
        ],
        "application_start": [
          {
            "branch_id": "otofuke_battery",
            "label": "令和8年度申請",
            "date": "2026-04-01"
          }
        ],
        "application_end": [
          {
            "branch_id": "otofuke_battery",
            "label": "令和8年度申請",
            "date": "2027-02-26"
          }
        ],
        "application_status": "受付中",
        "amount": {
          "display_text": "蓄電池の値引後・税抜の購入施工対象費の3分の1，千円未満切捨て，上限5万円です．太陽光10万円・蓄電池5万円の上限は設備別に適用します．",
          "evidence_status": "partial"
        },
        "official_conditions": [
          "町内に居住する又は年度内に居住予定で，設置住宅へ入居し，申請者・同一世帯に町税の未納がないことが条件です．新築・建設予定も含み，非所有・共有住宅では所有者等の承諾が必要です．",
          "新品が対象で，同種機器への過去の町補助を受けていないことが必要です．異なる機器はそれぞれ申請できます．",
          "保存された令和8年度募集の受付は2026年4月1日〜2027年2月26日です．交付決定通知前に着工できません．",
          "現行募集本文がリンクする令和6年4月1日作成のQ&Aは，着工前の前払い済み申請を認めています．前払い可能という説明は，交付決定前の着工を認めるものではありません．翌年度に転入する本人は当該年度の対象外ですが，同居家族の年度内転入者による申請は可能とされています．",
          "蓄電池は公称容量1kWh以上，太陽光への常時接続とメーカー指定の設置環境が必要です．固定式リチウムイオン又はリチウムイオンと鉛を併用したシステムが対象です．"
        ],
        "gaps": [
          "令和8年度募集本文の実績報告期限は2026年3月31日と記載され，募集開始前となっています．要綱は申請年度の3月31日（令和8年度なら2027年3月31日）としており，不一致があるため町へ確認が必要です．",
          "現在の予算残と併用先制度側の要件は未確認です．",
          "公称容量と診断用容量の対応は未確認です．"
        ],
        "evidence_urls": [
          "https://www.town.otofuke.hokkaido.jp/kurashi/kankyo/ondankataisaku/choumin_minnade_zerocarbon.html",
          "https://www.town.otofuke.hokkaido.jp/files/00007000/00007010/r8_kikitou_ichiran.pdf",
          "https://www.town.otofuke.hokkaido.jp/files/00007000/00007010/r6_koufuyoukou.pdf",
          "https://www.town.otofuke.hokkaido.jp/files/00007000/00007010/r6_04_01_qa.pdf"
        ],
        "checked_at": "2026-09-28",
        "display_basis": "retained_reviewed_display",
        "migration_status": "pending_review",
        "model_assumptions": [
          "本人所有・本人居住の新規設置を評価し，入力外の申請者・施工者・製品条件を満たすと仮定します．",
          "禁止が未確認の他制度は計算上併用可能と仮定し，確認済みの禁止・対象経費・上限を維持します．",
          "正しい申請・施工・入居・報告期間を満たせると仮定します．期限の不一致は申請前に町へ確認してください．",
          "設備別の税抜モデル費用を値引後対象費へ対応させ，設備の出力・容量等の製品条件を満たすと仮定します．"
        ],
        "legacy_municipal_rule_ids": []
      },
      "catalogAmount": {
        "raw_text": "値引後税抜購入・施工対象経費の1/3，上限5万円，千円未満切捨て．",
        "display_text": "蓄電池の値引後・税抜の購入施工対象費の3分の1，千円未満切捨て，上限5万円です．太陽光10万円・蓄電池5万円の上限は設備別に適用します．",
        "evidence_status": "partial"
      },
      "rules": [
        {
          "id": "hokkaido-next-otofuke-battery",
          "government_level": "municipality",
          "prefecture_code": "01",
          "municipality_code": "01631",
          "program_name": "令和8年度町民みんなで推進するゼロカーボン事業補助金",
          "housing_ages": [
            "existing",
            "new"
          ],
          "equipment_packages": [
            "solar_plus_standard_battery"
          ],
          "application_status": "accepting",
          "diagnostic_scope": {
            "status": "in_scope",
            "in_scope_housing_ages": [
              "existing",
              "new"
            ],
            "excluded_branch_ids": [],
            "basis": "値引後税抜購入施工費1/3を設備別上限へ適用．令和8年度募集本文の完了日と要綱年度末の不整合を保持し，正しい所定期間内で施工・入居できることを申請前に確認する．"
          },
          "machine_rule": "kansai_municipal_formula",
          "fit_compatible": true,
          "expense_scopes": [
            "battery"
          ],
          "conflict_program_ids": [],
          "official_urls": [
            "https://www.town.otofuke.hokkaido.jp/kurashi/kankyo/ondankataisaku/choumin_minnade_zerocarbon.html",
            "https://www.town.otofuke.hokkaido.jp/files/00007000/00007010/r8_kikitou_ichiran.pdf",
            "https://www.town.otofuke.hokkaido.jp/files/00007000/00007010/r6_koufuyoukou.pdf",
            "https://www.town.otofuke.hokkaido.jp/files/00007000/00007010/r6_04_01_qa.pdf"
          ],
          "confirmed_at": "2026-09-30",
          "calculation_assumptions": [
            "本人所有・本人居住の設備新設を評価し，確認済みの施工者・本人属性・製品性能・申請時期等の入力外条件を満たすと仮定する．",
            "併用禁止未確認は計算上併用可能と仮定するが，確認済みの禁止・控除・同一経費及び共通上限は維持する．",
            "税区分未記載は税込モデル費へ対応．最終端数処理未確認は1円単位の概算とし，公式の途中丸めは保持する．",
            "期間限定のない現行案内に終了・停止の明示がない場合は受付継続を仮定する．公式対象年度と受付欄は変更しない．",
            "値引後税抜購入施工費1/3を設備別上限へ適用．令和8年度募集本文の完了日と要綱年度末の不整合を保持し，正しい所定期間内で施工・入居できることを申請前に確認する．"
          ],
          "required_confirmations": [
            "申請前に公式案内で対象者，住宅，設備，対象費，併用及び申請・報告時点を確認してください．"
          ],
          "formula_components": [
            {
              "scope": "battery",
              "equipment_packages": [
                "solar_plus_standard_battery"
              ],
              "formula_type": "cost_fraction",
              "cost_scope": "battery",
              "cost_tax": "exclusive",
              "cap_yen": 50000,
              "rounding_unit_yen": 1000,
              "deduct_other_subsidies": false,
              "fraction_numerator": 1,
              "fraction_denominator": 3,
              "battery_capacity_min_kwh": 1
            }
          ],
          "source_ids": [
            "hokkaido-saved-material-01f0e50700c077b44c07",
            "hokkaido-saved-record-9ecfbe90f0078a3185a8"
          ]
        }
      ],
      "institutionalSource": "2c7c5c81cf839962e58dab4afbcc9fd83cafeb7d07180c2932fabd5b42145691",
      "sections": [
        {
          "label": "蓄電池",
          "text": "蓄電池の値引後・税抜の購入施工対象費の3分の1です．",
          "supplement": [
            "（上限）5万円",
            "（端数処理）1,000円未満切り捨て"
          ]
        }
      ],
      "text": "蓄電池の値引後・税抜の購入施工対象費の3分の1です．",
      "supplement": [
        "（上限）5万円",
        "（端数処理）1,000円未満切り捨て"
      ],
      "commonSupplement": [],
      "equipment": "蓄電池",
      "savedSourceDetails": true
    },
    "hokkaido-ebetsu-package": {
      "prefecture": "01",
      "municipality": "01217",
      "recordId": "scheme-56f031aca7b5d4a05f8a",
      "targetYear": "2026年度",
      "branch": {
        "branch_id": "hokkaido-ebetsu-package",
        "diagnostic_rule_ids": [
          "hokkaido-ebetsu-package"
        ],
        "target_equipment": [
          "蓄電池＋太陽光パネル"
        ],
        "application_start": [
          {
            "branch_id": "r8",
            "label": "当初申請期間（予算到達で早期終了）",
            "date": ""
          }
        ],
        "application_end": [
          {
            "branch_id": "r8",
            "label": "当初申請期間（予算到達で早期終了）",
            "date": "2026-12-28"
          }
        ],
        "application_status": "受付対象外",
        "amount": {
          "display_text": "太陽光：10万円です．\n（出力基準）適用条件・補助額の算定に使用：太陽電池モジュールの合計出力\n（対象出力範囲）適用条件・補助額の算定に使用：1.5kW以上10kW未満\n（適用条件）対象太陽光購入・設置費（円）：100,000円超\n（適用条件）導入方法：太陽光・蓄電池の同時設置\n（未確認事項）太陽光の対象費用の税込・税抜の区分\n蓄電池：10万円です．\n（対象容量範囲）適用条件・補助額の算定に使用：2kWh以上20kWh未満\n（適用条件）対象蓄電池購入・設置費（円）：100,000円超\n（適用条件）導入方法：太陽光・蓄電池の同時設置\n（未確認事項）蓄電池の対象費用の税込・税抜の区分",
          "evidence_status": "confirmed",
          "summary_text": "太陽光：10万円です．／蓄電池：10万円です．"
        },
        "official_conditions": [
          "市の住民基本台帳に記載され，設備設置住所（店舗併用住宅では居住部分）に居住する，又は市内に居住予定の個人．",
          "2023年7月14日以降の売買契約又は設置工事請負契約．未契約の場合は見積日を契約日とみなす．",
          "市税の滞納がない．",
          "同一世帯で同一設備の補助申請者がいない．",
          "暴力団員等ではない．",
          "自己所有でない又は共有の住宅は所有者等の同意が必要．",
          "1世帯につき申請年度に1回．",
          "両設備を同時設置する．",
          "設備ごとの購入・設置費用が各10万円以下の場合，その設備は交付対象外．",
          "太陽光は蓄電池へ接続し自家消費可能，余剰配線，系統連系，未使用品．",
          "太陽光へ常時接続し太陽光から充電するリチウムイオン蓄電池，系統連系，未使用品．",
          "国の補助金：併用可"
        ],
        "gaps": [],
        "evidence_urls": [
          "https://www.city.ebetsu.hokkaido.jp/soshiki/kankyo/128311.html",
          "https://www.city.ebetsu.hokkaido.jp/uploaded/attachment/81648.pdf"
        ],
        "checked_at": "2026-09-28",
        "display_basis": "preparing",
        "migration_status": "pending_review",
        "legacy_municipal_rule_ids": [],
        "branch_label": "同時設置"
      },
      "catalogAmount": {
        "raw_text": "太陽光・蓄電池同時設置は合計200,000円（各100,000円）．要綱第2条第3項により購入・設置費が所定補助額以下なら交付対象外．費用まで補助額を切り詰める規則とは異なる．費用比較の税区分は未確認．",
        "display_text": "太陽光と蓄電池の同時設置は，それぞれ10万円，合計20万円です．購入・設置費が所定の補助額以下の場合は交付対象外です．費用の額まで補助額を減らして交付する規則ではありません．比較する費用の税込・税抜の区分は未確認です．",
        "evidence_status": "partial"
      },
      "rules": [
        {
          "id": "hokkaido-ebetsu-package",
          "government_level": "municipality",
          "prefecture_code": "01",
          "municipality_code": "01217",
          "program_name": "令和8年度江別市家庭向け脱炭素化普及促進補助金",
          "housing_ages": [
            "existing",
            "new"
          ],
          "equipment_packages": [
            "solar_plus_standard_battery"
          ],
          "application_status": "closed",
          "diagnostic_scope": {
            "status": "in_scope",
            "in_scope_housing_ages": [
              "existing",
              "new"
            ],
            "excluded_branch_ids": [],
            "basis": "現行公式本文は予算到達で受付終了．12/28は当初予定期限で，現在受付中としない．制度ルール不明：B容量定義と費用適格比較の税区分を未確定として原式保持．追加枝は既設設備条件を保持，現行新規設備診断に転用しない．原本byte・PDF目視未確認．独立採用前．"
          },
          "expense_scopes": [
            "solar",
            "battery"
          ],
          "conflict_program_ids": [],
          "official_urls": [
            "https://www.city.ebetsu.hokkaido.jp/soshiki/kankyo/128311.html",
            "https://www.city.ebetsu.hokkaido.jp/uploaded/attachment/81648.pdf"
          ],
          "confirmed_at": "2026-09-28",
          "calculation_assumptions": [
            "PV1.5kW以上10kW未満，余剰配線，B常時PV接続・Li-ion，B2kWh以上20kWh未満，双方新品・系統連系可．",
            "本人居住又は居住予定，2023/7/14以後の売買・工事契約（未締結は見積日），税非滞納，同一世帯同一設備重複不可，暴力団除外，他人所有・共有は承諾．実績・請求は2027/2/12期限．設備撤去費は対象費に含まない．",
            "併用不可：国補助併用可能．同時枝と追加枝を重複計上しない．\n上限：各設備100000円，同時合計200000円．"
          ],
          "required_confirmations": [
            "現行公式本文は予算到達で受付終了．12/28は当初予定期限で，現在受付中としない．制度ルール不明：B容量定義と費用適格比較の税区分を未確定として原式保持．追加枝は既設設備条件を保持，現行新規設備診断に転用しない．原本byte・PDF目視未確認．独立採用前．",
            "申請時の受付・残予算・製品資格・施工条件を別途確認する．"
          ],
          "source_ids": [
            "hokkaido-ebetsu-package-source-1",
            "hokkaido-ebetsu-package-source-2"
          ],
          "machine_rule": "kansai_municipal_non_adopted",
          "non_adoption_status": "excluded",
          "non_adoption_reason_code": "application_closed"
        }
      ],
      "sections": [
        {
          "label": "太陽光",
          "text": "10万円です．",
          "supplement": [
            "（出力基準）適用条件・補助額の算定に使用：太陽電池モジュールの合計出力",
            "（対象出力範囲）適用条件・補助額の算定に使用：1.5kW以上10kW未満",
            "（適用条件）対象太陽光購入・設置費（円）：100,000円超",
            "（適用条件）導入方法：太陽光・蓄電池の同時設置",
            "（未確認事項）太陽光の対象費用の税込・税抜の区分"
          ]
        },
        {
          "label": "蓄電池",
          "text": "10万円です．",
          "supplement": [
            "（対象容量範囲）適用条件・補助額の算定に使用：2kWh以上20kWh未満",
            "（適用条件）対象蓄電池購入・設置費（円）：100,000円超",
            "（適用条件）導入方法：太陽光・蓄電池の同時設置",
            "（未確認事項）蓄電池の対象費用の税込・税抜の区分"
          ]
        }
      ],
      "text": "10万円です．\n10万円です．",
      "supplement": [],
      "commonSupplement": [
        "（適用条件）太陽光の製品・接続：未使用品で，蓄電池へ接続して自家消費でき，余剰配線を備えて系統連系する設備が対象です．",
        "（適用条件）蓄電池の製品・接続：未使用のリチウムイオン蓄電池で，太陽光に常時接続して太陽光から充電し，系統連系する設備が対象です．",
        "（適用条件）居住・住宅：江別市の住民基本台帳に記載され，設備を設置する住宅に居住する，又は市内に居住予定の個人が対象です．店舗併用住宅は居住部分が対象です．",
        "（適用条件）契約時期：売買契約又は設置工事請負契約は2023年7月14日以降が対象です．未契約の場合は見積日を契約日とみなします．",
        "（適用条件）税滞納：市税の滞納がないことが必要です．",
        "（適用条件）世帯・申請回数：同一世帯に同一設備の補助申請者がいないことが必要です．交付は1世帯につき申請年度に1回です．",
        "（適用条件）申請者：暴力団員等ではないことが必要です．",
        "（適用条件）所有者同意：自己所有でない住宅又は共有住宅は，所有者等の同意が必要です．",
        "（適用条件）併用：国の補助金と併用できます．"
      ],
      "equipment": "太陽光・蓄電池",
      "conditionDisplayComplete": true,
      "conditionDisplayVersion": "shared-conditions-ebetsu-2026-10-02.1"
    },
    "hokkaido-ebetsu-solar-addition": {
      "prefecture": "01",
      "municipality": "01217",
      "recordId": "scheme-56f031aca7b5d4a05f8a",
      "targetYear": "2026年度",
      "branch": {
        "branch_id": "hokkaido-ebetsu-solar-addition",
        "diagnostic_rule_ids": [
          "hokkaido-ebetsu-solar-addition"
        ],
        "target_equipment": [
          "太陽光パネル"
        ],
        "application_start": [
          {
            "branch_id": "r8",
            "label": "当初申請期間（予算到達で早期終了）",
            "date": ""
          }
        ],
        "application_end": [
          {
            "branch_id": "r8",
            "label": "当初申請期間（予算到達で早期終了）",
            "date": "2026-12-28"
          }
        ],
        "application_status": "受付対象外",
        "amount": {
          "display_text": "太陽光：10万円です．\n（出力基準）適用条件・補助額の算定に使用：太陽電池モジュールの合計出力\n（対象出力範囲）適用条件・補助額の算定に使用：1.5kW以上10kW未満\n（適用条件）対象太陽光購入・設置費（円）：100,000円超\n（適用条件）導入方法：既設蓄電池への太陽光追加\n（未確認事項）太陽光の対象費用の税込・税抜の区分",
          "evidence_status": "confirmed",
          "summary_text": "太陽光：10万円です．"
        },
        "official_conditions": [
          "市の住民基本台帳に記載され，設備設置住所（店舗併用住宅では居住部分）に居住する，又は市内に居住予定の個人．",
          "2023年7月14日以降の売買契約又は設置工事請負契約．未契約の場合は見積日を契約日とみなす．",
          "市税の滞納がない．",
          "同一世帯で同一設備の補助申請者がいない．",
          "暴力団員等ではない．",
          "自己所有でない又は共有の住宅は所有者等の同意が必要．",
          "1世帯につき申請年度に1回．",
          "一方を新設し，他方は設置済みである．",
          "設備ごとの購入・設置費用が各10万円以下の場合，その設備は交付対象外．",
          "太陽光は蓄電池へ接続し自家消費可能，余剰配線，系統連系，未使用品．",
          "国の補助金：併用可"
        ],
        "gaps": [],
        "evidence_urls": [
          "https://www.city.ebetsu.hokkaido.jp/soshiki/kankyo/128311.html",
          "https://www.city.ebetsu.hokkaido.jp/uploaded/attachment/81648.pdf"
        ],
        "checked_at": "2026-09-28",
        "display_basis": "preparing",
        "migration_status": "pending_review",
        "legacy_municipal_rule_ids": [],
        "branch_label": "太陽光の設置（蓄電池は設置済み）"
      },
      "catalogAmount": {
        "raw_text": "既設蓄電池へPVを追加する場合100,000円．要綱第2条第3項により購入・設置費が所定補助額以下なら交付対象外．費用まで補助額を切り詰める規則とは異なる．費用比較の税区分は未確認．",
        "display_text": "既設の蓄電池に太陽光を追加する場合は10万円です．購入・設置費が所定の補助額以下の場合は交付対象外です．費用の額まで補助額を減らして交付する規則ではありません．比較する費用の税込・税抜の区分は未確認です．",
        "evidence_status": "partial"
      },
      "rules": [
        {
          "id": "hokkaido-ebetsu-solar-addition",
          "government_level": "municipality",
          "prefecture_code": "01",
          "municipality_code": "01217",
          "program_name": "令和8年度江別市家庭向け脱炭素化普及促進補助金",
          "housing_ages": [
            "existing",
            "new"
          ],
          "equipment_packages": [
            "solar_only",
            "solar_plus_standard_battery"
          ],
          "application_status": "closed",
          "diagnostic_scope": {
            "status": "in_scope",
            "in_scope_housing_ages": [
              "existing",
              "new"
            ],
            "excluded_branch_ids": [],
            "basis": "現行公式本文は予算到達で受付終了．12/28は当初予定期限で，現在受付中としない．制度ルール不明：B容量定義と費用適格比較の税区分を未確定として原式保持．追加枝は既設設備条件を保持，現行新規設備診断に転用しない．原本byte・PDF目視未確認．独立採用前．"
          },
          "expense_scopes": [
            "solar",
            "battery"
          ],
          "conflict_program_ids": [],
          "official_urls": [
            "https://www.city.ebetsu.hokkaido.jp/soshiki/kankyo/128311.html",
            "https://www.city.ebetsu.hokkaido.jp/uploaded/attachment/81648.pdf"
          ],
          "confirmed_at": "2026-09-28",
          "calculation_assumptions": [
            "PV1.5kW以上10kW未満，余剰配線，B常時PV接続・Li-ion，B2kWh以上20kWh未満，双方新品・系統連系可．",
            "本人居住又は居住予定，2023/7/14以後の売買・工事契約（未締結は見積日），税非滞納，同一世帯同一設備重複不可，暴力団除外，他人所有・共有は承諾．実績・請求は2027/2/12期限．設備撤去費は対象費に含まない．",
            "併用不可：国補助併用可能．同時枝と追加枝を重複計上しない．\n上限：各設備100000円，同時合計200000円．"
          ],
          "required_confirmations": [
            "現行公式本文は予算到達で受付終了．12/28は当初予定期限で，現在受付中としない．制度ルール不明：B容量定義と費用適格比較の税区分を未確定として原式保持．追加枝は既設設備条件を保持，現行新規設備診断に転用しない．原本byte・PDF目視未確認．独立採用前．",
            "申請時の受付・残予算・製品資格・施工条件を別途確認する．"
          ],
          "source_ids": [
            "hokkaido-ebetsu-solar-addition-source-1",
            "hokkaido-ebetsu-solar-addition-source-2"
          ],
          "machine_rule": "kansai_municipal_non_adopted",
          "non_adoption_status": "excluded",
          "non_adoption_reason_code": "application_closed"
        }
      ],
      "sections": [
        {
          "label": "太陽光",
          "text": "10万円です．",
          "supplement": [
            "（出力基準）適用条件・補助額の算定に使用：太陽電池モジュールの合計出力",
            "（対象出力範囲）適用条件・補助額の算定に使用：1.5kW以上10kW未満",
            "（適用条件）対象太陽光購入・設置費（円）：100,000円超",
            "（適用条件）導入方法：既設蓄電池への太陽光追加",
            "（未確認事項）太陽光の対象費用の税込・税抜の区分"
          ]
        }
      ],
      "text": "10万円です．",
      "supplement": [
        "（出力基準）適用条件・補助額の算定に使用：太陽電池モジュールの合計出力",
        "（対象出力範囲）適用条件・補助額の算定に使用：1.5kW以上10kW未満",
        "（適用条件）対象太陽光購入・設置費（円）：100,000円超",
        "（適用条件）導入方法：既設蓄電池への太陽光追加",
        "（未確認事項）太陽光の対象費用の税込・税抜の区分"
      ],
      "commonSupplement": [
        "（適用条件）太陽光の製品・接続：未使用品で，蓄電池へ接続して自家消費でき，余剰配線を備えて系統連系する設備が対象です．",
        "（適用条件）居住・住宅：江別市の住民基本台帳に記載され，設備を設置する住宅に居住する，又は市内に居住予定の個人が対象です．店舗併用住宅は居住部分が対象です．",
        "（適用条件）契約時期：売買契約又は設置工事請負契約は2023年7月14日以降が対象です．未契約の場合は見積日を契約日とみなします．",
        "（適用条件）税滞納：市税の滞納がないことが必要です．",
        "（適用条件）世帯・申請回数：同一世帯に同一設備の補助申請者がいないことが必要です．交付は1世帯につき申請年度に1回です．",
        "（適用条件）申請者：暴力団員等ではないことが必要です．",
        "（適用条件）所有者同意：自己所有でない住宅又は共有住宅は，所有者等の同意が必要です．",
        "（適用条件）併用：国の補助金と併用できます．"
      ],
      "equipment": "太陽光",
      "conditionDisplayComplete": true,
      "conditionDisplayVersion": "shared-conditions-ebetsu-2026-10-02.1"
    },
    "hokkaido-ebetsu-battery-addition": {
      "prefecture": "01",
      "municipality": "01217",
      "recordId": "scheme-56f031aca7b5d4a05f8a",
      "targetYear": "2026年度",
      "branch": {
        "branch_id": "hokkaido-ebetsu-battery-addition",
        "diagnostic_rule_ids": [
          "hokkaido-ebetsu-battery-addition"
        ],
        "target_equipment": [
          "蓄電池"
        ],
        "application_start": [
          {
            "branch_id": "r8",
            "label": "当初申請期間（予算到達で早期終了）",
            "date": ""
          }
        ],
        "application_end": [
          {
            "branch_id": "r8",
            "label": "当初申請期間（予算到達で早期終了）",
            "date": "2026-12-28"
          }
        ],
        "application_status": "受付対象外",
        "amount": {
          "display_text": "蓄電池：10万円です．\n（対象容量範囲）適用条件・補助額の算定に使用：2kWh以上20kWh未満\n（適用条件）対象蓄電池購入・設置費（円）：100,000円超\n（適用条件）導入方法：既設太陽光への蓄電池追加\n（未確認事項）蓄電池の対象費用の税込・税抜の区分",
          "evidence_status": "confirmed",
          "summary_text": "蓄電池：10万円です．"
        },
        "official_conditions": [
          "市の住民基本台帳に記載され，設備設置住所（店舗併用住宅では居住部分）に居住する，又は市内に居住予定の個人．",
          "2023年7月14日以降の売買契約又は設置工事請負契約．未契約の場合は見積日を契約日とみなす．",
          "市税の滞納がない．",
          "同一世帯で同一設備の補助申請者がいない．",
          "暴力団員等ではない．",
          "自己所有でない又は共有の住宅は所有者等の同意が必要．",
          "1世帯につき申請年度に1回．",
          "一方を新設し，他方は設置済みである．",
          "設備ごとの購入・設置費用が各10万円以下の場合，その設備は交付対象外．",
          "太陽光へ常時接続し太陽光から充電するリチウムイオン蓄電池，系統連系，未使用品．",
          "国の補助金：併用可"
        ],
        "gaps": [],
        "evidence_urls": [
          "https://www.city.ebetsu.hokkaido.jp/soshiki/kankyo/128311.html",
          "https://www.city.ebetsu.hokkaido.jp/uploaded/attachment/81648.pdf"
        ],
        "checked_at": "2026-09-28",
        "display_basis": "preparing",
        "migration_status": "pending_review",
        "legacy_municipal_rule_ids": [],
        "branch_label": "蓄電池の設置（太陽光は設置済み）"
      },
      "catalogAmount": {
        "raw_text": "既設PVへ蓄電池を追加する場合100,000円．要綱第2条第3項により購入・設置費が所定補助額以下なら交付対象外．費用まで補助額を切り詰める規則とは異なる．費用比較の税区分は未確認．",
        "display_text": "既設の太陽光に蓄電池を追加する場合は10万円です．購入・設置費が所定の補助額以下の場合は交付対象外です．費用の額まで補助額を減らして交付する規則ではありません．比較する費用の税込・税抜の区分は未確認です．",
        "evidence_status": "partial"
      },
      "rules": [
        {
          "id": "hokkaido-ebetsu-battery-addition",
          "government_level": "municipality",
          "prefecture_code": "01",
          "municipality_code": "01217",
          "program_name": "令和8年度江別市家庭向け脱炭素化普及促進補助金",
          "housing_ages": [
            "existing",
            "new"
          ],
          "equipment_packages": [
            "solar_plus_standard_battery"
          ],
          "application_status": "closed",
          "diagnostic_scope": {
            "status": "in_scope",
            "in_scope_housing_ages": [
              "existing",
              "new"
            ],
            "excluded_branch_ids": [],
            "basis": "現行公式本文は予算到達で受付終了．12/28は当初予定期限で，現在受付中としない．制度ルール不明：B容量定義と費用適格比較の税区分を未確定として原式保持．追加枝は既設設備条件を保持，現行新規設備診断に転用しない．原本byte・PDF目視未確認．独立採用前．"
          },
          "expense_scopes": [
            "solar",
            "battery"
          ],
          "conflict_program_ids": [],
          "official_urls": [
            "https://www.city.ebetsu.hokkaido.jp/soshiki/kankyo/128311.html",
            "https://www.city.ebetsu.hokkaido.jp/uploaded/attachment/81648.pdf"
          ],
          "confirmed_at": "2026-09-28",
          "calculation_assumptions": [
            "PV1.5kW以上10kW未満，余剰配線，B常時PV接続・Li-ion，B2kWh以上20kWh未満，双方新品・系統連系可．",
            "本人居住又は居住予定，2023/7/14以後の売買・工事契約（未締結は見積日），税非滞納，同一世帯同一設備重複不可，暴力団除外，他人所有・共有は承諾．実績・請求は2027/2/12期限．設備撤去費は対象費に含まない．",
            "併用不可：国補助併用可能．同時枝と追加枝を重複計上しない．\n上限：各設備100000円，同時合計200000円．"
          ],
          "required_confirmations": [
            "現行公式本文は予算到達で受付終了．12/28は当初予定期限で，現在受付中としない．制度ルール不明：B容量定義と費用適格比較の税区分を未確定として原式保持．追加枝は既設設備条件を保持，現行新規設備診断に転用しない．原本byte・PDF目視未確認．独立採用前．",
            "申請時の受付・残予算・製品資格・施工条件を別途確認する．"
          ],
          "source_ids": [
            "hokkaido-ebetsu-battery-addition-source-1",
            "hokkaido-ebetsu-battery-addition-source-2"
          ],
          "machine_rule": "kansai_municipal_non_adopted",
          "non_adoption_status": "excluded",
          "non_adoption_reason_code": "application_closed"
        }
      ],
      "sections": [
        {
          "label": "蓄電池",
          "text": "10万円です．",
          "supplement": [
            "（対象容量範囲）適用条件・補助額の算定に使用：2kWh以上20kWh未満",
            "（適用条件）対象蓄電池購入・設置費（円）：100,000円超",
            "（適用条件）導入方法：既設太陽光への蓄電池追加",
            "（未確認事項）蓄電池の対象費用の税込・税抜の区分"
          ]
        }
      ],
      "text": "10万円です．",
      "supplement": [
        "（対象容量範囲）適用条件・補助額の算定に使用：2kWh以上20kWh未満",
        "（適用条件）対象蓄電池購入・設置費（円）：100,000円超",
        "（適用条件）導入方法：既設太陽光への蓄電池追加",
        "（未確認事項）蓄電池の対象費用の税込・税抜の区分"
      ],
      "commonSupplement": [
        "（適用条件）蓄電池の製品・接続：未使用のリチウムイオン蓄電池で，太陽光に常時接続して太陽光から充電し，系統連系する設備が対象です．",
        "（適用条件）居住・住宅：江別市の住民基本台帳に記載され，設備を設置する住宅に居住する，又は市内に居住予定の個人が対象です．店舗併用住宅は居住部分が対象です．",
        "（適用条件）契約時期：売買契約又は設置工事請負契約は2023年7月14日以降が対象です．未契約の場合は見積日を契約日とみなします．",
        "（適用条件）税滞納：市税の滞納がないことが必要です．",
        "（適用条件）世帯・申請回数：同一世帯に同一設備の補助申請者がいないことが必要です．交付は1世帯につき申請年度に1回です．",
        "（適用条件）申請者：暴力団員等ではないことが必要です．",
        "（適用条件）所有者同意：自己所有でない住宅又は共有住宅は，所有者等の同意が必要です．",
        "（適用条件）併用：国の補助金と併用できます．"
      ],
      "equipment": "蓄電池",
      "conditionDisplayComplete": true,
      "conditionDisplayVersion": "shared-conditions-ebetsu-2026-10-02.1"
    }
  },
  "held": {
    "hokkaido-ebetsu-package": true,
    "hokkaido-ebetsu-solar-addition": true,
    "hokkaido-ebetsu-battery-addition": true,
    "yomogita-reform-2026": true,
    "fukaura-reform-pv-2026": true,
    "fukaura-vacant-reform-pv-2026": true,
    "fukaura-young-reform-pv-2026": true,
    "takko-reform-2026": true,
    "iwate-morioka-solar-2026": true,
    "iwate-miyako-residential-pv-2026": true,
    "iwate-miyako-priority-2026": true,
    "iwate-miyako-senko-2026": true,
    "iwate-kitakami-pv-battery-2026": true,
    "iwate-kuji-senko-self-owned-2026": true,
    "iwate-kuji-solar-2026": true,
    "iwate-tono-smart-eco-2026": true,
    "iwate-ichinoseki-fit-2026": true,
    "iwate-ichinoseki-non-fit-2026": true,
    "iwate-kamaishi-self-owned-2026": true,
    "iwate-shizukuishi-clean-energy-2026": true,
    "iwate-kuzumaki-2026": true,
    "iwate-shiwa-senko-2026": true,
    "iwate-yahaba-non-fit-2026": true,
    "iwate-hiraizumi-pv-battery-2026": true,
    "iwate-yamada-pv-battery-2026": true,
    "iwate-fudai-pv-battery-2026": true,
    "iwate-karumai-solar-2026": true,
    "iwate-noda-solar-2026": true,
    "iwate-kunohe-solar-2026": true,
    "iwate-hirono-renewable-2026": true,
    "iwate-hirono-reform-2026": true,
    "iwate-ichinohe-2026": true,
    "miyagi-sendai-existing-pv-battery": true,
    "miyagi-ishinomaki-renewable": true,
    "miyagi-kesennuma-smart-energy": true,
    "miyagi-natori-renewable": true,
    "miyagi-kakuda-smart-eco": true,
    "miyagi-iwanuma-decarbonization": true,
    "miyagi-higashimatsushima-senko": true,
    "miyagi-higashimatsushima-priority": true,
    "miyagi-tomiya-solar-storage": true,
    "miyagi-zao-renewable": true,
    "miyagi-shichikashuku-landscape": true,
    "miyagi-ogawara-smart-house": true,
    "miyagi-marumori-climate": true,
    "miyagi-watari-decarbonization": true,
    "miyagi-yamamoto-natural-energy": true,
    "miyagi-kami-decarbonization": true,
    "miyagi-onagawa-solar-battery": true,
    "akita-daisen-household": true,
    "yamagata-yamagata-nonfit-closed": true,
    "yamagata-tsuruoka-renewable": true,
    "yamagata-shinjo-solar": true,
    "yamagata-sagae-energy": true,
    "yamagata-kaminoyama-reform": true,
    "yamagata-murayama-solar": true,
    "yamagata-nagai-nonfit": true,
    "yamagata-higashine-solar": true,
    "yamagata-obanazawa-renewable": true,
    "yamagata-nanyo-solar-candidate": true,
    "yamagata-yamanobe-renewable": true,
    "yamagata-nakayama-solar": true,
    "yamagata-kahoku-energy": true,
    "yamagata-nishikawa-reform": true,
    "yamagata-asahi-solar": true,
    "yamagata-oe-reform": true,
    "yamagata-oishida-renewable": true,
    "yamagata-kaneyama-reform": true,
    "yamagata-mogami-nonfit": true,
    "yamagata-funagata-renewable": true,
    "yamagata-mamurogawa-solar": true,
    "yamagata-ohkura-reform": true,
    "yamagata-sakegawa-reform": true,
    "yamagata-tozawa-renewable": true,
    "yamagata-kawanishi-energy": true,
    "yamagata-oguni-reform": true,
    "yamagata-shirataka-solar": true,
    "yamagata-shirataka-battery-fit": true,
    "yamagata-shirataka-battery-existing": true,
    "yamagata-shirataka-battery-nonfit": true,
    "yamagata-iide-solar": true,
    "yamagata-iide-battery": true,
    "yamagata-mikawa-solar": true,
    "yamagata-shonai-zero": true,
    "yamagata-yuza-energy": true,
    "fukushima-fukushima-solar": true,
    "fukushima-fukushima-battery": true,
    "fukushima-aizuwakamatsu-solar": true,
    "fukushima-aizuwakamatsu-battery": true,
    "fukushima-aizuwakamatsu-leading-solar": true,
    "fukushima-aizuwakamatsu-leading-battery": true,
    "fukushima-koriyama-set": true,
    "fukushima-koriyama-battery": true,
    "fukushima-iwaki-solar": true,
    "fukushima-iwaki-battery": true,
    "fukushima-iwaki-reform": true,
    "fukushima-sukagawa-solar": true,
    "fukushima-sukagawa-battery": true,
    "fukushima-kitakata-roof-solar": true,
    "fukushima-kitakata-roof-battery": true,
    "fukushima-soma-solar": true,
    "fukushima-nihonmatsu-solar": true,
    "fukushima-nihonmatsu-battery": true,
    "fukushima-tamura-solar": true,
    "fukushima-minamisoma-roof-battery": true,
    "fukushima-date-battery": true,
    "fukushima-motomiya-solar": true,
    "fukushima-motomiya-battery": true,
    "fukushima-koori-solar": true,
    "fukushima-koori-battery": true,
    "fukushima-kawamata-solar": true,
    "fukushima-kawamata-battery": true,
    "fukushima-otama-solar": true,
    "fukushima-otama-battery": true,
    "fukushima-tenei-solar": true,
    "fukushima-shimogo-solar": true,
    "fukushima-hinoemata-solar": true,
    "fukushima-tadami-solar": true,
    "fukushima-tadami-battery": true,
    "fukushima-minamiaizu-solar": true,
    "fukushima-minamiaizu-battery": true,
    "fukushima-nishiaizu-battery": true,
    "fukushima-inawashiro-solar": true,
    "fukushima-mishima-solar": true,
    "fukushima-aizumisato-solar": true,
    "fukushima-aizumisato-battery": true,
    "fukushima-izumizaki-solar": true,
    "fukushima-yamatsuri-solar": true,
    "fukushima-yamatsuri-battery": true,
    "fukushima-ishikawa-solar": true,
    "fukushima-ishikawa-battery": true,
    "fukushima-tamakawa-solar": true,
    "fukushima-tamakawa-battery": true,
    "fukushima-hirata-solar": true,
    "fukushima-asakawa-solar": true,
    "fukushima-asakawa-battery": true,
    "fukushima-furudono-solar": true,
    "fukushima-furudono-battery": true,
    "fukushima-ono-solar": true,
    "fukushima-ono-battery": true,
    "fukushima-tomioka-solar": true,
    "fukushima-tomioka-battery": true,
    "fukushima-kawauchi-solar": true,
    "fukushima-kawauchi-battery": true,
    "fukushima-okuma-solar-nonfit": true,
    "fukushima-okuma-battery": true,
    "fukushima-futaba-solar": true,
    "fukushima-futaba-battery": true,
    "fukushima-namie-solar": true,
    "fukushima-namie-battery": true,
    "fukushima-namie-model-solar-nonfit": true,
    "fukushima-namie-model-battery-nonfit": true,
    "fukushima-katsurao-solar": true,
    "fukushima-katsurao-battery": true,
    "fukushima-shinchi-solar": true,
    "08364-c01": true,
    "08364-c02": true,
    "11231-c02": true,
    "11342-c01": true,
    "12342-c02": true,
    "12347-c02": true,
    "12403-c01": true,
    "12424-c01": true,
    "12427-c01": true,
    "12441-c01": true,
    "12463-c01": true,
    "source-9d627107fb4631": true,
    "source-79a3aa9452ecef": true,
    "niigata-residential-renewable-2026": true,
    "nagaoka-general-housing-renovation-2026": true,
    "nagaoka-snow-country-renewable-2026": true,
    "kashiwazaki-comfortable-renovation-2026": true,
    "shibata-challenge-zero-carbon-2026": true,
    "ojiya-decarbonization-equipment-2026": true,
    "tokamachi-renewable-energy-2026": true,
    "murakami-residential-solar-2026": true,
    "myoko-regional-decarbonization-2026": true,
    "agano-residential-solar-2026": true,
    "sado-clean-energy-2026": true,
    "uonuma-renewable-energy-2026": true,
    "minamiuonuma-solar-equipment-2026": true,
    "seiro-living-support-renovation-2026": true,
    "yahiko-housing-renovation-2026": true,
    "yuzawa-renewable-energy-2026": true,
    "toyama-city-solar-battery-2026": true,
    "tonami-solar-2026": true,
    "nanto-solar-2026": true,
    "imizu-residential-solar-transition-2026": true,
    "kamiichi-zero-energy-housing-2026": true,
    "asahi-comfortable-home-renovation-2026": true,
    "kanazawa-residential-battery-2026": true,
    "kanazawa-residential-renewable-energy-2026": true,
    "wajima-residential-solar-suspended-2026": true,
    "kaga-residential-renewable-energy-2026": true,
    "hakui-residential-battery-2026": true,
    "hakui-existing-home-solar-2026": true,
    "kahoku-residential-renewable-energy-2026": true,
    "hakusan-residential-renewable-energy-2026": true,
    "nomi-eco-action-points-2026": true,
    "nomi-natural-energy-equipment-2026": true,
    "tsubata-non-fit-solar-battery-2026": true,
    "nakanoto-residential-solar-2026": true,
    "anamizu-residential-solar-2026": true,
    "noto-residential-solar-2026": true,
    "fukui-city-residential-solar-battery-2026": true,
    "tsuruga-residential-solar-battery-2026": true,
    "obama-residential-solar-battery-2026": true,
    "ono-residential-solar-battery-2026": true,
    "katsuyama-residential-solar-battery-2026": true,
    "sabae-residential-solar-battery-2026": true,
    "awara-residential-solar-battery-2026": true,
    "echizen-city-residential-solar-battery-2026": true,
    "echizen-city-snow-region-solar-2026": true,
    "sakai-residential-solar-battery-2026": true,
    "eiheiji-residential-solar-battery-2026": true,
    "minamiechizen-residential-solar-battery-2026": true,
    "echizen-town-residential-solar-battery-2026": true,
    "mihama-residential-solar-battery-2026": true,
    "takahama-residential-solar-battery-2026": true,
    "ohi-residential-solar-battery-2026": true,
    "wakasa-residential-solar-battery-2026": true,
    "kofu-clean-energy-equipment-2026": true,
    "fujiyoshida-renewable-energy-equipment-2026": true,
    "tsuru-self-reliant-renewable-energy-2026": true,
    "nirasaki-residential-battery-2026": true,
    "hokuto-renewable-energy-equipment-2026": true,
    "kai-decarbonization-leading-area-housing-2026": true,
    "fuefuki-residential-solar-battery-2026": true,
    "koshu-residential-energy-equipment-2026": true,
    "nanbu-residential-solar-2026": true,
    "oshino-residential-solar-2026": true,
    "yamanakako-residential-solar-battery-2026": true,
    "fujikawaguchiko-residential-solar-battery-2026": true,
    "nagano-20203-row-15-1-2026": true,
    "nagano-20204-row-24-1-2026": true,
    "nagano-20205-row-41-1-2026": true,
    "nagano-20205-row-42-2-2026": true,
    "nagano-20206-row-25-1-2026": true,
    "nagano-20207-row-83-1-2026": true,
    "nagano-20208-row-6-1-2026": true,
    "nagano-20209-row-30-1-2026": true,
    "nagano-20210-row-32-1-2026": true,
    "nagano-20211-row-93-1-2026": true,
    "nagano-20212-row-79-1-2026": true,
    "nagano-20213-row-94-1-2026": true,
    "nagano-20214-row-26-1-2026": true,
    "nagano-20215-row-70-1-2026": true,
    "nagano-20217-row-8-1-2026": true,
    "nagano-20218-row-84-1-2026": true,
    "nagano-20219-row-16-1-2026": true,
    "nagano-20219-row-17-2-2026": true,
    "nagano-20220-row-72-1-2026": true,
    "nagano-20303-row-10-1-2026": true,
    "nagano-20304-row-12-1-2026": true,
    "nagano-20307-row-13-1-2026": true,
    "nagano-20309-row-11-1-2026": true,
    "nagano-20324-row-14-1-2026": true,
    "nagano-20349-row-21-1-2026": true,
    "nagano-20350-row-20-1-2026": true,
    "nagano-20362-row-28-1-2026": true,
    "nagano-20363-row-29-1-2026": true,
    "nagano-20383-row-34-1-2026": true,
    "nagano-20384-row-36-1-2026": true,
    "nagano-20385-row-38-1-2026": true,
    "nagano-20386-row-39-1-2026": true,
    "nagano-20388-row-40-1-2026": true,
    "nagano-20402-row-44-1-2026": true,
    "nagano-20403-row-47-1-2026": true,
    "nagano-20403-row-48-2-2026": true,
    "nagano-20407-row-51-1-2026": true,
    "nagano-20411-row-54-1-2026": true,
    "nagano-20412-row-55-1-2026": true,
    "nagano-20413-row-57-1-2026": true,
    "nagano-20414-row-58-1-2026": true,
    "nagano-20415-row-60-1-2026": true,
    "nagano-20416-row-61-1-2026": true,
    "nagano-20417-row-63-1-2026": true,
    "nagano-20425-row-65-1-2026": true,
    "nagano-20429-row-67-1-2026": true,
    "nagano-20432-row-68-1-2026": true,
    "nagano-20446-row-73-1-2026": true,
    "nagano-20450-row-75-1-2026": true,
    "nagano-20451-row-76-1-2026": true,
    "nagano-20452-row-78-1-2026": true,
    "nagano-20481-row-80-1-2026": true,
    "nagano-20485-row-81-1-2026": true,
    "nagano-20521-row-85-1-2026": true,
    "nagano-20541-row-86-1-2026": true,
    "nagano-20541-row-87-2-2026": true,
    "nagano-20543-row-89-1-2026": true,
    "nagano-20561-row-95-1-2026": true,
    "nagano-20562-row-96-1-2026": true,
    "nagano-20583-individual-search-1-2026": true,
    "nagano-20588-row-92-1-2026": true,
    "nagano-20590-row-91-1-2026": true,
    "ogaki-solar-battery-2026": true,
    "tajimi-residential-new-energy-2026": true,
    "seki-solar-battery-2026": true,
    "nakatsugawa-zero-carbon-battery-2026": true,
    "mizunami-energy-optimization-2026": true,
    "ena-residential-new-energy-2026": true,
    "toki-residential-energy-2026": true,
    "kani-residential-new-energy-2026": true,
    "yamagata-carbon-minus-household-2026": true,
    "hida-solar-battery-2026": true,
    "kaizu-solar-battery-2026": true,
    "wanouchi-solar-sunsun-2026": true,
    "ibigawa-solar-battery-2026": true,
    "ono-zero-carbon-2026": true,
    "tomika-residential-new-energy-2026": true,
    "hichiso-residential-solar-2026": true,
    "yaotsu-residential-solar-2026": true,
    "shirakawa-water-source-energy-2026": true,
    "mitake-renewable-energy-2026": true,
    "shizuoka-22130-1-2026": true,
    "shizuoka-22203-1-2026": true,
    "shizuoka-22205-1-2026": true,
    "shizuoka-22206-1-2026": true,
    "shizuoka-22207-1-2026": true,
    "shizuoka-22208-1-2026": true,
    "shizuoka-22210-1-2026": true,
    "shizuoka-22210-2-2026": true,
    "shizuoka-22211-1-2026": true,
    "shizuoka-22213-1-2026": true,
    "shizuoka-22215-1-2026": true,
    "shizuoka-22216-1-2026": true,
    "shizuoka-22221-1-2026": true,
    "shizuoka-22222-1-2026": true,
    "shizuoka-22223-1-2026": true,
    "shizuoka-22224-1-2026": true,
    "shizuoka-22225-1-2026": true,
    "shizuoka-22226-1-2026": true,
    "shizuoka-22301-1-2026": true,
    "shizuoka-22302-1-2026": true,
    "shizuoka-22304-reform-solar-base-2026": true,
    "shizuoka-22304-reform-solar-high-cost-2026": true,
    "shizuoka-22305-1-2026": true,
    "shizuoka-22325-1-2026": true,
    "shizuoka-22424-1-2026": true,
    "shizuoka-22429-1-2026": true,
    "aichi-23100-battery-2026": true,
    "aichi-23100-hems_package-2026": true,
    "aichi-23201-battery-2026": true,
    "aichi-23201-hems_package-2026": true,
    "aichi-23202-battery-2026": true,
    "aichi-23202-local_renewable_battery-2026": true,
    "aichi-23202-non_fit_package-2026": true,
    "aichi-23203-battery-2026": true,
    "aichi-23203-hems_package-2026": true,
    "aichi-23204-battery-2026": true,
    "aichi-23205-battery-2026": true,
    "aichi-23205-hems_package-2026": true,
    "aichi-23206-battery-2026": true,
    "aichi-23207-battery-2026": true,
    "aichi-23207-hems_package-2026": true,
    "aichi-23209-battery-2026": true,
    "aichi-23209-hems_package-2026": true,
    "aichi-23210-battery-2026": true,
    "aichi-23210-hems_package-2026": true,
    "aichi-23211-battery-2026": true,
    "aichi-23211-hems_package-2026": true,
    "aichi-23212-battery-2026": true,
    "aichi-23212-hems_package-2026": true,
    "aichi-23213-battery-2026": true,
    "aichi-23213-hems_package-2026": true,
    "aichi-23214-battery-2026": true,
    "aichi-23214-hems_package-2026": true,
    "aichi-23215-battery-2026": true,
    "aichi-23215-hems_package-2026": true,
    "aichi-23216-battery-2026": true,
    "aichi-23216-hems_package-2026": true,
    "aichi-23217-battery-2026": true,
    "aichi-23217-hems_package-2026": true,
    "aichi-23219-battery-2026": true,
    "aichi-23219-hems_package-2026": true,
    "aichi-23220-battery-2026": true,
    "aichi-23220-hems_package-2026": true,
    "aichi-23221-battery-2026": true,
    "aichi-23221-hems_package-2026": true,
    "aichi-23222-battery-2026": true,
    "aichi-23222-hems_package-2026": true,
    "aichi-23223-battery-2026": true,
    "aichi-23224-battery-2026": true,
    "aichi-23224-hems_package-2026": true,
    "aichi-23225-battery-2026": true,
    "aichi-23225-hems_package-2026": true,
    "aichi-23226-battery-2026": true,
    "aichi-23226-hems_package-2026": true,
    "aichi-23227-battery-2026": true,
    "aichi-23228-battery-2026": true,
    "aichi-23228-hems_package-2026": true,
    "aichi-23229-battery-2026": true,
    "aichi-23230-battery-2026": true,
    "aichi-23231-solar_and_battery-2026": true,
    "aichi-23231-hems_package-2026": true,
    "aichi-23232-battery-2026": true,
    "aichi-23232-hems_package-2026": true,
    "aichi-23233-battery-2026": true,
    "aichi-23233-hems_package-2026": true,
    "aichi-23234-battery-2026": true,
    "aichi-23234-hems_package-2026": true,
    "aichi-23235-battery-2026": true,
    "aichi-23236-solar_and_battery-2026": true,
    "aichi-23237-battery-2026": true,
    "aichi-23237-hems_package-2026": true,
    "aichi-23238-battery-2026": true,
    "aichi-23302-battery-2026": true,
    "aichi-23302-hems_package-2026": true,
    "aichi-23342-battery-2026": true,
    "aichi-23342-hems_package-2026": true,
    "aichi-23361-battery-2026": true,
    "aichi-23361-hems_package-2026": true,
    "aichi-23362-battery-2026": true,
    "aichi-23362-hems_package-2026": true,
    "aichi-23424-battery-2026": true,
    "aichi-23425-battery-2026": true,
    "aichi-23425-hems_package-2026": true,
    "aichi-23427-battery-2026": true,
    "aichi-23427-hems_package-2026": true,
    "aichi-23441-battery-2026": true,
    "aichi-23442-battery-2026": true,
    "aichi-23442-hems_package-2026": true,
    "aichi-23445-battery-2026": true,
    "aichi-23445-hems_package-2026": true,
    "aichi-23446-battery-2026": true,
    "aichi-23446-hems_package-2026": true,
    "aichi-23447-battery-2026": true,
    "aichi-23501-battery-2026": true,
    "aichi-23561-battery-2026": true,
    "aichi-23561-hems_package-2026": true,
    "aichi-23562-battery-2026": true,
    "aichi-23562-hems_package-2026": true,
    "aichi-23563-battery-2026": true,
    "aichi-23563-hems_package-2026": true,
    "mie-tsu-newenergy-pv-2026": true,
    "mie-tsu-newenergy-battery-2026": true,
    "mie-tsu-self-consumption-2026": true,
    "mie-yokkaichi-smart-pv-2026": true,
    "mie-yokkaichi-smart-battery-2026": true,
    "mie-yokkaichi-zeh-2026": true,
    "mie-yokkaichi-gx-2026": true,
    "mie-yokkaichi-pv-b-hems-addon-2026": true,
    "mie-yokkaichi-b-house-addon-2026": true,
    "mie-yokkaichi-pv-v2h-addon-2026": true,
    "mie-yokkaichi-self-consumption-2026": true,
    "mie-ise-self-consumption-2026": true,
    "mie-matsusaka-self-consumption-2026": true,
    "mie-matsusaka-decarbon-battery-2026": true,
    "mie-matsusaka-decarbon-pv-addon-2026": true,
    "mie-matsusaka-lccm-2026": true,
    "mie-matsusaka-zeh-2026": true,
    "mie-kuwana-self-consumption-2026": true,
    "mie-suzuka-self-consumption-2026": true,
    "mie-nabari-self-consumption-2026": true,
    "mie-owase-self-consumption-2026": true,
    "mie-toba-self-consumption-2026": true,
    "mie-kumano-self-consumption-2026": true,
    "mie-inabe-self-consumption-2026": true,
    "mie-shima-self-consumption-2026": true,
    "mie-iga-self-consumption-2026": true,
    "mie-kisosaki-pv-2026": true,
    "mie-kisosaki-self-consumption-2026": true,
    "mie-toin-self-consumption-2026": true,
    "mie-komono-self-consumption-2026": true,
    "mie-asahi-self-consumption-2026": true,
    "mie-kawagoe-self-consumption-2026": true,
    "mie-taki-sharp-pv-2026": true,
    "mie-taki-sharp-battery-2026": true,
    "mie-taki-self-consumption-2026": true,
    "mie-odai-self-consumption-2026": true,
    "mie-tamaki-pv-2026": true,
    "mie-tamaki-self-consumption-2026": true,
    "mie-tamaki-battery-2026": true,
    "mie-watarai-self-consumption-2026": true,
    "mie-taiki-self-consumption-2026": true,
    "mie-minamiise-self-consumption-2026": true,
    "mie-kihoku-self-consumption-2026": true,
    "mie-mihama-evidence-gap-2026": true,
    "mie-kiho-self-consumption-2026": true,
    "hikone-housing-renovation-2026": true,
    "nagahama-residential-solar-storage-2026": true,
    "omihachiman-residential-renewable-2026": true,
    "kusatsu-healthy-eco-house-solar-storage-2026": true,
    "moriyama-household-renewable-2026": true,
    "ritto-residential-solar-storage-2026": true,
    "konan-regional-decarbonization-household-2026": true,
    "takashima-residential-solar-2026": true,
    "higashiomi-eco-living-solar-storage-2026": true,
    "maibara-smart-eco-house-solar-storage-2026": true,
    "shiga-hino-housing-renovation-solar-2026": true,
    "toyosato-residential-solar-storage-2026": true,
    "kyoto-residential-self-consumption-2026": true,
    "kyoto-building-additional-pv-battery-2026": true,
    "kyoto-leading-region-housing-2026": true,
    "fukuchiyama-residential-renewable-2026": true,
    "fukuchiyama-leading-region-pv-2026": true,
    "maizuru-residential-renewable-2026": true,
    "ayabe-residential-pv-battery-2026": true,
    "ayabe-household-independent-renewable-2026": true,
    "uji-eco-action-points-2026": true,
    "uji-zero-carbon-equipment-2026": true,
    "uji-household-independent-renewable-2026": true,
    "miyazu-residential-renewable-2026": true,
    "kameoka-household-nonfit-2026": true,
    "kameoka-household-fit-2026": true,
    "joyo-carbon-neutral-2026": true,
    "muko-zero-carbon-2026": true,
    "nagaokakyo-cool-choice-2026": true,
    "yawata-household-renewable-2026": true,
    "kyotanabe-residential-battery-2026": true,
    "kyotanabe-household-nonfit-2026": true,
    "kyotanabe-household-fit-heat-2026": true,
    "kyotango-third-party-solar-2026": true,
    "kyotango-decarbonization-2026": true,
    "nantan-residential-solar-2026": true,
    "nantan-decarbonization-2026": true,
    "kizugawa-eco-life-2026": true,
    "kizugawa-residential-battery-2026": true,
    "oyamazaki-household-renewable-2026": true,
    "kumiyama-eco-action-points-2026": true,
    "kumiyama-household-nonfit-2026": true,
    "kumiyama-household-fit-2026": true,
    "ide-household-renewable-2026": true,
    "seika-household-nonfit-2026": true,
    "seika-household-fit-2026": true,
    "kyotamba-household-renewable-2026": true,
    "ine-household-renewable-2026": true,
    "yosano-household-renewable-2026": true,
    "osaka-city-house-decarbonization-2026": true,
    "sakai-smarthouse-2026": true,
    "kishiwada-globalwarming-equipment-2026": true,
    "toyonaka-smarthouse-2026": true,
    "ikeda-residential-pv-2026": true,
    "ikeda-home-battery-2026": true,
    "izumiotsu-zero-carbon-equipment-2026": true,
    "takatsuki-eco-house-2026": true,
    "kaizuka-residential-energy-2026": true,
    "hirakata-residential-renewable-2026": true,
    "ibaraki-residential-solar-2026": true,
    "izumisano-self-consumption-2026": true,
    "tondabayashi-decarbonization-2026": true,
    "kawachinagano-personal-renewable-2026": true,
    "izumi-renewable-energy-2026": true,
    "settsu-residential-energy-2026": true,
    "takaishi-zero-carbon-2026": true,
    "higashiosaka-residential-renewable-2026": true,
    "osakasayama-climate-equipment-points-2026": true,
    "kanan-residential-pv-2026": true,
    "himeji-residential-battery-2026": true,
    "himeji-self-consumption-pv-battery-2026": true,
    "amagasaki-self-consumption-pv-battery-2026": true,
    "akashi-household-decarbonization-2026": true,
    "nishinomiya-self-consumption-pv-battery-2026": true,
    "sumoto-self-consumption-pv-battery-2026": true,
    "ashiya-renewable-acceleration-2026": true,
    "itami-tamimaru-solar-club-2026": true,
    "aioi-self-consumption-pv-battery-2026": true,
    "toyooka-residential-pv-battery-2026": true,
    "toyooka-decarbonization-leading-area-2026": true,
    "kakogawa-renewable-energy-2026": true,
    "kakogawa-existing-pv-battery-2026": true,
    "ako-self-consumption-pv-battery-2026": true,
    "nishiwaki-residential-pv-battery-2026": true,
    "takarazuka-renewable-acceleration-2026": true,
    "miki-self-consumption-pv-battery-2026": true,
    "takasago-residential-pv-battery-2026": true,
    "takasago-self-consumption-pv-battery-2026": true,
    "kawanishi-self-consumption-pv-battery-2026": true,
    "ono-residential-pv-battery-2026": true,
    "sanda-self-consumption-pv-battery-2026": true,
    "kasai-residential-battery-2026": true,
    "tambasasayama-smart-energy-2026": true,
    "tambasasayama-self-consumption-pv-battery-2026": true,
    "yabu-self-consumption-pv-battery-2026": true,
    "tamba-smart-energy-2026": true,
    "tamba-self-consumption-pv-battery-2026": true,
    "minamiawaji-self-consumption-pv-battery-2026": true,
    "asago-self-consumption-pv-battery-2026": true,
    "shiso-self-consumption-pv-battery-2026": true,
    "kato-self-consumption-pv-battery-2026": true,
    "tatsuno-self-consumption-pv-battery-2026": true,
    "tatsuno-residential-battery-2026": true,
    "inagawa-self-consumption-pv-battery-2026": true,
    "taka-self-consumption-pv-battery-2026": true,
    "inami-residential-pv-battery-2026": true,
    "inami-self-consumption-pv-battery-2026": true,
    "harima-residential-pv-2026": true,
    "harima-residential-battery-2026": true,
    "harima-self-consumption-pv-battery-2026": true,
    "ichikawa-self-consumption-pv-battery-2026": true,
    "fukusaki-self-consumption-pv-battery-2026": true,
    "kamikawa-self-consumption-pv-battery-2026": true,
    "taishi-self-consumption-pv-battery-2026": true,
    "kamigori-self-consumption-pv-battery-2026": true,
    "shinonsen-renewable-energy-2026": true,
    "shinonsen-self-consumption-pv-battery-2026": true,
    "nara-residential-decarbonization-solar-storage-2026": true,
    "yamatotakada-residential-solar-storage-2026": true,
    "kashihara-ecolife-house-2026": true,
    "ikoma-energy-system-2026": true,
    "ikoma-decarbonization-residential-2026": true,
    "katsuragi-residential-solar-2026": true,
    "uda-residential-solar-uppy-2026": true,
    "yamazoe-residential-solar-2026": true,
    "yamazoe-residential-storage-2026": true,
    "oji-energy-system-battery-2026": true,
    "higashiyoshino-residential-solar-2026": true,
    "wakayama-residential-renewable-acceleration-2026": true,
    "wakayama-solar-credit-membership-2026": true,
    "kainan-residential-renewable-2026": true,
    "hashimoto-residential-renewable-2026": true,
    "arida-residential-renewable-2026": true,
    "gobo-residential-renewable-2026": true,
    "tanabe-residential-renewable-2026": true,
    "shingu-residential-renewable-2026": true,
    "kinokawa-residential-renewable-2026": true,
    "iwade-residential-renewable-2026": true,
    "kimino-residential-renewable-2026": true,
    "katsuragi-residential-renewable-2026": true,
    "kudoyama-residential-renewable-2026": true,
    "koya-residential-renewable-2026": true,
    "yuasa-residential-renewable-2026": true,
    "hirogawa-residential-renewable-2026": true,
    "aridagawa-residential-solar-storage-2026": true,
    "aridagawa-residential-renewable-nonfit-2026": true,
    "mihama-residential-renewable-2026": true,
    "hidaka-residential-renewable-2026": true,
    "yura-residential-renewable-2026": true,
    "inami-residential-renewable-2026": true,
    "minabe-residential-renewable-2026": true,
    "hidakagawa-residential-solar-storage-2026": true,
    "hidakagawa-residential-renewable-nonfit-2026": true,
    "shirahama-residential-renewable-2026": true,
    "kamitonda-residential-renewable-2026": true,
    "susami-residential-renewable-2026": true,
    "nachikatsuura-residential-renewable-2026": true,
    "taiji-residential-renewable-2026": true,
    "kozagawa-residential-renewable-2026": true,
    "kitayama-residential-renewable-2026": true,
    "kushimoto-residential-renewable-2026": true,
    "tottori-31203-closed_battery-2026": true,
    "tottori-31204-solar_battery-2026": true,
    "tottori-31302-solar_battery-2026": true,
    "tottori-31325-solar_battery-2026": true,
    "tottori-31328-solar_battery-2026": true,
    "tottori-31329-solar-2026": true,
    "tottori-31329-battery-2026": true,
    "tottori-31364-solar_battery-2026": true,
    "tottori-31370-solar_battery-2026": true,
    "tottori-31371-solar_battery-2026": true,
    "tottori-31372-solar_battery-2026": true,
    "tottori-31384-solar_battery-2026": true,
    "tottori-31386-solar_battery-2026": true,
    "tottori-31389-battery-2026": true,
    "tottori-31389-non_fit_solar-2026": true,
    "tottori-31389-non_fit_battery-2026": true,
    "tottori-31389-carport-2026": true,
    "tottori-31390-solar_battery-2026": true,
    "tottori-31401-solar_battery-2026": true,
    "tottori-31403-solar-2026": true,
    "shimane-32201-solar_battery-2026": true,
    "shimane-32202-solar_battery-2026": true,
    "shimane-32203-solar_battery-2026": true,
    "shimane-32204-solar_battery-2026": true,
    "shimane-32205-solar-2026": true,
    "shimane-32205-battery-2026": true,
    "shimane-32206-solar_battery-2026": true,
    "shimane-32209-solar_battery-2026": true,
    "shimane-32343-non_fit-2026": true,
    "shimane-32343-solar_battery-2026": true,
    "shimane-32386-solar_battery-2026": true,
    "shimane-32441-solar_battery-2026": true,
    "shimane-32448-non_fit-2026": true,
    "shimane-32449-solar_battery-2026": true,
    "shimane-32501-solar_battery-2026": true,
    "shimane-32505-solar-2026": true,
    "shimane-32505-battery-2026": true,
    "shimane-32525-solar_battery-2026": true,
    "shimane-32526-solar-2026": true,
    "shimane-32528-solar_battery-2026": true,
    "okayama-33100-main-2026": true,
    "okayama-33202-main-2026": true,
    "okayama-33202-ordinary_new_pv-2026": true,
    "okayama-33203-main-2026": true,
    "okayama-33203-excluded_solar-2026": true,
    "okayama-33204-main-2026": true,
    "okayama-33204-excluded_solar-2026": true,
    "okayama-33207-main-2026": true,
    "okayama-33209-closed_or_incompatible-2026": true,
    "okayama-33209-akiya-2026": true,
    "okayama-33210-main-2026": true,
    "okayama-33212-closed_or_incompatible-2026": true,
    "okayama-33214-main-2026": true,
    "okayama-33445-unresolved-2026": true,
    "okayama-33586-unresolved-2026": true,
    "okayama-33606-main-2026": true,
    "okayama-33643-closed_or_incompatible-2026": true,
    "okayama-33663-unresolved-2026": true,
    "okayama-33666-main-2026": true,
    "hiroshima-34100-battery-2026": true,
    "hiroshima-34202-battery-2026": true,
    "hiroshima-34202-nonfit-2026": true,
    "hiroshima-34204-battery-2026": true,
    "hiroshima-34205-reform_closed-2026": true,
    "hiroshima-34207-nonfit-2026": true,
    "hiroshima-34209-reform_unresolved-2026": true,
    "hiroshima-34210-reform_unresolved-2026": true,
    "hiroshima-34211-reform_battery-2026": true,
    "hiroshima-34212-nonfit_pv-2026": true,
    "hiroshima-34212-battery_closed-2026": true,
    "hiroshima-34213-nonfit-2026": true,
    "hiroshima-34214-reform_unresolved-2026": true,
    "hiroshima-34302-main-2026": true,
    "hiroshima-34368-reform_unresolved-2026": true,
    "hiroshima-34431-solar-2026": true,
    "hiroshima-34462-battery-2026": true,
    "hiroshima-34545-reform_unresolved-2026": true,
    "yamaguchi-35201-smart_battery-2026": true,
    "yamaguchi-35201-leading_battery-2026": true,
    "yamaguchi-35202-health_reform-2026": true,
    "yamaguchi-35202-health_reform-2026-acquisition": true,
    "yamaguchi-35202-health_reform_pv_excluded-2026": true,
    "yamaguchi-35202-renewable-2026": true,
    "yamaguchi-35204-reform_closed-2026": true,
    "yamaguchi-35206-ecolife-2026": true,
    "yamaguchi-35206-ecolife_new_not_applicable-2026": true,
    "yamaguchi-35211-reform_closed-2026": true,
    "yamaguchi-35211-battery_unconfirmed-2026": true,
    "yamaguchi-35213-reform_closed-2026": true,
    "yamaguchi-35216-reform-2026": true,
    "yamaguchi-35216-reform_new_not_applicable-2026": true,
    "yamaguchi-35305-old_pv_unconfirmed-2026": true,
    "yamaguchi-35502-reform_unconfirmed-2026": true,
    "tokushima-36201-solar_battery_closed-2026": true,
    "tokushima-36202-renewable-2026": true,
    "tokushima-36203-renovation_unconfirmed-2026": true,
    "tokushima-36204-renewable-2026": true,
    "tokushima-36205-renovation_unconfirmed-2026": true,
    "tokushima-36206-solar-2026": true,
    "tokushima-36207-reform_closed-2026": true,
    "tokushima-36207-migrant_solar_new_not_applicable-2026": true,
    "tokushima-36207-migrant_battery_unconfirmed-2026": true,
    "tokushima-36208-migrant_reform_unconfirmed-2026": true,
    "tokushima-36321-settlement_reform_unconfirmed-2026": true,
    "tokushima-36342-reform_battery_unconfirmed-2026": true,
    "tokushima-36342-reform_pv_excluded-2026": true,
    "tokushima-36368-vacant_reform_unconfirmed-2026": true,
    "tokushima-36388-solar-2026": true,
    "tokushima-36401-solar-2026": true,
    "tokushima-36402-nonfit_pair-2026": true,
    "tokushima-36405-reform_unconfirmed-2026": true,
    "tokushima-36489-renovation_unconfirmed-2026": true,
    "kagawa-37201-smart_closed-2026": true,
    "kagawa-37201-nonfit_closed-2026": true,
    "kagawa-37202-solar-2026": true,
    "kagawa-37202-battery-2026": true,
    "kagawa-37203-solar_battery-2026": true,
    "kagawa-37204-solar_battery-2026": true,
    "kagawa-37205-closed-2026": true,
    "kagawa-37206-solar_battery-2026": true,
    "kagawa-37207-solar_battery-2026": true,
    "kagawa-37208-solar_battery-2026": true,
    "kagawa-37322-solar-2026": true,
    "kagawa-37322-nonfit-2026": true,
    "kagawa-37324-solar_battery-2026": true,
    "kagawa-37341-closed-2026": true,
    "kagawa-37364-solar-2026": true,
    "kagawa-37364-battery_capacity_unconfirmed-2026": true,
    "kagawa-37386-solar_battery-2026": true,
    "kagawa-37387-solar_battery-2026": true,
    "kagawa-37387-nonfit-2026": true,
    "kagawa-37403-reform_equipment_unconfirmed-2026": true,
    "kagawa-37403-solar_battery-2026": true,
    "kagawa-37404-solar-2026": true,
    "kagawa-37406-solar_battery-2026": true,
    "ehime-38201-energy-2026": true,
    "ehime-38201-nonfit-2026": true,
    "ehime-38202-nonfit-2026": true,
    "ehime-38202-energy_closed-2026": true,
    "ehime-38203-reform_battery_unconfirmed-2026": true,
    "ehime-38203-reform_solar_excluded-2026": true,
    "ehime-38203-energy-2026": true,
    "ehime-38204-energy-2026": true,
    "ehime-38205-nonfit-2026": true,
    "ehime-38206-energy-2026": true,
    "ehime-38206-nonfit-2026": true,
    "ehime-38207-energy-2026": true,
    "ehime-38207-migration_battery-2026": true,
    "ehime-38210-energy-2026": true,
    "ehime-38213-energy-2026": true,
    "ehime-38213-migration_battery-2026": true,
    "ehime-38214-migration_suspended-2026": true,
    "ehime-38215-energy-2026": true,
    "ehime-38356-reform_old_year-2026": true,
    "ehime-38386-migration_old_year-2026": true,
    "ehime-38386-energy-2026": true,
    "ehime-38401-energy-2026": true,
    "ehime-38402-reform_closed-2026": true,
    "ehime-38402-energy_closed-2026": true,
    "ehime-38422-energy-2026": true,
    "ehime-38442-energy-2026": true,
    "ehime-38442-migration_battery-2026": true,
    "ehime-38484-migration_unavailable-2026": true,
    "ehime-38484-energy-2026": true,
    "ehime-38488-energy-2026": true,
    "ehime-38506-general_reform_unconfirmed-2026": true,
    "ehime-38506-energy-2026": true,
    "ehime-38506-migration_battery-2026": true,
    "kochi-39201-nonfit-2026": true,
    "kochi-39201-prior_pv-2026": true,
    "kochi-39202-energy-2026": true,
    "kochi-39202-marriage-2026": true,
    "kochi-39203-energy-2026": true,
    "kochi-39204-solar-2026": true,
    "kochi-39204-paired-2026": true,
    "kochi-39205-energy-2026": true,
    "kochi-39206-reform-2026": true,
    "kochi-39206-energy-2026": true,
    "kochi-39208-migration-2026": true,
    "kochi-39209-energy-2026": true,
    "kochi-39210-energy-2026": true,
    "kochi-39211-paired-2026": true,
    "kochi-39212-energy-2026": true,
    "kochi-39212-marriage-2026": true,
    "kochi-39301-energy-2026": true,
    "kochi-39302-energy-2026": true,
    "kochi-39303-reform_battery-2026": true,
    "kochi-39303-energy-2026": true,
    "kochi-39304-energy-2026": true,
    "kochi-39305-energy-2026": true,
    "kochi-39305-nonfit-2026": true,
    "kochi-39307-energy-2026": true,
    "kochi-39341-energy-2026": true,
    "kochi-39344-energy-2026": true,
    "kochi-39363-nonfit-2026": true,
    "kochi-39386-energy-2026": true,
    "kochi-39387-energy-2026": true,
    "kochi-39387-reform-2026": true,
    "kochi-39401-energy-2026": true,
    "kochi-39401-marriage-2026": true,
    "kochi-39402-energy-2026": true,
    "kochi-39403-energy-2026": true,
    "kochi-39405-battery-2026": true,
    "kochi-39405-solar-2026": true,
    "kochi-39410-suspended-2026": true,
    "kochi-39411-energy-2026": true,
    "kochi-39412-energy-2026": true,
    "kochi-39424-energy-2026": true,
    "kochi-39427-migration-2026": true,
    "kochi-39428-nonfit-2026": true,
    "kochi-39428-battery-2026": true,
    "fukuoka-40130-battery-2026": true,
    "fukuoka-40204-reform_battery-2026": true,
    "fukuoka-40204-reform_pv-2026": true,
    "fukuoka-40204-vacant_reform-2026": true,
    "fukuoka-40205-reform-2026": true,
    "fukuoka-40207-energy-2026": true,
    "fukuoka-40210-nonfit-2026": true,
    "fukuoka-40217-energy-2026": true,
    "fukuoka-40219-energy-2026": true,
    "fukuoka-40220-nonfit-2026": true,
    "fukuoka-40221-energy-2026": true,
    "fukuoka-40225-district_battery-2026": true,
    "fukuoka-40225-district_solar-2026": true,
    "fukuoka-40227-solar-2026": true,
    "fukuoka-40228-energy-2026": true,
    "fukuoka-40229-energy-2026": true,
    "fukuoka-40230-existing_pv-2026": true,
    "fukuoka-40230-nonfit-2026": true,
    "fukuoka-40231-reform_pv-2026": true,
    "fukuoka-40381-solar-2026": true,
    "fukuoka-40402-reform-2026": true,
    "fukuoka-40447-energy-2026": true,
    "fukuoka-40448-solar-2026": true,
    "fukuoka-40522-battery-2026": true,
    "fukuoka-40522-nonfit-2026": true,
    "fukuoka-40604-solar-2026": true,
    "fukuoka-40642-energy_unavailable-2026": true,
    "fukuoka-40646-energy-2026": true,
    "saga-41201-acceleration-nonfit-2026": true,
    "saga-41201-city-pv-2026": true,
    "saga-41201-city-battery-2026": true,
    "saga-41201-vacant-reform-unconfirmed-2026": true,
    "saga-41201-vacant-reform-pv-2026": true,
    "saga-41202-acceleration-nonfit-2026": true,
    "saga-41203-acceleration-nonfit-2026": true,
    "saga-41203-vacant-reform-unconfirmed-2026": true,
    "saga-41204-acceleration-nonfit-2026": true,
    "saga-41205-acceleration-nonfit-2026": true,
    "saga-41205-return-reform-unconfirmed-2026": true,
    "saga-41206-acceleration-nonfit-2026": true,
    "saga-41207-acceleration-nonfit-2026": true,
    "saga-41207-city-pv-2026": true,
    "saga-41208-acceleration-nonfit-2026": true,
    "saga-41208-vacant-reform-2026": true,
    "saga-41208-ashikari-reform-unconfirmed-2026": true,
    "saga-41208-ashikari-reform-pv-2026": true,
    "saga-41209-acceleration-nonfit-2026": true,
    "saga-41209-vacant-reform-unconfirmed-2026": true,
    "saga-41210-acceleration-nonfit-2026": true,
    "saga-41210-vacant-reform-unconfirmed-2026": true,
    "saga-41327-acceleration-unretrieved-2026": true,
    "saga-41341-acceleration-nonfit-2026": true,
    "saga-41341-housing-reform-pv-2026": true,
    "saga-41341-independent-pv-nonfit-2026": true,
    "saga-41345-acceleration-nonfit-2026": true,
    "saga-41345-town-pv-2026": true,
    "saga-41346-acceleration-nonfit-2026": true,
    "saga-41346-vacant-reform-unconfirmed-2026": true,
    "saga-41387-acceleration-nonfit-2026": true,
    "saga-41387-vacant-reform-unconfirmed-2026": true,
    "saga-41401-acceleration-nonfit-2026": true,
    "saga-41401-vacant-reform-unconfirmed-2026": true,
    "saga-41401-vacant-reform-pv-2026": true,
    "saga-41423-acceleration-nonfit-2026": true,
    "saga-41423-legacy-reform-unconfirmed-2026": true,
    "saga-41424-acceleration-nonfit-2026": true,
    "saga-41425-acceleration-nonfit-2026": true,
    "saga-41441-acceleration-nonfit-2026": true,
    "nagasaki-42201-acceleration-nonfit-2026": true,
    "nagasaki-42201-reform-0-2026": true,
    "nagasaki-42201-reform-pv-2026": true,
    "nagasaki-42202-reform-0-2026": true,
    "nagasaki-42202-acceleration-nonfit-2026": true,
    "nagasaki-42203-acceleration-nonfit-2026": true,
    "nagasaki-42204-reform-0-2026": true,
    "nagasaki-42204-acceleration-nonfit-2026": true,
    "nagasaki-42204-reform-1-2026": true,
    "nagasaki-42205-reform-0-2026": true,
    "nagasaki-42205-acceleration-nonfit-2026": true,
    "nagasaki-42207-city-pv-2026": true,
    "nagasaki-42207-city-battery-2026": true,
    "nagasaki-42207-reform-1-2026": true,
    "nagasaki-42207-reform-0-2026": true,
    "nagasaki-42208-reform-0-2026": true,
    "nagasaki-42208-acceleration-nonfit-2026": true,
    "nagasaki-42208-reform-1-2026": true,
    "nagasaki-42209-acceleration-nonfit-2026": true,
    "nagasaki-42209-reform-0-2026": true,
    "nagasaki-42210-reform-0-2026": true,
    "nagasaki-42210-acceleration-nonfit-2026": true,
    "nagasaki-42210-reform-1-2026": true,
    "nagasaki-42211-reform-0-2026": true,
    "nagasaki-42211-post-fit-battery-2026": true,
    "nagasaki-42212-acceleration-nonfit-2026": true,
    "nagasaki-42213-reform-0-2026": true,
    "nagasaki-42213-acceleration-nonfit-2026": true,
    "nagasaki-42214-acceleration-nonfit-2026": true,
    "nagasaki-42307-reform-0-2026": true,
    "nagasaki-42307-acceleration-nonfit-2026": true,
    "nagasaki-42308-acceleration-nonfit-2026": true,
    "nagasaki-42308-reform-0-2026": true,
    "nagasaki-42321-reform-0-2026": true,
    "nagasaki-42321-acceleration-nonfit-2026": true,
    "nagasaki-42322-acceleration-nonfit-2026": true,
    "nagasaki-42322-reform-1-2026": true,
    "nagasaki-42322-reform-0-2026": true,
    "nagasaki-42323-reform-0-2026": true,
    "nagasaki-42323-acceleration-nonfit-2026": true,
    "nagasaki-42383-reform-2-2026": true,
    "nagasaki-42383-acceleration-nonfit-2026": true,
    "nagasaki-42383-reform-0-2026": true,
    "nagasaki-42383-reform-1-2026": true,
    "nagasaki-42391-reform-0-2026": true,
    "nagasaki-42391-acceleration-nonfit-2026": true,
    "nagasaki-42411-acceleration-nonfit-2026": true,
    "kumamoto-city-pv-battery-2026-first": true,
    "kumamoto-city-pv-battery-2026-second": true,
    "kumamoto-43100-vacant-reform-2026": true,
    "kumamoto-city-battery-graduate-fit-2026-first": true,
    "kumamoto-city-battery-graduate-fit-2026-second": true,
    "yatsushiro-pv-2026": true,
    "yatsushiro-battery-2026": true,
    "yatsushiro-pv-battery-2026": true,
    "kumamoto-43203-general-reform-2026": true,
    "kumamoto-43204-zero-carbon-pv-2026": true,
    "kumamoto-43204-zero-carbon-battery-2026": true,
    "kumamoto-43204-zero-carbon-zeh-2026": true,
    "kumamoto-43204-zero-carbon-zeh-plus-2026": true,
    "kumamoto-43205-vacant-reform-2026": true,
    "kikuchi-pv-2026": true,
    "kumamoto-43211-reform-voucher-2026": true,
    "kamiamakusa-energy-solar-2026": true,
    "kamiamakusa-energy-battery-2026": true,
    "kumamoto-43214-vacant-reform-2026": true,
    "amakusa-pv-2026": true,
    "amakusa-battery-2026": true,
    "nankan-battery-2026": true,
    "kumamoto-43368-reform-2026": true,
    "minamioguni-pv-2026": true,
    "minamioguni-pv-battery-2026": true,
    "kumamoto-43424-reform-2026": true,
    "kumamoto-43425-general-reform-2026": true,
    "kumamoto-43425-vacant-reform-2026": true,
    "takamori-pv-2026": true,
    "kumamoto-43433-vacant-reform-battery-2026": true,
    "kashima-pv-2026": true,
    "mashiki-energy-battery-2026": true,
    "mashiki-energy-combined-2026": true,
    "yamato-residential-solar-2026": true,
    "yamato-self-consumption-2026": true,
    "hikawa-pv-2026": true,
    "kumamoto-43468-reform-2026": true,
    "kumamoto-43482-legacy-pv-2026": true,
    "kumamoto-43501-reform-2026": true,
    "kumamoto-43505-reform-2026": true,
    "kumamoto-43510-migration-reform-existing-2026": true,
    "kumamoto-43510-migration-reform-vacant-2026": true,
    "kumamoto-43512-health-reform-2026": true,
    "kumamoto-43512-renewable-pv-2026": true,
    "kumamoto-43512-renewable-battery-2026": true,
    "kumamoto-43513-reform-2026": true,
    "asagiri-residential-solar-2026": true,
    "reihoku-pv-2026": true,
    "reihoku-battery-2026": true,
    "kumamoto-43531-vacant-reform-battery-2026": true,
    "oita-city-renewable-battery-2026": true,
    "oita-city-renewable-v2h-2026": true,
    "oita-city-leading-pv-2026": true,
    "oita-city-leading-battery-2026": true,
    "oita-nakatsu-decarbon-pv-battery-2026": true,
    "oita-nakatsu-decarbon-carport-2026": true,
    "oita-nakatsu-decarbon-zeh-2026": true,
    "miyazaki-city-closed-pv-2026": true,
    "miyazaki-city-closed-battery-2026": true,
    "miyazaki-city-leading-pv-2026": true,
    "miyazaki-city-leading-pv-new-zeb-2026": true,
    "miyazaki-nobeoka-leading-pending-2026": true,
    "miyazaki-kushima-closed-pv-battery-2026": true,
    "miyazaki-kushima-closed-battery-addition-2026": true,
    "miyazaki-mimata-pv-2026": true,
    "miyazaki-mimata-battery-2026": true,
    "kagoshima-city-closed-pv-2026": true,
    "kagoshima-city-closed-battery-2026": true,
    "kagoshima-kanoya-pv-2026": true,
    "kagoshima-kanoya-battery-2026": true,
    "kagoshima-tarumizu-battery-2026": true,
    "kagoshima-satsumasendai-battery-2026": true,
    "kagoshima-satsumasendai-zeh-2026": true,
    "kagoshima-amami-reform-first-2026": true,
    "kagoshima-amami-reform-second-2026": true,
    "kagoshima-amami-reform-third-2026": true,
    "kagoshima-satsuma-pv-2026": true,
    "kagoshima-satsuma-battery-2026": true,
    "kagoshima-osaki-pv-2026": true,
    "kagoshima-osaki-battery-2026": true,
    "kagoshima-kimotsuki-pv-2026": true,
    "kagoshima-kimotsuki-battery-2026": true,
    "kagoshima-tatsugo-reform-2026": true,
    "okinawa-ishigaki-pv-2026": true,
    "okinawa-nago-pv-2026": true,
    "okinawa-higashi-pv-2026": true,
    "okinawa-yomitan-pv-2026": true,
    "okinawa-yonabaru-pv-2026": true,
    "okinawa-haebaru-reform-candidate-2026": true,
    "okinawa-taketomi-reform-candidate-2026": true,
    "source-2cc7e0f7105d32": true,
    "source-7b3f14aadeab02": true,
    "source-a031b8bb5f5bae": true,
    "source-e1f64b52c444eb": true,
    "source-4dae564df25330": true,
    "source-4bacefa7f22db7": true,
    "source-aaf5fd3f1ec7b9": true,
    "source-fb2531d1168922": true,
    "source-6888c9ed4f877d": true,
    "source-9c13d177706de3": true,
    "source-377e138c5e25df": true,
    "source-290ef2b54f9853": true,
    "source-3afdddc2892448": true,
    "source-45b61b1d9620d9": true,
    "source-95306d0ba9bd1e": true,
    "source-02b8f832ec0ae3": true,
    "source-3539c61c5cdf00": true,
    "source-184038c8394daa": true,
    "source-0d74d5dc12d752": true,
    "source-4577434d49f8ba": true,
    "source-96336e77fd6bc4": true,
    "source-94879a61a616bf": true,
    "source-e02713a4cad409": true,
    "source-caf89acead7aa7": true,
    "source-d60243eb708ddc": true,
    "source-db581281b787cc": true,
    "source-039ed30d9e1028": true,
    "source-70545a82aa3b1e": true,
    "fukuoka-40225-new_housing_equipment-2026": true,
    "fukuoka-40225-used_housing_equipment-2026": true,
    "fukuoka-40402-new_housing_equipment-2026": true,
    "fukuoka-40402-used_housing_equipment-2026": true,
    "aomori-city-self-consumption-pv-2026": true,
    "aomori-city-self-consumption-battery-2026": true,
    "hirosaki-self-consumption-pv-2026": true,
    "hirosaki-self-consumption-battery-2026": true,
    "hachinohe-self-consumption-pv-2026": true,
    "hachinohe-self-consumption-battery-2026": true,
    "mutsu-self-consumption-pv-2026": true,
    "mutsu-self-consumption-battery-2026": true,
    "aomori-02206-self-consumption-pv-2026": true,
    "aomori-02206-self-consumption-battery-2026": true,
    "aomori-02362-self-consumption-pv-2026": true,
    "aomori-02362-self-consumption-battery-2026": true,
    "source-8b3f0bcef0b743": true,
    "source-9fa6ae61ffbc9e": true,
    "source-5049667b0ed329": true,
    "kashiwazaki-low-carbon-equipment-2026": true,
    "myoko-housing-acquisition-support-2026": true,
    "himi-residential-energy-resource-2026": true,
    "aichi-23208-battery-2026": true,
    "aichi-23208-hems_package-2026": true,
    "ujitawara-household-renewable-2026": true,
    "shimane-32203-zeh-2026": true,
    "hiroshima-34215-external_work-2026": true,
    "ehime-38202-leading_area-2026": true,
    "miyazaki-gokase-akiya-2026": true,
    "miyazaki-gokase-migration-house-2026": true,
    "okinawa-city-pv-2026": true,
    "iwate-oshu-battery-reform-2026": true,
    "miyagi-sendai-certified-new-house": true,
    "miyagi-sendai-new-pv-battery": true,
    "hokkaido-additional-akkeshi-pv": true,
    "hokkaido-additional-atsuma-0": true,
    "hokkaido-additional-atsuma-1": true,
    "hokkaido-additional-furubira-pv-battery": true,
    "hokkaido-additional-shintotsukawa-reform-solar": true,
    "hokkaido-additional-shintotsukawa-reform-battery": true,
    "hokkaido-additional-nakafurano-solar": true,
    "hokkaido-additional-nakafurano-battery": true,
    "hokkaido-additional-mashike-solar": true,
    "hokkaido-additional-hamanaka-solar": true,
    "hokkaido-asahikawa-battery": true,
    "hokkaido-iwamizawa-package": true,
    "hokkaido-furano-solar": true,
    "hokkaido-tomakomai-city-battery": true,
    "hokkaido-shari-solar": true,
    "hokkaido-shari-package": true
  },
  "displayPolicies": {
    "aomori-02411-prefecture-linked-prelaunch-2026": {
      "prefecture": "02",
      "municipality": "02411",
      "recordId": "scheme-fd51bfc841871672683f",
      "targetYear": "2026",
      "branch": {
        "branch_id": "aomori-02411-prefecture-linked-prelaunch-2026",
        "diagnostic_rule_ids": [
          "aomori-02411-prefecture-linked-prelaunch-2026"
        ],
        "target_equipment": [
          "太陽光パネル",
          "蓄電池"
        ],
        "application_start": [
          {
            "branch_id": "aomori-02411-prefecture-linked-prelaunch-2026",
            "label": "交付申請",
            "date": ""
          }
        ],
        "application_end": [
          {
            "branch_id": "aomori-02411-prefecture-linked-prelaunch-2026",
            "label": "交付申請",
            "date": ""
          }
        ],
        "application_status": "不明",
        "amount": {
          "display_text": "県の共通案内の参考額は，太陽光が1kW当たり5万円，上限25万円，蓄電池が対象経費の3分の1，上限35万円です．蓄電池の1kWh当たり14.1万円は対象経費の単価です．村の交付要綱と確定した募集条件は未確認のため，村の確定した補助額としては扱えません．",
          "evidence_status": "partial"
        },
        "official_conditions": [],
        "gaps": [],
        "evidence_urls": [
          "https://aomori-taiyoko.pref.aomori.lg.jp/residential/status/",
          "https://aomori-taiyoko.pref.aomori.lg.jp/residential/"
        ],
        "checked_at": "2026-09-27",
        "display_basis": "preparing",
        "migration_status": "pending_review",
        "legacy_municipal_rule_ids": []
      },
      "catalogAmount": {
        "raw_text": "県共通案内ではPV5万円/kW・上限25万円，蓄電池対象経費1/3・上限35万円（対象経費単価14.1万円/kWh）．村独自の交付要綱・確定募集条件を未確認であり，村の確定原式として転記しない．",
        "display_text": "県の共通案内の参考額は，太陽光が1kW当たり5万円，上限25万円，蓄電池が対象経費の3分の1，上限35万円です．蓄電池の1kWh当たり14.1万円は対象経費の単価です．村の交付要綱と確定した募集条件は未確認のため，村の確定した補助額としては扱えません．",
        "evidence_status": "partial"
      },
      "rules": [
        {
          "id": "aomori-02411-prefecture-linked-prelaunch-2026",
          "government_level": "municipality",
          "prefecture_code": "02",
          "municipality_code": "02411",
          "program_name": "六ヶ所村住宅用自家消費型太陽光発電設備等導入支援事業（県案内・募集前）",
          "housing_ages": [
            "existing",
            "new"
          ],
          "equipment_packages": [
            "solar_only",
            "solar_plus_standard_battery"
          ],
          "application_status": "unknown",
          "diagnostic_scope": {
            "status": "in_scope",
            "in_scope_housing_ages": [
              "existing",
              "new"
            ],
            "excluded_branch_ids": [],
            "basis": "受付状態不明：県公式受付状況は「募集前」．開始日・年度内の実施確定・村独自要綱が未確認．確定した予定公募とみなさず候補に保持．六ヶ所村の独自住宅用新エネルギー制度と別制度．"
          },
          "expense_scopes": [
            "solar",
            "battery"
          ],
          "conflict_program_ids": [],
          "official_urls": [
            "https://aomori-taiyoko.pref.aomori.lg.jp/residential/status/",
            "https://aomori-taiyoko.pref.aomori.lg.jp/residential/"
          ],
          "confirmed_at": "2026-09-27",
          "calculation_assumptions": [
            "本人所有・本人居住の戸建1戸をモデルとして採用．住宅性能の個別条件は対象設備・その他条件に記す．",
            "本人居住の個人を検討対象とし，資料で定める住民登録・税等要件は充足を仮定．他の属性は原文の条件を参照し推測で追加しない．",
            "県案内は非FIT・非FIP及び新設PVと蓄電池同時導入．村の詳細条件は未確認．",
            "併用不可：確認資料に明記なし．相手制度側の制限を別途適用．\n上限：個別の金額式のとおり．他制度との共通上限は未確認．",
            "本人所有・本人居住の戸建を仮定．公式に住宅所有の限定がない場合は仮定として区別．"
          ],
          "required_confirmations": [
            "受付状態不明：県公式受付状況は「募集前」．開始日・年度内の実施確定・村独自要綱が未確認．確定した予定公募とみなさず候補に保持．六ヶ所村の独自住宅用新エネルギー制度と別制度．",
            "最新の受付・予算残高，対象機種・資格・申請順序を申請時に確認する．",
            "交付申請受付：開始日未確認〜固定締切日未確認．工事完了・実績報告の期限とは別．"
          ],
          "source_ids": [
            "kansai-02-aomori-02411-prefecture-linked-prelaunch-2026-source-1",
            "kansai-02-aomori-02411-prefecture-linked-prelaunch-2026-source-2"
          ],
          "machine_rule": "kansai_municipal_non_adopted",
          "non_adoption_status": "candidate",
          "non_adoption_reason_code": "calculation_detail_unconfirmed"
        }
      ],
      "policy": {
        "kind": "other_authority_reference",
        "notice": "市区町村の制度・補助額は未確認です．公式窓口でご確認ください．"
      },
      "institutionalSource": "5e34c4a304c7fa04a756b25a2bd8ac52a196cf82707e3fd94510ed4f213d748f"
    },
    "aomori-02424-prefecture-linked-prelaunch-2026": {
      "prefecture": "02",
      "municipality": "02424",
      "recordId": "scheme-5064124bcab8cff10b2e",
      "targetYear": "2026",
      "branch": {
        "branch_id": "aomori-02424-prefecture-linked-prelaunch-2026",
        "diagnostic_rule_ids": [
          "aomori-02424-prefecture-linked-prelaunch-2026"
        ],
        "target_equipment": [
          "太陽光パネル",
          "蓄電池"
        ],
        "application_start": [
          {
            "branch_id": "aomori-02424-prefecture-linked-prelaunch-2026",
            "label": "交付申請",
            "date": ""
          }
        ],
        "application_end": [
          {
            "branch_id": "aomori-02424-prefecture-linked-prelaunch-2026",
            "label": "交付申請",
            "date": ""
          }
        ],
        "application_status": "不明",
        "amount": {
          "display_text": "県の共通案内の参考額は，太陽光が1kW当たり5万円，上限25万円，蓄電池が対象経費の3分の1，上限35万円です．蓄電池の1kWh当たり14.1万円は対象経費の単価です．村の交付要綱と確定した募集条件は未確認のため，村の確定した補助額としては扱えません．",
          "evidence_status": "partial"
        },
        "official_conditions": [],
        "gaps": [],
        "evidence_urls": [
          "https://aomori-taiyoko.pref.aomori.lg.jp/residential/status/",
          "https://aomori-taiyoko.pref.aomori.lg.jp/residential/"
        ],
        "checked_at": "2026-09-27",
        "display_basis": "preparing",
        "migration_status": "pending_review",
        "legacy_municipal_rule_ids": []
      },
      "catalogAmount": {
        "raw_text": "県共通案内ではPV5万円/kW・上限25万円，蓄電池対象経費1/3・上限35万円（対象経費単価14.1万円/kWh）．村独自の交付要綱・確定募集条件を未確認であり，村の確定原式として転記しない．",
        "display_text": "県の共通案内の参考額は，太陽光が1kW当たり5万円，上限25万円，蓄電池が対象経費の3分の1，上限35万円です．蓄電池の1kWh当たり14.1万円は対象経費の単価です．村の交付要綱と確定した募集条件は未確認のため，村の確定した補助額としては扱えません．",
        "evidence_status": "partial"
      },
      "rules": [
        {
          "id": "aomori-02424-prefecture-linked-prelaunch-2026",
          "government_level": "municipality",
          "prefecture_code": "02",
          "municipality_code": "02424",
          "program_name": "東通村住宅用自家消費型太陽光発電設備等導入支援事業（県案内・募集前）",
          "housing_ages": [
            "existing",
            "new"
          ],
          "equipment_packages": [
            "solar_only",
            "solar_plus_standard_battery"
          ],
          "application_status": "unknown",
          "diagnostic_scope": {
            "status": "in_scope",
            "in_scope_housing_ages": [
              "existing",
              "new"
            ],
            "excluded_branch_ids": [],
            "basis": "受付状態不明：県公式受付状況は「募集前」．開始日・年度内の実施確定・村独自要綱が未確認．確定した予定公募とみなさず候補に保持．六ヶ所村の独自住宅用新エネルギー制度と別制度．"
          },
          "expense_scopes": [
            "solar",
            "battery"
          ],
          "conflict_program_ids": [],
          "official_urls": [
            "https://aomori-taiyoko.pref.aomori.lg.jp/residential/status/",
            "https://aomori-taiyoko.pref.aomori.lg.jp/residential/"
          ],
          "confirmed_at": "2026-09-27",
          "calculation_assumptions": [
            "本人所有・本人居住の戸建1戸をモデルとして採用．住宅性能の個別条件は対象設備・その他条件に記す．",
            "本人居住の個人を検討対象とし，資料で定める住民登録・税等要件は充足を仮定．他の属性は原文の条件を参照し推測で追加しない．",
            "県案内は非FIT・非FIP及び新設PVと蓄電池同時導入．村の詳細条件は未確認．",
            "併用不可：確認資料に明記なし．相手制度側の制限を別途適用．\n上限：個別の金額式のとおり．他制度との共通上限は未確認．",
            "本人所有・本人居住の戸建を仮定．公式に住宅所有の限定がない場合は仮定として区別．"
          ],
          "required_confirmations": [
            "受付状態不明：県公式受付状況は「募集前」．開始日・年度内の実施確定・村独自要綱が未確認．確定した予定公募とみなさず候補に保持．六ヶ所村の独自住宅用新エネルギー制度と別制度．",
            "最新の受付・予算残高，対象機種・資格・申請順序を申請時に確認する．",
            "交付申請受付：開始日未確認〜固定締切日未確認．工事完了・実績報告の期限とは別．"
          ],
          "source_ids": [
            "kansai-02-aomori-02424-prefecture-linked-prelaunch-2026-source-1",
            "kansai-02-aomori-02424-prefecture-linked-prelaunch-2026-source-2"
          ],
          "machine_rule": "kansai_municipal_non_adopted",
          "non_adoption_status": "candidate",
          "non_adoption_reason_code": "calculation_detail_unconfirmed"
        }
      ],
      "policy": {
        "kind": "other_authority_reference",
        "notice": "村の制度・補助額は未確認です．公式窓口でご確認ください．"
      },
      "institutionalSource": "1cd578aa09054eca59375553bbba3646e795b4f8e8634bd51f72e83782180759"
    },
    "fukushima-yabuki-solar": {
      "prefecture": "07",
      "municipality": "07466",
      "recordId": "scheme-bf98ed93820d85c023fe",
      "targetYear": "2026年度",
      "branch": {
        "branch_id": "fukushima-yabuki-solar",
        "diagnostic_rule_ids": [
          "fukushima-yabuki-solar"
        ],
        "target_equipment": [
          "太陽光パネル"
        ],
        "application_start": [
          {
            "branch_id": "application",
            "label": "交付申請",
            "date": ""
          }
        ],
        "application_end": [
          {
            "branch_id": "application",
            "label": "交付申請",
            "date": ""
          }
        ],
        "application_status": "受付対象外",
        "amount": {
          "display_text": "保存本文では2026年度は実施しないとされています．掲載された旧太陽光額は，モジュール公称最大出力の小数点第3位以下を切り捨て，補助上限4kWまで1kW当たり30,000円，金額上限120,000円，千円未満切捨てです．税区分・低額費用上限・他制度併用は未確認で，当年度の交付可能額とは扱いません．",
          "evidence_status": "partial"
        },
        "official_conditions": [],
        "gaps": [],
        "evidence_urls": [
          "https://www.town.yabuki.fukushima.jp/page/page001527.html",
          "https://www.town.yabuki.fukushima.jp/data/doc/1562819624_doc_12_0.pdf"
        ],
        "checked_at": "2026-09-28",
        "display_basis": "preparing",
        "migration_status": "pending_review",
        "legacy_municipal_rule_ids": []
      },
      "catalogAmount": {
        "raw_text": "令和8年度は実施なし．以下は掲載された旧条件の保持：モジュール公称最大出力（kW）の小数点第3位以下切捨て×30,000円，4kW上限/120,000円上限，千円未満切捨て．当年度交付可能額とは扱わない．税・低額費用上限は未確認．",
        "display_text": "保存本文では2026年度は実施しないとされています．掲載された旧太陽光額は，モジュール公称最大出力の小数点第3位以下を切り捨て，補助上限4kWまで1kW当たり30,000円，金額上限120,000円，千円未満切捨てです．税区分・低額費用上限・他制度併用は未確認で，当年度の交付可能額とは扱いません．",
        "evidence_status": "partial"
      },
      "rules": [
        {
          "id": "fukushima-yabuki-solar",
          "government_level": "municipality",
          "prefecture_code": "07",
          "municipality_code": "07466",
          "program_name": "矢吹町住宅用太陽光発電システム導入促進事業補助金（令和8年度実施なし）",
          "housing_ages": [
            "existing",
            "new"
          ],
          "equipment_packages": [
            "solar_only",
            "solar_plus_standard_battery"
          ],
          "application_status": "closed",
          "diagnostic_scope": {
            "status": "in_scope",
            "in_scope_housing_ages": [
              "existing",
              "new"
            ],
            "excluded_branch_ids": [],
            "basis": "2026-04-08公式告知でR8実施なし・今後未定を確認．制度廃止と将来再開を推測しない．旧式と条件は保管，現年度非算入． 収集正本へ採用済み（診断算入は別判定）．"
          },
          "expense_scopes": [
            "solar",
            "battery"
          ],
          "conflict_program_ids": [],
          "official_urls": [
            "https://www.town.yabuki.fukushima.jp/page/page001527.html",
            "https://www.town.yabuki.fukushima.jp/data/doc/1562819624_doc_12_0.pdf"
          ],
          "confirmed_at": "2026-09-28",
          "calculation_assumptions": [
            "住宅用，新品，モジュール又はインバータ10kW未満，申請年度又は前年度設置．",
            "自己居住又は予定（併用は住居1/2以上），世帯非滞納，過去同補助なし．設置工事完了・運転開始後申請．",
            "併用不可：未確認\n上限：モジュール公称最大出力kWを0.01切捨て×30000円，4kW上限120000円，1000円未満切捨て．"
          ],
          "required_confirmations": [
            "2026-04-08公式告知でR8実施なし・今後未定を確認．制度廃止と将来再開を推測しない．旧式と条件は保管，現年度非算入． 収集正本へ採用済み（診断算入は別判定）．",
            "申請時の受付・残予算・製品資格・施工条件を別途確認する．"
          ],
          "source_ids": [
            "fukushima-yabuki-solar-source-1",
            "fukushima-yabuki-solar-source-2"
          ],
          "machine_rule": "kansai_municipal_non_adopted",
          "non_adoption_status": "excluded",
          "non_adoption_reason_code": "application_closed"
        }
      ],
      "policy": {
        "kind": "current_year_not_implemented",
        "notice": "今年度は実施していません．"
      },
      "institutionalSource": "77ce419af6420c6af08ca91e7c23fa5f2ff2d665bb5b4883179fbd3ebbe3b4b4"
    },
    "mie-kawagoe-abolished-2026": {
      "prefecture": "24",
      "municipality": "24344",
      "recordId": "scheme-629d1a90b91a336a37ad",
      "targetYear": "2026",
      "branch": {
        "branch_id": "mie-kawagoe-abolished-2026",
        "diagnostic_rule_ids": [
          "mie-kawagoe-abolished-2026"
        ],
        "target_equipment": [
          "太陽光パネル",
          "蓄電池"
        ],
        "application_start": [
          {
            "branch_id": "mie-kawagoe-abolished-2026",
            "label": "交付申請",
            "date": ""
          }
        ],
        "application_end": [
          {
            "branch_id": "mie-kawagoe-abolished-2026",
            "label": "交付申請",
            "date": "2026-03-31"
          }
        ],
        "application_status": "受付対象外",
        "amount": {
          "display_text": null,
          "evidence_status": "not_classified"
        },
        "official_conditions": [],
        "gaps": [],
        "evidence_urls": [
          "https://www.town.kawagoe.mie.jp/kurashi/gomi/1002667/1001633.html",
          "https://www.town.kawagoe.mie.jp/_res/projects/default_project/_page_/001/001/633/shi-ene-youkou.pdf"
        ],
        "checked_at": "2026-09-27",
        "display_basis": "preparing",
        "migration_status": "pending_review",
        "legacy_municipal_rule_ids": []
      },
      "catalogAmount": {
        "raw_text": "旧制度のPVは税抜設置費を限度に7万円，蓄電池は同10万円．",
        "display_text": null,
        "evidence_status": "not_classified"
      },
      "rules": [
        {
          "id": "mie-kawagoe-abolished-2026",
          "government_level": "municipality",
          "prefecture_code": "24",
          "municipality_code": "24344",
          "program_name": "新エネルギーシステム設置費補助金",
          "housing_ages": [
            "existing",
            "new"
          ],
          "equipment_packages": [
            "solar_only",
            "solar_plus_standard_battery"
          ],
          "application_status": "closed",
          "diagnostic_scope": {
            "status": "in_scope",
            "in_scope_housing_ages": [
              "existing",
              "new"
            ],
            "excluded_branch_ids": [],
            "basis": "廃止済みの旧制度は現行診断へ復活させない．経過措置を含めデータ保持．候補保存であり診断採用又は独立検収完了ではない．"
          },
          "expense_scopes": [
            "solar",
            "battery"
          ],
          "conflict_program_ids": [],
          "official_urls": [
            "https://www.town.kawagoe.mie.jp/kurashi/gomi/1002667/1001633.html",
            "https://www.town.kawagoe.mie.jp/_res/projects/default_project/_page_/001/001/633/shi-ene-youkou.pdf"
          ],
          "confirmed_at": "2026-09-27",
          "calculation_assumptions": [
            "本人所有・本人居住の戸建・新品自己購入を診断の前提とする．公式未明記を公式事実へ補完しない．",
            "旧FIT対応の住宅設備補助．",
            "2026-03-31廃止．PVは同日以前契約，Bは同日以前設置の経過措置があり，その申請期間をこれから購入する利用者の新規適格性に読み替えない．",
            "併用不可：確認資料に明記なし．相手制度側の制限を別途適用．\n上限：個別の金額式のとおり．他制度との共通上限は未確認．"
          ],
          "required_confirmations": [
            "廃止済みの旧制度は現行診断へ復活させない．経過措置を含めデータ保持．候補保存であり診断採用又は独立検収完了ではない．",
            "2026-03-31廃止．PVは同日以前契約，Bは同日以前設置の経過措置があり，その申請期間をこれから購入する利用者の新規適格性に読み替えない．"
          ],
          "source_ids": [
            "kansai-24-mie-kawagoe-abolished-2026-source-1",
            "kansai-24-mie-kawagoe-abolished-2026-source-2"
          ],
          "machine_rule": "kansai_municipal_non_adopted",
          "non_adoption_status": "excluded",
          "non_adoption_reason_code": "official_conditions_not_applicable"
        }
      ],
      "policy": {
        "kind": "abolished_historical_scheme",
        "notice": "この旧制度は廃止されています．"
      },
      "institutionalSource": "a0f4590d94acf554133ce5d20a9aa9a2c575b9c521eb46b7cb080cd7fb028197"
    },
    "ehime-38214-energy_old_year-2026": {
      "prefecture": "38",
      "municipality": "38214",
      "recordId": "scheme-acabc253d6dfa85eb4e6",
      "targetYear": "2026",
      "branch": {
        "branch_id": "ehime-38214-energy_old_year-2026",
        "diagnostic_rule_ids": [
          "ehime-38214-energy_old_year-2026"
        ],
        "target_equipment": [
          "太陽光パネル",
          "蓄電池"
        ],
        "application_start": [
          {
            "branch_id": "energy_old_year",
            "label": "所定申請（詳細は要件参照）",
            "date": ""
          }
        ],
        "application_end": [
          {
            "branch_id": "energy_old_year",
            "label": "所定申請（詳細は要件参照）",
            "date": ""
          }
        ],
        "application_status": "不明",
        "amount": {
          "display_text": "旧年度の保存記録には，蓄電池75,000円の候補額があります．公式広報の検索で発見した記載で，全文確認済みの額ではありません．現年度の実施・受付と詳細条件は未確認で，現在の確定額へ転用しません．",
          "evidence_status": "partial"
        },
        "official_conditions": [],
        "gaps": [],
        "evidence_urls": [
          "https://www.city.seiyo.ehime.jp/material/files/group/85/kouhou202405.pdf",
          "https://www.city.seiyo.ehime.jp/kurashi/life/sumainohojokinn/index.html"
        ],
        "checked_at": "2026-09-21",
        "display_basis": "preparing",
        "migration_status": "pending_review",
        "legacy_municipal_rule_ids": []
      },
      "catalogAmount": {
        "raw_text": "未確定のため金額null，今回非算入．\n併用・経費調整の原記録：併用条件：明示的併用禁止は確認なし．相手制度条件を優先する．\n上限：設備別上限は計算式を参照．県間接財源は別加算しない．",
        "display_text": "旧年度の保存記録には，蓄電池75,000円の候補額があります．公式広報の検索で発見した記載で，全文確認済みの額ではありません．現年度の実施・受付と詳細条件は未確認で，現在の確定額へ転用しません．",
        "evidence_status": "partial"
      },
      "rules": [
        {
          "id": "ehime-38214-energy_old_year-2026",
          "government_level": "municipality",
          "prefecture_code": "38",
          "municipality_code": "38214",
          "program_name": "西予市新エネルギー関連設備補助（現年度未確認）",
          "housing_ages": [
            "existing",
            "new"
          ],
          "equipment_packages": [
            "solar_only",
            "solar_plus_standard_battery"
          ],
          "application_status": "unknown",
          "diagnostic_scope": {
            "status": "branch_filtered",
            "in_scope_housing_ages": [],
            "excluded_branch_ids": [],
            "basis": "検索でR7等のB75,000円制度の公式広報候補を発見．R8の県一覧・市公式住宅補助導線と限定検索では現行B募集へ到達せず，旧金額を復活させない．広報は検索での発見にとどまり全文確認済みとはしない．"
          },
          "expense_scopes": [
            "solar",
            "battery"
          ],
          "conflict_program_ids": [],
          "official_urls": [
            "https://www.city.seiyo.ehime.jp/material/files/group/85/kouhou202405.pdf",
            "https://www.city.seiyo.ehime.jp/kurashi/life/sumainohojokinn/index.html"
          ],
          "confirmed_at": "2026-09-21",
          "calculation_assumptions": [
            "確認不足又は対象外の枝は算入しない．未発見を制度不存在とは扱わない．"
          ],
          "required_confirmations": [
            "検索でR7等のB75,000円制度の公式広報候補を発見．R8の県一覧・市公式住宅補助導線と限定検索では現行B募集へ到達せず，旧金額を復活させない．広報は検索での発見にとどまり全文確認済みとはしない．"
          ],
          "machine_rule": "kansai_municipal_non_adopted",
          "non_adoption_status": "candidate",
          "non_adoption_reason_code": "current_terms_unconfirmed",
          "fit_compatible": true,
          "source_ids": [
            "kansai-38-ehime-38214-energy_old_year-2026-source-1",
            "kansai-38-ehime-38214-energy_old_year-2026-source-2"
          ]
        }
      ],
      "policy": {
        "kind": "current_amount_unconfirmed",
        "notice": "現年度の制度・補助額は未確認です．公式窓口でご確認ください．"
      },
      "institutionalSource": "ebbf074b75336e5f69c7588b9d076ee8d9f7890f7831ff32ce39b3ddceb74ccd"
    }
  }
};
