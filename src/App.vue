<template>
  <form @submit="onSubmit">
    <v-container>
      <v-row justify="space-around">
        <v-col cols="12" md="6">
          <FieldArray v-slot="{ fields, push, remove }" name="phone">
            FieldArrayFields - {{ fields }}
            <div v-for="(entry, idx) in fields" :key="idx">
              <div class="phone-field">
                <Field v-slot="{ field, errors, value }" :name="`phone[${idx}]`">
                  errors - {{ errors }}
                  <v-text-field
                      v-bind="field"
                      type="text"
                      :model-value="value"
                      prepend-icon="mdi-phone"
                      hide-details
                      label="Phone"
                      :error-messages="errors"
                      :data-test="`user.phone[${idx}]`"
                  />
                  <v-btn
                      v-if="idx > 0"
                      icon="mdi-minus-circle"
                      size="x-small"
                      tile
                      :rounded="0"
                      color="red"
                      class="text-white"
                      @click="remove(idx)"
                  />
                </Field>
              </div>
              <ErrorMessage v-slot="{ message }" name="phone">
                <div class="v-input__details">
                  <div class="v-messages validation__error">
                    <div class="v-messages__message">
                      {{ message }}
                    </div>
                  </div>
                </div>
              </ErrorMessage>
              <ErrorMessage v-slot="{ message }" :name="`phone[\'${idx}\']`">
                message - {{ message }}
                <div class="v-input__details">
                  <div class="v-messages validation__error">
                    <div class="v-messages__message">
                      {{ message }}
                    </div>
                  </div>
                </div>
              </ErrorMessage>
            </div>

            <v-btn
                icon="mdi-plus-circle"
                size="x-small"
                :rounded="0"
                color="green"
                class="text-white mt-3"
                data-test="user.add-phone"
                tile
                block
                @click="push('')"
            />
          </FieldArray>

          <v-card-actions class="pb-3">
            formErrors - {{ formErrors }}
            <v-spacer />
            <v-btn
                color="primary"
                type="submit"
                :disabled="Object.keys(formErrors).length !== 0"
                data-test="user.submit"
            >
              Update
            </v-btn>
          </v-card-actions>
        </v-col>
      </v-row>
    </v-container>
  </form>
</template>


<script setup lang="ts">
// libs
import { Field, Form, FieldArray, SubmissionContext, ErrorMessage, useForm, useFieldArray } from 'vee-validate'
import { array, number, object } from 'yup'
import gql from 'graphql-tag'

const query = gql`
      query Countries {
  countries  {
    code
    name
    phone
    currency
    languages {
      code
      name
      native
    }
  }
}`

const initialValues = reactive({
  phone: [''],
})

const vSchema = object({
  phone: array()
      .of(
          number()
              .label('Phone')
              .typeError(`Phone must be a \`number\` type`)
      )
      .required()
      .min(1)
      .label('Phone'),
})

const { onResult } = useQuery(query)

const { handleSubmit, errors: formErrors, values, resetForm } = useForm({
  initialValues: initialValues,
  validationSchema: vSchema
})

onResult(async (queryResult) => {
  await nextTick()
  console.log('query completed values:')
  console.log(queryResult)
  const updatedValues = {
    phone: ["123", "234234"]
  }
  resetForm({
    values: updatedValues
  })
})

function onSubmit(values: any) {
  console.log(JSON.stringify(values, null, 2));
}

</script>
