we tried to implement the huggingface leaderboard from content. however i'm getting ERR: FEED_UNAVAILABLE — HuggingFace API unreachable
the new API i wanted you to get is https://huggingface.co/datasets/open-llm-leaderboard/contents. previously we get it from https://huggingface.co/datasets/open-llm-leaderboard/results which is the raw data in the @scripts/fetch-hf-leaderboard.ts

the response seems to be clear, this is the response
http://localhost:3000/api/hf-leaderboard?offset=0&length=50
{
    "features": [
        {
            "feature_idx": 0,
            "name": "eval_name",
            "type": {
                "dtype": "string",
                "_type": "Value"
            }
        },
        {
            "feature_idx": 1,
            "name": "Precision",
            "type": {
                "dtype": "string",
                "_type": "Value"
            }
        },
        {
            "feature_idx": 2,
            "name": "Type",
            "type": {
                "dtype": "string",
                "_type": "Value"
            }
        },
        {
            "feature_idx": 3,
            "name": "T",
            "type": {
                "dtype": "string",
                "_type": "Value"
            }
        },
        {
            "feature_idx": 4,
            "name": "Weight type",
            "type": {
                "dtype": "string",
                "_type": "Value"
            }
        },
        {
            "feature_idx": 5,
            "name": "Architecture",
            "type": {
                "dtype": "string",
                "_type": "Value"
            }
        },
        {
            "feature_idx": 6,
            "name": "Model",
            "type": {
                "dtype": "string",
                "_type": "Value"
            }
        },
        {
            "feature_idx": 7,
            "name": "fullname",
            "type": {
                "dtype": "string",
                "_type": "Value"
            }
        },
        {
            "feature_idx": 8,
            "name": "Model sha",
            "type": {
                "dtype": "string",
                "_type": "Value"
            }
        },
        {
            "feature_idx": 9,
            "name": "Average ⬆️",
            "type": {
                "dtype": "float64",
                "_type": "Value"
            }
        },
        {
            "feature_idx": 10,
            "name": "Hub License",
            "type": {
                "dtype": "string",
                "_type": "Value"
            }
        },
        {
            "feature_idx": 11,
            "name": "Hub ❤️",
            "type": {
                "dtype": "int64",
                "_type": "Value"
            }
        },
        {
            "feature_idx": 12,
            "name": "#Params (B)",
            "type": {
                "dtype": "float64",
                "_type": "Value"
            }
        },
        {
            "feature_idx": 13,
            "name": "Available on the hub",
            "type": {
                "dtype": "bool",
                "_type": "Value"
            }
        },
        {
            "feature_idx": 14,
            "name": "MoE",
            "type": {
                "dtype": "bool",
                "_type": "Value"
            }
        },
        {
            "feature_idx": 15,
            "name": "Flagged",
            "type": {
                "dtype": "bool",
                "_type": "Value"
            }
        },
        {
            "feature_idx": 16,
            "name": "Chat Template",
            "type": {
                "dtype": "bool",
                "_type": "Value"
            }
        },
        {
            "feature_idx": 17,
            "name": "CO₂ cost (kg)",
            "type": {
                "dtype": "float64",
                "_type": "Value"
            }
        },
        {
            "feature_idx": 18,
            "name": "IFEval Raw",
            "type": {
                "dtype": "float64",
                "_type": "Value"
            }
        },
        {
            "feature_idx": 19,
            "name": "IFEval",
            "type": {
                "dtype": "float64",
                "_type": "Value"
            }
        },
        {
            "feature_idx": 20,
            "name": "BBH Raw",
            "type": {
                "dtype": "float64",
                "_type": "Value"
            }
        },
        {
            "feature_idx": 21,
            "name": "BBH",
            "type": {
                "dtype": "float64",
                "_type": "Value"
            }
        },
        {
            "feature_idx": 22,
            "name": "MATH Lvl 5 Raw",
            "type": {
                "dtype": "float64",
                "_type": "Value"
            }
        },
        {
            "feature_idx": 23,
            "name": "MATH Lvl 5",
            "type": {
                "dtype": "float64",
                "_type": "Value"
            }
        },
        {
            "feature_idx": 24,
            "name": "GPQA Raw",
            "type": {
                "dtype": "float64",
                "_type": "Value"
            }
        },
        {
            "feature_idx": 25,
            "name": "GPQA",
            "type": {
                "dtype": "float64",
                "_type": "Value"
            }
        },
        {
            "feature_idx": 26,
            "name": "MUSR Raw",
            "type": {
                "dtype": "float64",
                "_type": "Value"
            }
        },
        {
            "feature_idx": 27,
            "name": "MUSR",
            "type": {
                "dtype": "float64",
                "_type": "Value"
            }
        },
        {
            "feature_idx": 28,
            "name": "MMLU-PRO Raw",
            "type": {
                "dtype": "float64",
                "_type": "Value"
            }
        },
        {
            "feature_idx": 29,
            "name": "MMLU-PRO",
            "type": {
                "dtype": "float64",
                "_type": "Value"
            }
        },
        {
            "feature_idx": 30,
            "name": "Merged",
            "type": {
                "dtype": "bool",
                "_type": "Value"
            }
        },
        {
            "feature_idx": 31,
            "name": "Official Providers",
            "type": {
                "dtype": "bool",
                "_type": "Value"
            }
        },
        {
            "feature_idx": 32,
            "name": "Upload To Hub Date",
            "type": {
                "dtype": "string",
                "_type": "Value"
            }
        },
        {
            "feature_idx": 33,
            "name": "Submission Date",
            "type": {
                "dtype": "string",
                "_type": "Value"
            }
        },
        {
            "feature_idx": 34,
            "name": "Generation",
            "type": {
                "dtype": "int64",
                "_type": "Value"
            }
        },
        {
            "feature_idx": 35,
            "name": "Base Model",
            "type": {
                "dtype": "string",
                "_type": "Value"
            }
        }
    ],
    "rows": [
        {
            "row_idx": 0,
            "row": {
                "eval_name": "0-hero_Matter-0.2-7B-DPO_bfloat16",
                "Precision": "bfloat16",
                "Type": "💬 chat models (RLHF, DPO, IFT, ...)",
                "T": "💬",
                "Weight type": "Original",
                "Architecture": "MistralForCausalLM",
                "Model": "<a target=\"_blank\" href=\"https://huggingface.co/0-hero/Matter-0.2-7B-DPO\" style=\"color: var(--link-text-color); text-decoration: underline;text-decoration-style: dotted;\">0-hero/Matter-0.2-7B-DPO</a>  <a target=\"_blank\" href=\"https://huggingface.co/datasets/open-llm-leaderboard/0-hero__Matter-0.2-7B-DPO-details\" style=\"color: var(--link-text-color); text-decoration: underline;text-decoration-style: dotted;\">📑</a>",
                "fullname": "0-hero/Matter-0.2-7B-DPO",
                "Model sha": "26a66f0d862e2024ce4ad0a09c37052ac36e8af6",
                "Average ⬆️": 8.90636130175029,
                "Hub License": "apache-2.0",
                "Hub ❤️": 3,
                "#Params (B)": 7.242,
                "Available on the hub": true,
                "MoE": false,
                "Flagged": false,
                "Chat Template": true,
                "CO₂ cost (kg)": 1.219174164123715,
                "IFEval Raw": 0.3302792147058693,
                "IFEval": 33.02792147058693,
                "BBH Raw": 0.3596254301656297,
                "BBH": 10.055525080241035,
                "MATH Lvl 5 Raw": 0.014350453172205438,
                "MATH Lvl 5": 1.4350453172205437,
                "GPQA Raw": 0.25922818791946306,
                "GPQA": 1.230425055928408,
                "MUSR Raw": 0.381375,
                "MUSR": 5.871874999999999,
                "MMLU-PRO Raw": 0.1163563829787234,
                "MMLU-PRO": 1.8173758865248217,
                "Merged": false,
                "Official Providers": false,
                "Upload To Hub Date": "2024-04-13",
                "Submission Date": "2024-08-05",
                "Generation": 0,
                "Base Model": "0-hero/Matter-0.2-7B-DPO"
            },
            "truncated_cells": []
        },
        {
            "row_idx": 1,
            "row": {
                "eval_name": "01-ai_Yi-1.5-34B_bfloat16",
                "Precision": "bfloat16",
                "Type": "🟢 pretrained",
                "T": "🟢",
                "Weight type": "Original",
                "Architecture": "LlamaForCausalLM",
                "Model": "<a target=\"_blank\" href=\"https://huggingface.co/01-ai/Yi-1.5-34B\" style=\"color: var(--link-text-color); text-decoration: underline;text-decoration-style: dotted;\">01-ai/Yi-1.5-34B</a>  <a target=\"_blank\" href=\"https://huggingface.co/datasets/open-llm-leaderboard/01-ai__Yi-1.5-34B-details\" style=\"color: var(--link-text-color); text-decoration: underline;text-decoration-style: dotted;\">📑</a>",
                "fullname": "01-ai/Yi-1.5-34B",
                "Model sha": "4b486f81c935a2dadde84c6baa1e1370d40a098f",
                "Average ⬆️": 25.64649419429311,
                "Hub License": "apache-2.0",
                "Hub ❤️": 46,
                "#Params (B)": 34.389,
                "Available on the hub": true,
                "MoE": false,
                "Flagged": false,
                "Chat Template": false,
                "CO₂ cost (kg)": 22.7033978747449,
                "IFEval Raw": 0.2841172533322695,
                "IFEval": 28.411725333226947,
                "BBH Raw": 0.5976391706360018,
                "BBH": 42.74936268839652,
                "MATH Lvl 5 Raw": 0.15332326283987915,
                "MATH Lvl 5": 15.332326283987916,
                "GPQA Raw": 0.36577181208053694,
                "GPQA": 15.436241610738257,
                "MUSR Raw": 0.4236041666666667,
                "MUSR": 11.217187500000003,
                "MMLU-PRO Raw": 0.4665890957446808,
                "MMLU-PRO": 40.732121749408975,
                "Merged": false,
                "Official Providers": true,
                "Upload To Hub Date": "2024-05-11",
                "Submission Date": "2024-06-12",
                "Generation": 0,
                "Base Model": "01-ai/Yi-1.5-34B"
            },
            "truncated_cells": []
        },
        {
            "row_idx": 2,
            "row": {
                "eval_name": "01-ai_Yi-1.5-34B-32K_bfloat16",
                "Precision": "bfloat16",
                "Type": "🟢 pretrained",
                "T": "🟢",
                "Weight type": "Original",
                "Architecture": "LlamaForCausalLM",
                "Model": "<a target=\"_blank\" href=\"https://huggingface.co/01-ai/Yi-1.5-34B-32K\" style=\"color: var(--link-text-color); text-decoration: underline;text-decoration-style: dotted;\">01-ai/Yi-1.5-34B-32K</a>  <a target=\"_blank\" href=\"https://huggingface.co/datasets/open-llm-leaderboard/01-ai__Yi-1.5-34B-32K-details\" style=\"color: var(--link-text-color); text-decoration: underline;text-decoration-style: dotted;\">📑</a>",
                "fullname": "01-ai/Yi-1.5-34B-32K",
                "Model sha": "2c03a29761e4174f20347a60fbe229be4383d48b",
                "Average ⬆️": 26.727912908508134,
                "Hub License": "apache-2.0",
                "Hub ❤️": 36,
                "#Params (B)": 34.389,
                "Available on the hub": true,
                "MoE": false,
                "Flagged": false,
                "Chat Template": false,
                "CO₂ cost (kg)": 23.15462857509891,
                "IFEval Raw": 0.3118691737922047,
                "IFEval": 31.186917379220468,
                "BBH Raw": 0.6015685776542417,
                "BBH": 43.38184666762572,
                "MATH Lvl 5 Raw": 0.1540785498489426,
                "MATH Lvl 5": 15.407854984894259,
                "GPQA Raw": 0.36325503355704697,
                "GPQA": 15.100671140939594,
                "MUSR Raw": 0.4398229166666667,
                "MUSR": 14.07786458333333,
                "MMLU-PRO Raw": 0.4709109042553192,
                "MMLU-PRO": 41.21232269503546,
                "Merged": false,
                "Official Providers": true,
                "Upload To Hub Date": "2024-05-15",
                "Submission Date": "2024-06-12",
                "Generation": 0,
                "Base Model": "01-ai/Yi-1.5-34B-32K"
            },
            "truncated_cells": []
        },
        {
            "row_idx": 3,
            "row": {
                "eval_name": "01-ai_Yi-1.5-34B-Chat_bfloat16",
                "Precision": "bfloat16",
                "Type": "💬 chat models (RLHF, DPO, IFT, ...)",
                "T": "💬",
                "Weight type": "Original",
                "Architecture": "LlamaForCausalLM",
                "Model": "<a target=\"_blank\" href=\"https://huggingface.co/01-ai/Yi-1.5-34B-Chat\" style=\"color: var(--link-text-color); text-decoration: underline;text-decoration-style: dotted;\">01-ai/Yi-1.5-34B-Chat</a>  <a target=\"_blank\" href=\"https://huggingface.co/datasets/open-llm-leaderboard/01-ai__Yi-1.5-34B-Chat-details\" style=\"color: var(--link-text-color); text-decoration: underline;text-decoration-style: dotted;\">📑</a>",
                "fullname": "01-ai/Yi-1.5-34B-Chat",
                "Model sha": "f3128b2d02d82989daae566c0a7eadc621ca3254",
                "Average ⬆️": 33.35799367075618,
                "Hub License": "apache-2.0",
                "Hub ❤️": 268,
                "#Params (B)": 34.389,
                "Available on the hub": true,
                "MoE": false,
                "Flagged": false,
                "Chat Template": true,
                "CO₂ cost (kg)": 22.423843867327744,
                "IFEval Raw": 0.6066758423205982,
                "IFEval": 60.66758423205982,
                "BBH Raw": 0.6083748310271819,
                "BBH": 44.262825981005655,
                "MATH Lvl 5 Raw": 0.277190332326284,
                "MATH Lvl 5": 27.719033232628398,
                "GPQA Raw": 0.3649328859060403,
                "GPQA": 15.324384787472036,
                "MUSR Raw": 0.4281979166666667,
                "MUSR": 13.058072916666665,
                "MMLU-PRO Raw": 0.45204454787234044,
                "MMLU-PRO": 39.11606087470449,
                "Merged": false,
                "Official Providers": true,
                "Upload To Hub Date": "2024-05-10",
                "Submission Date": "2024-06-12",
                "Generation": 0,
                "Base Model": "01-ai/Yi-1.5-34B-Chat"
            },
            "truncated_cells": []
        },
        {
            "row_idx": 4,
            "row": {
                "eval_name": "01-ai_Yi-1.5-34B-Chat-16K_bfloat16",
                "Precision": "bfloat16",
                "Type": "💬 chat models (RLHF, DPO, IFT, ...)",
                "T": "💬",
                "Weight type": "Original",
                "Architecture": "LlamaForCausalLM",
                "Model": "<a target=\"_blank\" href=\"https://huggingface.co/01-ai/Yi-1.5-34B-Chat-16K\" style=\"color: var(--link-text-color); text-decoration: underline;text-decoration-style: dotted;\">01-ai/Yi-1.5-34B-Chat-16K</a>  <a target=\"_blank\" href=\"https://huggingface.co/datasets/open-llm-leaderboard/01-ai__Yi-1.5-34B-Chat-16K-details\" style=\"color: var(--link-text-color); text-decoration: underline;text-decoration-style: dotted;\">📑</a>",
                "fullname": "01-ai/Yi-1.5-34B-Chat-16K",
                "Model sha": "ff74452e11f0f749ab872dc19b1dd3813c25c4d8",
                "Average ⬆️": 29.403554842710225,
                "Hub License": "apache-2.0",
                "Hub ❤️": 26,
                "#Params (B)": 34.389,
                "Available on the hub": true,
                "MoE": false,
                "Flagged": false,
                "Chat Template": true,
                "CO₂ cost (kg)": 6.774022458148835,
                "IFEval Raw": 0.456449997118756,
                "IFEval": 45.6449997118756,
                "BBH Raw": 0.6100218256499571,
                "BBH": 44.53615654671034,
                "MATH Lvl 5 Raw": 0.21374622356495468,
                "MATH Lvl 5": 21.37462235649547,
                "GPQA Raw": 0.33808724832214765,
                "GPQA": 11.74496644295302,
                "MUSR Raw": 0.43976041666666665,
                "MUSR": 13.736718750000001,
                "MMLU-PRO Raw": 0.45445478723404253,
                "MMLU-PRO": 39.383865248226954,
                "Merged": false,
                "Official Providers": true,
                "Upload To Hub Date": "2024-05-15",
                "Submission Date": "2024-07-15",
                "Generation": 0,
                "Base Model": "01-ai/Yi-1.5-34B-Chat-16K"
            },
            "truncated_cells": []
        },
        {
            "row_idx": 5,
            "row": {
                "eval_name": "01-ai_Yi-1.5-6B_bfloat16",
                "Precision": "bfloat16",
                "Type": "🟢 pretrained",
                "T": "🟢",
                "Weight type": "Original",
                "Architecture": "LlamaForCausalLM",
                "Model": "<a target=\"_blank\" href=\"https://huggingface.co/01-ai/Yi-1.5-6B\" style=\"color: var(--link-text-color); text-decoration: underline;text-decoration-style: dotted;\">01-ai/Yi-1.5-6B</a>  <a target=\"_blank\" href=\"https://huggingface.co/datasets/open-llm-leaderboard/01-ai__Yi-1.5-6B-details\" style=\"color: var(--link-text-color); text-decoration: underline;text-decoration-style: dotted;\">📑</a>",
                "fullname": "01-ai/Yi-1.5-6B",
                "Model sha": "cab51fce425b4c1fb19fccfdd96bd5d0908c1657",
                "Average ⬆️": 16.745698054972127,
                "Hub License": "apache-2.0",
                "Hub ❤️": 30,
                "#Params (B)": 6.061,
                "Available on the hub": true,
                "MoE": false,
                "Flagged": false,
                "Chat Template": false,
                "CO₂ cost (kg)": 1.8442095716487765,
                "IFEval Raw": 0.26166017278598563,
                "IFEval": 26.166017278598567,
                "BBH Raw": 0.44925820198929056,
                "BBH": 22.027904536694773,
                "MATH Lvl 5 Raw": 0.06646525679758308,
                "MATH Lvl 5": 6.646525679758309,
                "GPQA Raw": 0.313758389261745,
                "GPQA": 8.501118568232664,
                "MUSR Raw": 0.43740625,
                "MUSR": 13.309114583333335,
                "MMLU-PRO Raw": 0.31441156914893614,
                "MMLU-PRO": 23.823507683215126,
                "Merged": false,
                "Official Providers": true,
                "Upload To Hub Date": "2024-05-11",
                "Submission Date": "2024-08-10",
                "Generation": 0,
                "Base Model": "01-ai/Yi-1.5-6B"
            },
            "truncated_cells": []
        },
        {
            "row_idx": 6,
            "row": {
                "eval_name": "01-ai_Yi-1.5-6B-Chat_bfloat16",
                "Precision": "bfloat16",
                "Type": "💬 chat models (RLHF, DPO, IFT, ...)",
                "T": "💬",
                "Weight type": "Original",
                "Architecture": "LlamaForCausalLM",
                "Model": "<a target=\"_blank\" href=\"https://huggingface.co/01-ai/Yi-1.5-6B-Chat\" style=\"color: var(--link-text-color); text-decoration: underline;text-decoration-style: dotted;\">01-ai/Yi-1.5-6B-Chat</a>  <a target=\"_blank\" href=\"https://huggingface.co/datasets/open-llm-leaderboard/01-ai__Yi-1.5-6B-Chat-details\" style=\"color: var(--link-text-color); text-decoration: underline;text-decoration-style: dotted;\">📑</a>",
                "fullname": "01-ai/Yi-1.5-6B-Chat",
                "Model sha": "3f64d3f159c6ad8494227bb77e2a7baef8cd808b",
                "Average ⬆️": 22.784006289829847,
                "Hub License": "apache-2.0",
                "Hub ❤️": 41,
                "#Params (B)": 6.061,
                "Available on the hub": true,
                "MoE": false,
                "Flagged": false,
                "Chat Template": true,
                "CO₂ cost (kg)": 1.4447911071090622,
                "IFEval Raw": 0.5145270105542183,
                "IFEval": 51.452701055421834,
                "BBH Raw": 0.4571311331954389,
                "BBH": 23.67872313235784,
                "MATH Lvl 5 Raw": 0.1623867069486405,
                "MATH Lvl 5": 16.238670694864048,
                "GPQA Raw": 0.30201342281879195,
                "GPQA": 6.935123042505594,
                "MUSR Raw": 0.43917708333333333,
                "MUSR": 14.030468750000002,
                "MMLU-PRO Raw": 0.3193151595744681,
                "MMLU-PRO": 24.368351063829788,
                "Merged": false,
                "Official Providers": true,
                "Upload To Hub Date": "2024-05-11",
                "Submission Date": "2024-10-22",
                "Generation": 0,
                "Base Model": "01-ai/Yi-1.5-6B-Chat"
            },
            "truncated_cells": []
        },
        {
            "row_idx": 7,
            "row": {
                "eval_name": "01-ai_Yi-1.5-9B_bfloat16",
                "Precision": "bfloat16",
                "Type": "🟢 pretrained",
                "T": "🟢",
                "Weight type": "Original",
                "Architecture": "LlamaForCausalLM",
                "Model": "<a target=\"_blank\" href=\"https://huggingface.co/01-ai/Yi-1.5-9B\" style=\"color: var(--link-text-color); text-decoration: underline;text-decoration-style: dotted;\">01-ai/Yi-1.5-9B</a>  <a target=\"_blank\" href=\"https://huggingface.co/datasets/open-llm-leaderboard/01-ai__Yi-1.5-9B-details\" style=\"color: var(--link-text-color); text-decoration: underline;text-decoration-style: dotted;\">📑</a>",
                "fullname": "01-ai/Yi-1.5-9B",
                "Model sha": "8cfde9604384c50137bee480b8cef8a08e5ae81d",
                "Average ⬆️": 22.153901514184795,
                "Hub License": "apache-2.0",
                "Hub ❤️": 48,
                "#Params (B)": 8.829,
                "Available on the hub": true,
                "MoE": false,
                "Flagged": false,
                "Chat Template": false,
                "CO₂ cost (kg)": 1.4688920320817076,
                "IFEval Raw": 0.29358435617494916,
                "IFEval": 29.358435617494916,
                "BBH Raw": 0.514294179104191,
                "BBH": 30.50071699492122,
                "MATH Lvl 5 Raw": 0.11404833836858005,
                "MATH Lvl 5": 11.404833836858005,
                "GPQA Raw": 0.37919463087248323,
                "GPQA": 17.225950782997764,
                "MUSR Raw": 0.43278124999999995,
                "MUSR": 12.030989583333332,
                "MMLU-PRO Raw": 0.3916223404255319,
                "MMLU-PRO": 32.402482269503544,
                "Merged": false,
                "Official Providers": true,
                "Upload To Hub Date": "2024-05-11",
                "Submission Date": "2024-06-12",
                "Generation": 0,
                "Base Model": "01-ai/Yi-1.5-9B"
            },
            "truncated_cells": []
        },
        {
            "row_idx": 8,
            "row": {
                "eval_name": "01-ai_Yi-1.5-9B-32K_bfloat16",
                "Precision": "bfloat16",
                "Type": "🟢 pretrained",
                "T": "🟢",
                "Weight type": "Original",
                "Architecture": "LlamaForCausalLM",
                "Model": "<a target=\"_blank\" href=\"https://huggingface.co/01-ai/Yi-1.5-9B-32K\" style=\"color: var(--link-text-color); text-decoration: underline;text-decoration-style: dotted;\">01-ai/Yi-1.5-9B-32K</a>  <a target=\"_blank\" href=\"https://huggingface.co/datasets/open-llm-leaderboard/01-ai__Yi-1.5-9B-32K-details\" style=\"color: var(--link-text-color); text-decoration: underline;text-decoration-style: dotted;\">📑</a>",
                "fullname": "01-ai/Yi-1.5-9B-32K",
                "Model sha": "116561dfae63af90f9d163b43077629e0e916bb1",
                "Average ⬆️": 19.809786285875365,
                "Hub License": "apache-2.0",
                "Hub ❤️": 18,
                "#Params (B)": 8.829,
                "Available on the hub": true,
                "MoE": false,
                "Flagged": false,
                "Chat Template": false,
                "CO₂ cost (kg)": 1.5680734132696938,
                "IFEval Raw": 0.23031113002389217,
                "IFEval": 23.031113002389215,
                "BBH Raw": 0.496332115988265,
                "BBH": 28.937011582169664,
                "MATH Lvl 5 Raw": 0.10800604229607251,
                "MATH Lvl 5": 10.80060422960725,
                "GPQA Raw": 0.35906040268456374,
                "GPQA": 14.541387024608499,
                "MUSR Raw": 0.4186145833333333,
                "MUSR": 10.82682291666667,
                "MMLU-PRO Raw": 0.37649601063829785,
                "MMLU-PRO": 30.721778959810877,
                "Merged": false,
                "Official Providers": true,
                "Upload To Hub Date": "2024-05-15",
                "Submission Date": "2024-06-12",
                "Generation": 0,
                "Base Model": "01-ai/Yi-1.5-9B-32K"
            },
            "truncated_cells": []
        },
        {
            "row_idx": 9,
            "row": {
                "eval_name": "01-ai_Yi-1.5-9B-Chat_bfloat16",
                "Precision": "bfloat16",
                "Type": "💬 chat models (RLHF, DPO, IFT, ...)",
                "T": "💬",
                "Weight type": "Original",
                "Architecture": "LlamaForCausalLM",
                "Model": "<a target=\"_blank\" href=\"https://huggingface.co/01-ai/Yi-1.5-9B-Chat\" style=\"color: var(--link-text-color); text-decoration: underline;text-decoration-style: dotted;\">01-ai/Yi-1.5-9B-Chat</a>  <a target=\"_blank\" href=\"https://huggingface.co/datasets/open-llm-leaderboard/01-ai__Yi-1.5-9B-Chat-details\" style=\"color: var(--link-text-color); text-decoration: underline;text-decoration-style: dotted;\">📑</a>",
                "fullname": "01-ai/Yi-1.5-9B-Chat",
                "Model sha": "bc87d8557c98dc1e5fdef6ec23ed31088c4d3f35",
                "Average ⬆️": 29.530872220260978,
                "Hub License": "apache-2.0",
                "Hub ❤️": 141,
                "#Params (B)": 8.829,
                "Available on the hub": true,
                "MoE": false,
                "Flagged": false,
                "Chat Template": true,
                "CO₂ cost (kg)": 1.453543490910605,
                "IFEval Raw": 0.6045525871354672,
                "IFEval": 60.455258713546726,
                "BBH Raw": 0.555906430281685,
                "BBH": 36.95293138417893,
                "MATH Lvl 5 Raw": 0.2258308157099698,
                "MATH Lvl 5": 22.58308157099698,
                "GPQA Raw": 0.3347315436241611,
                "GPQA": 11.297539149888143,
                "MUSR Raw": 0.42590625,
                "MUSR": 12.838281249999996,
                "MMLU-PRO Raw": 0.39752327127659576,
                "MMLU-PRO": 33.05814125295508,
                "Merged": false,
                "Official Providers": true,
                "Upload To Hub Date": "2024-05-10",
                "Submission Date": "2024-06-12",
                "Generation": 0,
                "Base Model": "01-ai/Yi-1.5-9B-Chat"
            },
            "truncated_cells": []
        },
        {
            "row_idx": 10,
            "row": {
                "eval_name": "01-ai_Yi-1.5-9B-Chat-16K_bfloat16",
                "Precision": "bfloat16",
                "Type": "💬 chat models (RLHF, DPO, IFT, ...)",
                "T": "💬",
                "Weight type": "Original",
                "Architecture": "LlamaForCausalLM",
                "Model": "<a target=\"_blank\" href=\"https://huggingface.co/01-ai/Yi-1.5-9B-Chat-16K\" style=\"color: var(--link-text-color); text-decoration: underline;text-decoration-style: dotted;\">01-ai/Yi-1.5-9B-Chat-16K</a>  <a target=\"_blank\" href=\"https://huggingface.co/datasets/open-llm-leaderboard/01-ai__Yi-1.5-9B-Chat-16K-details\" style=\"color: var(--link-text-color); text-decoration: underline;text-decoration-style: dotted;\">📑</a>",
                "fullname": "01-ai/Yi-1.5-9B-Chat-16K",
                "Model sha": "2b397e5f0fab87984efa66856c5c4ed4bbe68b50",
                "Average ⬆️": 23.76539234993476,
                "Hub License": "apache-2.0",
                "Hub ❤️": 35,
                "#Params (B)": 8.829,
                "Available on the hub": true,
                "MoE": false,
                "Flagged": false,
                "Chat Template": true,
                "CO₂ cost (kg)": 1.5847450134017533,
                "IFEval Raw": 0.4214040966856829,
                "IFEval": 42.14040966856828,
                "BBH Raw": 0.5153383364651778,
                "BBH": 31.497608947018318,
                "MATH Lvl 5 Raw": 0.1782477341389728,
                "MATH Lvl 5": 17.82477341389728,
                "GPQA Raw": 0.3087248322147651,
                "GPQA": 7.829977628635347,
                "MUSR Raw": 0.40990624999999997,
                "MUSR": 10.03828125,
                "MMLU-PRO Raw": 0.39935172872340424,
                "MMLU-PRO": 33.261303191489354,
                "Merged": false,
                "Official Providers": true,
                "Upload To Hub Date": "2024-05-15",
                "Submission Date": "2024-06-12",
                "Generation": 0,
                "Base Model": "01-ai/Yi-1.5-9B-Chat-16K"
            },
            "truncated_cells": []
        },
        {
            "row_idx": 11,
            "row": {
                "eval_name": "01-ai_Yi-34B_bfloat16",
                "Precision": "bfloat16",
                "Type": "🟢 pretrained",
                "T": "🟢",
                "Weight type": "Original",
                "Architecture": "LlamaForCausalLM",
                "Model": "<a target=\"_blank\" href=\"https://huggingface.co/01-ai/Yi-34B\" style=\"color: var(--link-text-color); text-decoration: underline;text-decoration-style: dotted;\">01-ai/Yi-34B</a>  <a target=\"_blank\" href=\"https://huggingface.co/datasets/open-llm-leaderboard/01-ai__Yi-34B-details\" style=\"color: var(--link-text-color); text-decoration: underline;text-decoration-style: dotted;\">📑</a>",
                "fullname": "01-ai/Yi-34B",
                "Model sha": "e1e7da8c75cfd5c44522228599fd4d2990cedd1c",
                "Average ⬆️": 22.373127018936653,
                "Hub License": "apache-2.0",
                "Hub ❤️": 1293,
                "#Params (B)": 34.389,
                "Available on the hub": true,
                "MoE": false,
                "Flagged": false,
                "Chat Template": false,
                "CO₂ cost (kg)": 25.657483288779545,
                "IFEval Raw": 0.3045751938190667,
                "IFEval": 30.45751938190668,
                "BBH Raw": 0.5457099951794562,
                "BBH": 35.542431259008794,
                "MATH Lvl 5 Raw": 0.0513595166163142,
                "MATH Lvl 5": 5.13595166163142,
                "GPQA Raw": 0.36661073825503354,
                "GPQA": 15.548098434004473,
                "MUSR Raw": 0.4118541666666667,
                "MUSR": 9.648437500000004,
                "MMLU-PRO Raw": 0.441156914893617,
                "MMLU-PRO": 37.90632387706855,
                "Merged": false,
                "Official Providers": true,
                "Upload To Hub Date": "2023-11-01",
                "Submission Date": "2024-06-12",
                "Generation": 0,
                "Base Model": "01-ai/Yi-34B"
            },
            "truncated_cells": []
        },
        {
            "row_idx": 12,
            "row": {
                "eval_name": "01-ai_Yi-34B-200K_bfloat16",
                "Precision": "bfloat16",
                "Type": "🟢 pretrained",
                "T": "🟢",
                "Weight type": "Original",
                "Architecture": "LlamaForCausalLM",
                "Model": "<a target=\"_blank\" href=\"https://huggingface.co/01-ai/Yi-34B-200K\" style=\"color: var(--link-text-color); text-decoration: underline;text-decoration-style: dotted;\">01-ai/Yi-34B-200K</a>  <a target=\"_blank\" href=\"https://huggingface.co/datasets/open-llm-leaderboard/01-ai__Yi-34B-200K-details\" style=\"color: var(--link-text-color); text-decoration: underline;text-decoration-style: dotted;\">📑</a>",
                "fullname": "01-ai/Yi-34B-200K",
                "Model sha": "8ac1a1ebe011df28b78ccd08012aeb2222443c77",
                "Average ⬆️": 20.01347533597433,
                "Hub License": "apache-2.0",
                "Hub ❤️": 318,
                "#Params (B)": 34.389,
                "Available on the hub": true,
                "MoE": false,
                "Flagged": false,
                "Chat Template": false,
                "CO₂ cost (kg)": 25.50385584712952,
                "IFEval Raw": 0.15424850507763843,
                "IFEval": 15.424850507763843,
                "BBH Raw": 0.5441817925289527,
                "BBH": 36.02211028900003,
                "MATH Lvl 5 Raw": 0.05740181268882175,
                "MATH Lvl 5": 5.740181268882175,
                "GPQA Raw": 0.3565436241610738,
                "GPQA": 14.205816554809845,
                "MUSR Raw": 0.38171874999999994,
                "MUSR": 9.414843749999998,
                "MMLU-PRO Raw": 0.45345744680851063,
                "MMLU-PRO": 39.273049645390074,
                "Merged": false,
                "Official Providers": true,
                "Upload To Hub Date": "2023-11-06",
                "Submission Date": "2024-06-12",
                "Generation": 0,
                "Base Model": "01-ai/Yi-34B-200K"
            },
            "truncated_cells": []
        },
        {
            "row_idx": 49,
            "row": {
                "eval_name": "Aashraf995_Gemma-Evo-10B_float16",
                "Precision": "float16",
                "Type": "🤝 base merges and moerges",
                "T": "🤝",
                "Weight type": "Original",
                "Architecture": "Gemma2ForCausalLM",
                "Model": "<a target=\"_blank\" href=\"https://huggingface.co/Aashraf995/Gemma-Evo-10B\" style=\"color: var(--link-text-color); text-decoration: underline;text-decoration-style: dotted;\">Aashraf995/Gemma-Evo-10B</a>  <a target=\"_blank\" href=\"https://huggingface.co/datasets/open-llm-leaderboard/Aashraf995__Gemma-Evo-10B-details\" style=\"color: var(--link-text-color); text-decoration: underline;text-decoration-style: dotted;\">📑</a>",
                "fullname": "Aashraf995/Gemma-Evo-10B",
                "Model sha": "5ec9c5763ca6662dd897cd292e08014ec10b0d74",
                "Average ⬆️": 34.32632733409121,
                "Hub License": "apache-2.0",
                "Hub ❤️": 4,
                "#Params (B)": 10.159,
                "Available on the hub": true,
                "MoE": false,
                "Flagged": false,
                "Chat Template": false,
                "CO₂ cost (kg)": 4.596031436815906,
                "IFEval Raw": 0.7332211864519476,
                "IFEval": 73.32211864519475,
                "BBH Raw": 0.6044352897552882,
                "BBH": 43.42455936867185,
                "MATH Lvl 5 Raw": 0.22280966767371602,
                "MATH Lvl 5": 22.280966767371602,
                "GPQA Raw": 0.3540268456375839,
                "GPQA": 13.870246085011187,
                "MUSR Raw": 0.45947916666666666,
                "MUSR": 16.66822916666666,
                "MMLU-PRO Raw": 0.4275265957446808,
                "MMLU-PRO": 36.3918439716312,
                "Merged": true,
                "Official Providers": false,
                "Upload To Hub Date": "2024-12-13",
                "Submission Date": "2024-12-13",
                "Generation": 1,
                "Base Model": "Aashraf995/Gemma-Evo-10B (Merge)"
            },
            "truncated_cells": []
        }
    ],
    "num_rows_total": 4576,
    "num_rows_per_page": 100,
    "partial": false
}