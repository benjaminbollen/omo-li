import {assign, createMachine, send} from "xstate";
import {ProcessContext} from "src/libs/o-processes/processContext";
import {ProcessEvent, PromptField} from "src/libs/o-processes/processEvent";
import {ProcessDefinition} from "src/libs/o-processes/processManifest";
import {BN} from "ethereumjs-util";
import {Address} from "../../../../libs/o-circles-protocol/interfaces/address";
import context from "svelte/types/compiler/parse/read/context";

export interface TransferCirclesContext extends ProcessContext
{
    transfer?: {
        recipient: Address,
        value: BN
    }
}

/**
 * Transfer circles
 */
const processDefinition = createMachine<TransferCirclesContext, ProcessEvent>({
    initial: "ready",
    states: {
        ready: {
            on: {
                "omo.trigger": "promptRecipient",
                "omo.cancel": "stop",
                "omo.stop": "stop"
            }
        },
        promptRecipient: {
            entry: send({
                type: "omo.prompt",
                message: "Please enter the recipient's address below and click 'Next'",
                data: {
                    id: "recipient",
                    fields: {
                        "address": {
                            type: "ethereumAddress",
                            label: "Address"
                        }
                    }
                }
            }),
            on: {
                "omo.answer": {
                    actions: [
                        assign((context: any, event: any) =>
                        {
                            if (!context.transfer)
                            {
                                context.transfer = {};
                            }
                            context.transfer.recipient = event.data.fields.address;
                        })
                    ],
                    target: "promptValue"
                }
            }
        },
        promptValue: {
            entry: send({
                type: "omo.prompt",
                message: "Please enter the Value you want to transfer and click 'Next'",
                data: {
                    id: "value",
                    fields: {
                        "value": {
                            type: "wei",
                            label: "Value"
                        }
                    }
                }
            }),
            on: {
                "omo.answer": {
                    actions: [
                        assign((context: any, event: any) =>
                        {
                            if (!context.transfer)
                            {
                                context.transfer = {};
                            }
                            context.transfer.value = event.data.fields.value;
                        })
                    ],
                    target: "summarize"
                }
            }
        },
        summarize: {
            entry: send((context: TransferCirclesContext) =>
            {
                return {
                    type: "omo.prompt",
                    message: "Enter 'Deine Mudda oida' and click 'Next' to confirm the transaction",
                    data: {
                        id: "confirmation",
                        fields: {
                            "recipient": {
                                type: "ethereumAddress",
                                label: "Recipient",
                                value: context.transfer.recipient
                            },
                            "value": {
                                type: "wei",
                                label: "Value",
                                value: context.transfer.value
                            },
                            "confirmation": {
                                type: "string",
                                label: "Confirmation phrase"
                            }
                        }
                    }
                }
            })
        },
        transferCircles: {
            invoke: {
                id: 'transferCircles',
                src: async (context) => null,
                onError: {
                    actions: []
                },
                onDone: {
                    actions: []
                }
            },
            on: {
                "omo.error": "stop",
                "omo.success": "stop"
            }
        },
        stop: {
            type: "final"
        }
    }
}, {
    guards: {},
    actions: {}
});

export const transferCircles: ProcessDefinition = {
    name: "transferCircles",
    stateMachine: processDefinition
};